import { ethers } from 'ethers';

import { Base } from "../base";
import { ApiResponse, BindRequest, BurnRequest, ClaimRequest, CreateRequest, RequestMethod, TokenData, TokenDataResponse } from "./types";

const basePath = 'contract';
const versionPath = `/v1/${basePath}`

export class Contract extends Base {

  /**
   * CRUD
   */

  // Create

  /**
  * @param data: CreateRequest data
  * @returns: {success?: 'txnHashString'; errorCode?: ErrorCode}
  * @dev: Create SBT event.
  */
  public create(data: CreateRequest): Promise<ApiResponse<TokenData>> {
    return this.request(`${versionPath}/create`, {
      method: RequestMethod.post,
      body: JSON.stringify(data),
    });
  }

  // Read
  /**
  * @returns: {success?: TokenData[]; errorCode?: ErrorCode}
  * @dev: Get created SBT events that your organization has created.
  */
  public getAccountTokens(): Promise<ApiResponse<TokenData[]>> {
    return this.request(`${versionPath}/tenant/tokens`, {
      method: RequestMethod.get,
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param tokenId: (optional) on chain tokenId for a claimed token. issuedTo array will be populated if tokenId is found.
  * @returns: {eventData, metaData, issuedTo?}
  * @dev: Get a created SBT event - use when you need the most current data for a single event directly from chain.
  */
  public getCreatedToken(eventId: string, tokenId?: string): Promise<ApiResponse<TokenDataResponse>> {
    return this.request(`${versionPath}/created-token/${eventId}`, {
      method: RequestMethod.post,
      body: tokenId ? JSON.stringify({ tokenId }) : null,
    });
  }

  /**
  * @param address: a users address.
  * @param signature: signed message using getSignatureMessage. Address of signer must match address property.
  * @param tenantId: (optional) tenant ID to query as authorizedAccount. If using sdk, you most likely are looking for getAccountTokens().
  * @returns: {success?: TokenData[]; errorCode?: ErrorCode}
  * @dev: Get created SBT events for a specific address.
  */
  public getCreatedTokens(address: string, signature: string, tenantId?: string): Promise<ApiResponse<TokenData[]>> {
    return this.request(`${versionPath}/created-tokens/${address}/${signature}${tenantId ? '?tenantId=' + tenantId : '' }`, {
      method: RequestMethod.get,
    });
  }

  /**
  * @param address: a users address.
  * @returns: {success?: TokenData[]; errorCode?: ErrorCode}
  * @dev: Get SBTs for an address.
  */
  public getTokens(address: string): Promise<ApiResponse<TokenData[]>> {
    return this.request(`${versionPath}/tokens/${address}`, {
      method: RequestMethod.get,
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param address: a users address.
  * @returns: {success?: boolean; errorCode?: ErrorCode}
  * @dev: Validate that an address has rights to claim a token.
  */
  public validateClaimAuthAddress(eventId: string, address: string): Promise<ApiResponse<boolean>> {
    return this.request(`${versionPath}/issued/${eventId}/${address}`, {
      method: RequestMethod.get,
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param code: unique code - i.e. one associated to an offchain email address 
  * @returns: {success?: boolean; errorCode?: ErrorCode}
  * @dev: Validate that a unique code has rights to claim a token.
  */
  public validateClaimAuthCode(eventId: string, code: string): Promise<ApiResponse<boolean>> {
    return this.request(`${versionPath}/issued-code/${eventId}/${code}`, {
      method: RequestMethod.get,
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param address: a users address.
  * @param bound: (optional) require the token to be bound.
  * @returns: {success?: boolean; errorCode?: ErrorCode}
  * @dev: Validate that an address has claimed a token.
  */
  public validateClaimedToken(eventId: string, address: string, bound?: boolean): Promise<ApiResponse<boolean>> {
    return this.request(`${versionPath}/claimed/${eventId}/${address}${bound ? '?bound=' + bound : ''}`, {
      method: RequestMethod.get,
    });
  }

  // Update

  /**
  * @param eventId: string of eventId.
  * @param address: address of receiver.
  * @param tokenId: on chain tokenId for a claimed token.
  * @param signature: signed message using getSignatureMessage. Address of signer must match address property.
  * @returns: {success?: boolean; errorCode?: ErrorCode}
  * @dev: Bind SBT
  */
  public async bind(eventId: string, tokenId: string, address: string, signature: string): Promise<ApiResponse<boolean>> {
    const burnRequest: BindRequest = {
      address,
      eventId,
      tokenId,
      signature,
    }

    return this.request(`${versionPath}/bind`, {
      method: RequestMethod.patch,
      body: JSON.stringify(burnRequest),
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param address: address of receiver.
  * @param tokenId: on chain tokenId for a claimed token.
  * @param signature: signed message using getSignatureMessage. Address of signer must match address property.
  * @returns: {success?: boolean; errorCode?: ErrorCode}
  * @dev: Burn SBT
  */
  public async burn(eventId: string, tokenId: string, address: string, signature: string): Promise<ApiResponse<boolean>> {
    const burnRequest: BurnRequest = {
      address,
      eventId,
      tokenId,
      signature,
    }

    return this.request(`${versionPath}/burn`, {
      method: RequestMethod.patch,
      body: JSON.stringify(burnRequest),
    });
  }


  /**
   * @param eventId: string of eventId.
   * @param address: address of receiver.
   * @param signature: signed message using getSignatureMessage. Address of signer must match address property.
   * @param uniqueCode: (optional) code for restricted token.
   * @returns: {success?: 'tokenId'; errorCode?: ErrorCode}
   * * @dev: Mint SBT to given address
   */
  public async claim(eventId: string, address: string, signature: string, uniqueCode?: string): Promise<ApiResponse<string>> {
    const claimRequest: ClaimRequest = {
      signature,
      id: eventId,
      address,
    }

    if (uniqueCode) {
      claimRequest.uniqueCode = uniqueCode;
    }


    return this.request(`${versionPath}/claim`, {
      method: RequestMethod.patch,
      body: JSON.stringify(claimRequest),
    });
  }

  // Delete

  /**
   * END: CRUD
   */


  /*
  * START: Helper methods
  */
  public getSignatureMessage(address: string): Uint8Array {
    let messageHash = ethers.utils.solidityKeccak256(
      ["address"],
      [address]
    );

    return ethers.utils.arrayify(messageHash);
  }

  /*
  * END: Helper methods
  */


}