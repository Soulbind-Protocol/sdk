import { Base } from "../base";
import { RequestMethod, TokenDataResponse } from "./types";

const basePath = 'contract';
const versionPath = `/v1/${basePath}`

export class Contract extends Base {

  /**
   * @param eventId: string of raw eventId.
   * @param tokenId: (optional) on chain tokenId for a claimed token.
   * @returns: {eventData, metaData, issuedTo?}
   */
  getCreatedToken(eventId: string, tokenId?: string): Promise<TokenDataResponse> {
    return this.request(`${versionPath}/created-tokens/${eventId}`, {
      method: RequestMethod.post,
      body: JSON.stringify(tokenId),
    });
  }

}