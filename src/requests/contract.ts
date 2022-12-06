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
  * @returns: {success?: 'txnHashString'; error?: any, errorCode?: ErrorCode}
  * @dev: Create SBT event
  */
  public create(data: CreateRequest): Promise<ApiResponse<string>> {
    return this.request(`${versionPath}/create`, {
      method: RequestMethod.post,
      body: JSON.stringify(data),
    });
  }

  // Read

  /**
   * @param eventId: string of eventId.
   * @param address: a users address.
   * @returns: {success?: boolean; error?: any, errorCode?: ErrorCode}
   * @dev: Validate if an address has rights to claim a token.
   */
  public checkClaimAuthAddress(eventId: string, address: string): Promise<ApiResponse<boolean>> {
    return this.request(`${versionPath}/issued/${eventId}/${address}`, {
      method: RequestMethod.get,
    });
  }

  /**
   * @param eventId: string of eventId.
   * @param code: unique code - i.e. one associated to an offchain email address 
   * @returns: {success?: boolean; error?: any, errorCode?: ErrorCode}
   * @dev: Validate if a unique code has rights to claim a token.
   */
  public checkClaimAuthCode(eventId: string, code: string): Promise<ApiResponse<boolean>> {
    return this.request(`${versionPath}/issued-code/${eventId}/${code}`, {
      method: RequestMethod.get,
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param tokenId: (optional) on chain tokenId for a claimed token. issuedTo array will be populated if tokenId is found.
  * @returns: {eventData, metaData, issuedTo?}
  * @dev: Get a created SBT event - use when you need the most current data directly from chain.
  */
  public getCreatedToken(eventId: string, tokenId?: string): Promise<TokenDataResponse> {
    return this.request(`${versionPath}/created-token/${eventId}`, {
      method: RequestMethod.post,
      body: JSON.stringify(tokenId),
    });
  }

  /**
  * @param address: a users address.
  * @returns: {success?: TokenData[]; error?: any, errorCode?: ErrorCode}
  * @dev: Get SBTs for an address.
  */
  public getTokens(address: string): Promise<ApiResponse<TokenData[]>> {
    return this.request(`${versionPath}/tokens/${address}`, {
      method: RequestMethod.get,
    });
  }

  // Update

  /**
  * @param eventId: string of eventId.
  * @param address: address of receiver.
  * @param tokenId: on chain tokenId for a claimed token.
  * @param signature: signed message using getSignatureMessage. Address of signer must match address property.
  * @returns: {success?: boolean; error?: any, errorCode?: ErrorCode}
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
  * @returns: {success?: boolean; error?: any, errorCode?: ErrorCode}
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
   * @returns: {success?: boolean; error?: any, errorCode?: ErrorCode}
   * * @dev: Mint SBT to given address
   */
  public async claim(eventId: string, address: string, signature: string, uniqueCode?: string): Promise<ApiResponse<boolean>> {
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

  // TODO(nocs): get all tokens events for owner (or tenant?)


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