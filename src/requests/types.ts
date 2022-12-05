/**
 * Internal
 */
interface TokenAttributes {
  trait_type: string;
  value: string;
}

/**
 * External
 */

// Enums
export enum BurnAuth {
  IssuerOnly,
  OwnerOnly,
  Both,
  Neither
}

export enum ClaimStatus {
  issued,
  claimed,
  emailed,
  burned
}

// Interfaces
export interface ApiResponse<T> {
  error?: any,
  errorCode?: ErrorCode,
  success?: T;
}


export interface ClaimRequest {
  address: string;
  id: string;
  signature: string
  uniqueCode?: string;
}

export enum ErrorCode {
  entityExists = 'Entity already exists',
  entityDoesntExist = 'Entity does NOT exists',
  invalidRequest = 'Invalid request',
  unauthorized = 'Unauthorized',
}

export interface IssuedTo {
  to: string; // email address or wallet address
  status: ClaimStatus;
  bound?: boolean; // true or false, only if eventtoken is BOE
  code?: string; // secret code - for emails
  tokenId?: number | undefined;
}

export enum RequestMethod {
  delete = 'delete',
  get = 'get',
  patch = 'patch',
  post = 'post',
}

export interface SbtMetadata {
  description: string;
  external_url: string;
  image: string; // IPFS URI or Back Image data
  name: string;
  attributes: TokenAttributes;
}

export interface TokenData {
  boe: boolean;
  burnAuth: BurnAuth;
  count: number;
  limit: number;
  owner: string;
  restricted: boolean;
  uri: string;
}

export interface TokenDataResponse {
  eventData: TokenData,
  metaData: SbtMetadata,
  issuedTo?: IssuedTo[],
}
