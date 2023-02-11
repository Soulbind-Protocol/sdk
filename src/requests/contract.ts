import CryptoES from 'crypto-es';
import { ethers } from 'ethers';

import { Base } from '../base';
import { AddToIssuedRequest, ApiResponse, AuthorizationRequest, BindRequest, BurnRequest, ClaimRequest, CreateRequest, ErrorCode, FileUploadRequest, FileUploadReturn, FilterType, RequestMethod, TokenData, UpdateRequest } from './types';

const basePath = 'contract';
const versionPath = `/v1/${basePath}`

export class Contract extends Base {
  /**
   * CRUD
   */

  // Create

  /**
  * @param data: CreateRequest
  * @returns: {success?: 'txnHashString'; errorCode?: ErrorCode}
  * @dev: Create SBT event.
  */
  // public createToken(data: CreateRequest): Promise<ApiResponse<TokenData>> {
  //   return this.request(`${versionPath}/create`, {
  //     method: RequestMethod.post,
  //     body: JSON.stringify(data),
  //   });
  // }

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
  * @param address: an account admin address.
  * @param signature: signed message using getSignatureMessage. Address of signer must match address property.
  * @param message: message string returned from getSignatureMessage.
  * @param tenantId: (optional) tenant ID to query as authorizedAccount. If using sdk, you most likely are looking for getAccountTokens().
  * @returns: {success?: TokenData[]; errorCode?: ErrorCode}
  * @dev: Get created SBT events that your address or other tenant has created.
  */
  public getAccountTokensFiltered(address: string, signature: string, message: string, tenantId?: string): Promise<ApiResponse<TokenData[]>> {
    return this.request(`${versionPath}/created-tokens/${address}/${signature}?message=${encodeURIComponent(message)}${tenantId ? '&tenantId=' + tenantId : ''}`, {
      method: RequestMethod.get,
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param tokenId: (optional) on chain tokenId for a claimed token. issuedTo array will be populated if tokenId is found.
  * @returns: {success?: TokenData; errorCode?: ErrorCode}
  * @dev: Get a created SBT event - use when you need the most current data for a single event directly from chain.
  */
  public getCreatedToken(eventId: string, tokenId?: string): Promise<ApiResponse<TokenData>> {
    return this.request(`${versionPath}/created-token/${eventId}`, {
      method: RequestMethod.post,
      body: tokenId ? JSON.stringify({ tokenId }) : null,
    });
  }

  /**
  * @dev: Get a created SBT event with all issuedTo tokens returned
  */
  public getCreatedTokenAsAdmin(eventId: string, address: string, signature: string, message: string): Promise<ApiResponse<TokenData>> {
    return this.request(`${versionPath}/created-token/${eventId}`, {
      method: RequestMethod.post,
      body: JSON.stringify({ address, signature, message }),
    });
  }

  /**
  * @param address: a users address.
  * @param filter: filter by pre-defined field. i.e. filter = { organization: true } will return user owned tokens that your org has created.
  * @returns: {success?: TokenData[]; errorCode?: ErrorCode}
  * @dev: Get SBTs for an address.
  */
  public getTokens(address: string, filter?: FilterType): Promise<ApiResponse<TokenData[]>> {
    let filterParsed: FilterType;
    if (filter) {
      filterParsed = Object.fromEntries(
        Object.entries(filter).map(
          ([key, value]) => value && (key === 'organization' || key === 'canClaim' ? [key, true] : [])
        )
      );
    }

    return this.request(`${versionPath}/tokens/${address}${filterParsed ? '?' + new URLSearchParams(filterParsed as any).toString() : ''}`, {
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
  * @param data: {addresses, codeCount} See AddToIssuedRequest.
  * @param authorization: {signature, message} See AuthorizationRequest.
  * @returns: {success?: 'txnHash'; errorCode?: ErrorCode}
  * * @dev: Issues more tokens to users for future claiming. Add to address whitelist or add more unique codes.
  */
  public async addToIssued(eventId: string, data: AddToIssuedRequest, authorization: AuthorizationRequest): Promise<ApiResponse<string>> {
    return this.request(`${versionPath}/add-issued-to`, {
      method: RequestMethod.patch,
      body: JSON.stringify({
        eventId,
        addresses: data.addresses,
        codeCount: data.codeCount,
        signature: authorization.signature,
        message: authorization.message
      }),
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param address: address of receiver.
  * @param tokenId: on chain tokenId for a claimed token.
  * @param signature: signed message using getSignatureMessage. Address of signer must match address property.
  * @param message: message string returned from getSignatureMessage.
  * @returns: {success?: boolean; errorCode?: ErrorCode}
  * @dev: Bind SBT
  */
  public async bind(eventId: string, tokenId: string, address: string, signature: string, message: string): Promise<ApiResponse<boolean>> {
    const bindRequest: BindRequest = {
      address,
      eventId,
      tokenId,
      signature,
      message,
    }

    return this.request(`${versionPath}/bind`, {
      method: RequestMethod.patch,
      body: JSON.stringify(bindRequest),
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param address: address of receiver.
  * @param tokenId: on chain tokenId for a claimed token.
  * @param signature: signed message using getSignatureMessage. Address of signer must match address property.
  * @param message: message string returned from getSignatureMessage.
  * @returns: {success?: boolean; errorCode?: ErrorCode}
  * @dev: Burn SBT
  */
  public async burn(eventId: string, tokenId: string, address: string, signature: string, message: string): Promise<ApiResponse<boolean>> {
    const burnRequest: BurnRequest = {
      address,
      eventId,
      tokenId,
      signature,
      message,
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
  * @param message: message string returned from getSignatureMessage.
  * @param uniqueCode: (optional) code for restricted token.
  * @returns: {success?: 'tokenId'; errorCode?: ErrorCode}
  * * @dev: Mint SBT to given address
  */
  public async claim(eventId: string, address: string, signature: string, message: string, uniqueCode?: string): Promise<ApiResponse<string>> {
    const claimRequest: ClaimRequest = {
      signature,
      id: eventId,
      address,
      message,
    }

    if (uniqueCode) {
      claimRequest.uniqueCode = uniqueCode;
    }


    return this.request(`${versionPath}/claim`, {
      method: RequestMethod.patch,
      body: JSON.stringify(claimRequest),
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param dropTo: Array of addresses to drop to.
  * @param authorization: {signature, message} See AuthorizationRequest.
  * @returns: {success?: 'txnHashes'[]; errorCode?: ErrorCode}
  * * @dev: Drop a token to any number of addresses. Only works with tokens that have BurnAuth.OwnerOnly OR BurnAuth.Both.
  */
  public async drop(eventId: string, dropTo: string[], authorization: AuthorizationRequest): Promise<ApiResponse<string>> {
    return this.request(`${versionPath}/drop`, {
      method: RequestMethod.patch,
      body: JSON.stringify({
        eventId,
        dropTo, signature: authorization.signature,
        message: authorization.message
      }),
    });
  }

  /**
  * @param eventId: string of eventId.
  * @param limitIncrease: Amount of additional possible tokens you want to add.
  * @param authorization: {signature, message} See AuthorizationRequest.
  * @returns: {success?: 'txnHash'; errorCode?: ErrorCode}
  * * @dev: Increase token limit of a non-restricted token.
  */
  public async increaseTokenLimit(eventId: string, limitIncrease: number, authorization: AuthorizationRequest): Promise<ApiResponse<string>> {
    return this.request(`${versionPath}/increase-token-limit`, {
      method: RequestMethod.patch,
      body: JSON.stringify({
        eventId,
        limitIncrease,
        signature: authorization.signature,
        message: authorization.message
      }),
    });
  }

  /**
  * @param updateRequest: UpdateRequest object
  * @returns: {success?: 'txnHash'; errorCode?: ErrorCode}
  * * @dev: Update a single token.
  */
  public async update(updateRequest: UpdateRequest): Promise<ApiResponse<string>> {
    return this.request(`${versionPath}/update`, {
      method: RequestMethod.patch,
      body: JSON.stringify(updateRequest),
    });
  }

  // Delete

  /**
   * END: CRUD
   */


  /*
  * START: Helper methods
  */

  /**
  * 
  * @param address: address of signer.
  * @returns: Message ready to be signed by user.
  */
  public getSignatureMessage(address: string): string {
    const randomValues = CryptoES.SHA256(CryptoES.lib.WordArray.random(128 / 8)).toString(CryptoES.enc.Base64);
    const rawMessage = `Signing confirms that you own this address:\n${address}\n~~Security~~\nTimestamp: ${Date.now()}\nNonce: ${ethers.utils.keccak256(ethers.utils.toUtf8Bytes(randomValues))}`;
    return `${rawMessage}\nHash: ${ethers.utils.keccak256(ethers.utils.toUtf8Bytes(rawMessage))}`;
  }

  /*
  * END: Helper methods
  */


}

