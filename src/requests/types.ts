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

export interface AddToIssuedRequest {
  addresses?: string[]; // (optional) Array of addresses to add to whitelist.
  codeCount?: number; // (optional) Number representing how many unique codes to generate.
}

export interface AuthorizationRequest {
  signature: string;
  message: string;
}

export interface BindRequest {
  address: string;
  eventId: string;
  message: string;
  signature: string;
  tokenId: string;
}

export interface BurnRequest {
  address: string;
  eventId: string;
  message: string;
  signature: string;
  tokenId: string;
}


export interface ClaimRequest {
  address: string;
  id: string;
  signature: string
  message: string;
  uniqueCode?: string;
}

export interface CreateRequest {
  address: string;
  boe: boolean;
  burnAuth: BurnAuth;
  metaData: SbtMetadata;
  restricted: boolean;
  signature: string;
  tokenUri: string; // must be in the format: 'ipfs://<CID>/metadata.json'
  // restricted = true
  tokenLimit?: number,
  // restricted = false
  issuedToCodes?: Token[],
  issuedToWalletAddresses?: Token[],
}

export interface UpdateRequest {
  address: string;
  eventId: string;
  message: string;
  metaData: SbtMetadata;
  signature: string;
  tokenId: string;
  tokenUri: string; // must be in the format: 'ipfs://<CID>/metadata.json'
}

export interface FileUploadReturn {
  uri: string;
  metaData: SbtMetadata;
}

export interface FileUploadRequest extends SbtMetadata {
  file: File;
}

export interface FilterType {
  organization?: boolean, // return user owned tokens that your org has created.
  canClaim?: boolean, // return restricted tokens that have been issued but not claimed by the user.
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
  image: string; // Cloud replicated URL of data that exists on IPFS
  name: string;
  attributes: TokenAttributes[];
}

export interface Tenant {
  id: string;
  name: string;
}

export interface Token {
  created: number;
  eventId: string; // id of the EventToken
  status: ClaimStatus;
  to: string; // email address, wallet address, or code
  bound?: boolean; // true or false, only if eventtoken is BOE
  claimersEmail?: string; // added after a uniqueCode claim to retain email addresses
  code?: string; // secret code
  metaData?: SbtMetadata; // If token was updated, its data will display here.
  tenantId?: string; // Id of Tenant
  tokenId?: number | undefined; // On-chain token ID - not available for un-claimed issuedTokens
  txnHash?: string; // Hash of the transaction that minted the token
}

export interface TokenAttributes {
  trait_type: string;
  value: string | number;
}

export interface TokenData {
  boe: boolean; // Bind on equip. Makes the token an NFT (true) or SBT (false)
  burnAuth: BurnAuth;
  count: number;
  contract: string; // The contract that this token was minted on - for backwards compatability
  created: number;
  id: string; // eventId
  idHash: string; // hash of eventId
  issuedTo: Token[]; // Individual claimed/issued tokens
  limit: number;
  metaData: SbtMetadata;
  owner: string; // issuer wallet address
  tenant: Tenant;
  updatable: boolean; // Set at create time. Toggles if a token is updatable.
  restricted: boolean; // Pre-issued tokens = true
  txnHash: string; // Hash of the create transaction
}
