import { Base } from "../base";
import { ApiResponse, ClaimRequest, RequestMethod, TokenDataResponse } from "./types";

const basePath = 'contract';
const versionPath = `/v1/${basePath}`

export class Contract extends Base {

  /**
   * CRUD
   */

  // Create

  // Read
  /**
 * @param eventId: string of eventId.
 * @param tokenId: (optional) on chain tokenId for a claimed token.
 * @returns: {eventData, metaData, issuedTo?}
 */
  public getCreatedToken(eventId: string, tokenId?: string): Promise<TokenDataResponse> {
    return this.request(`${versionPath}/created-tokens/${eventId}`, {
      method: RequestMethod.post,
      body: JSON.stringify(tokenId),
    });
  }

  // Update
  /**
   * 
   * @param eventId: string of eventId.
   * @param uniqueCode: (optional) uniqueCode for restricted token
   * @returns: {success?: boolean; error?: any, errorCode?: ErrorCode}
   */
  public async claimToken(eventId: string, address: string, signature: string, uniqueCode?: string): Promise<ApiResponse<boolean>> {
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

  /*
  * END: Helper methods
  */


}