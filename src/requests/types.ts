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

export enum ErrorCode {
  entityExists = 'Entity already exists',
  entityDoesntExist = 'Entity does NOT exists',
  invalidRequest = 'Invalid request',
  unauthorized = 'Unauthorized',
}

// Interfaces
export interface ApiResponse<T> {
  errorCode?: ErrorCode,
  success?: T;
}

export interface BindRequest {
  address: string;
  eventId: string;
  signature: string;
  tokenId: string;
}

export interface BurnRequest {
  address: string;
  eventId: string;
  signature: string;
  tokenId: string;
}

export interface ClaimRequest {
  address: string;
  id: string;
  signature: string
  uniqueCode?: string;
}

export interface CreateRequest {
  id: string // EventId
  tokenUri: string;
  boe: boolean;
  burnAuth: BurnAuth;
  address: string;
  signature: string;
  restricted: boolean;
  metaData: SbtMetadata;
  // non-issued
  tokenLimit?: number,
  // pre-issued
  issuedToWalletAddresses?: IssuedTo[],
  issuedToCodes?: IssuedTo[],
}

export interface IssuedTo {
  to: string; // email address or wallet address
  status: ClaimStatus;
  bound?: boolean; // true or false, only if eventtoken is BOE
  claimersEmail?: string; // added after a uniqueCode claim to retain email addresses
  code?: string; // secret code - for emails
  tokenId?: number | undefined;
}

export enum RequestMethod {
  delete = 'DELETE',
  get = 'GET',
  patch = 'PATCH',
  post = 'POST',
}

export interface SbtMetadata {
  description: string;
  external_url: string;
  image: string; // IPFS URI
  name: string;
  attributes: TokenAttributes[];
}

export interface TokenAttributes {
  trait_type: string;
  value: string;
}

export interface TokenData {
  boe: boolean; // Bind on equip. Makes the token an NFT (true) or SBT (false)
  burnAuth: BurnAuth;
  count: number;
  contract: string; // The contract that this token was minted on - for backwards compatability
  created: number;
  id: string; // eventId
  idHash: string; // hash of eventId
  issuedTo: IssuedTo[]; // both email and wallet addresses live here
  limit: number;
  metaData: SbtMetadata;
  owner: string; // issuer wallet address
  restricted: boolean; // Pre-issued tokens = true
  txnHash: string; // Hash of the create transaction
}

export interface TokenDataResponse {
  eventData: TokenData,
  metaData: SbtMetadata,
  issuedTo?: IssuedTo[],
}
