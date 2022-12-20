# Soulbind SDK

A complete soulbound token solution in JavaScript (and TypeScript).

<!-- ## Table of Contents -->

<!-- ## Preface

### Definitions -->

## Installation

### Using NPM

```bash
npm i @soulbind/sdk
```

## Usage

### Import

```js
import Soulbind from '@soulbind/sdk';
```

### Require

```js
const Soulbind = require('@soulbind/sdk');
```

### Invoke

```js
...

const soulbind = new Soulbind({
    apiKey: 'YourApiKeyHere',
});

const { success } = await soulbind.getTokens('0xab5801a7d398351b8be11c439e05c5b3259aec9b');
console.log(success);
// Output: TokenData[]
```

## Methods

### burn

burn(eventId, tokenId, address, signature): Promise<[ApiResponse](#apiresponse)<boolean\>>

Burn a token for a given wallet address.

```js
const receiverAddress = await signer.getAddress();
const receiverSignature = await signer.signMessage(soulbind.getSignatureMessage(address));

const { success } = await soulbind.burn(
  'EventIdHere',
  'TokenIdHere',
  receiverAddress,
  receiverSignature
);
console.log(success);
// Output: true
```

### claim

claim(eventId, address, signature, uniqueCode?): Promise<[ApiResponse](#apiresponse)<boolean\>>

Mint SBT to given address.

```js
const receiverAddress = await signer.getAddress();
const receiverSignature = await signer.signMessage(soulbind.getSignatureMessage(address));

const { success } = await soulbind.claim('EventIdHere', receiverAddress, receiverSignature);
console.log(success);
// Output: tokenId
```

### create (coming soon)

Create a token event.

**NOTE:** This is in development. In the interim, use: [Soulbind Create Page](https://app.soulbind.app/create)

### getAccountTokens

getAccountTokens(): Promise<[ApiResponse](#apiresponse)<[TokenData](#tokendata)[]>>

Get created SBT events that your organization has created.

```js
const { success } = await soulbind.getAccountTokens();
console.log(success);
// Output: TokenData[]
```

### getCreatedToken

getCreatedToken(eventId, tokenId?): Promise<[ApiResponse](#apiresponse)<[TokenDataResponse](#tokendataresponse)>>

Get a created SBT event - use when you need the most current data for a single event directly from chain.

```js
const eventId = 'EventIdHere';
const optionalTokenId = 'TokenIdHere';

const { success } = await soulbind.getCreatedToken(eventId, optionalTokenId);
console.log(success);
// Output: TokenDataResponse
```

### getCreatedTokens

getCreatedTokens(address, signature): Promise<[ApiResponse](#apiresponse)<[TokenData](#tokendata)>>

Get created SBT events for a specific address.

```js
const creatorsAddress = await signer.getAddress();
const creatorsSignature = await signer.signMessage(soulbind.getSignatureMessage(address));

const { success } = await soulbind.getCreatedTokens(creatorsAddress, creatorsSignature);
console.log(success);
// Output: TokenData[]
```

### getSignatureMessage

**NOTE:** _required with most txn_

getSignatureMessage(address, preventArrayify?): Uint8Array | string

Construct a formatted message to be signed by user and passed to Soulbind txn methods.

```js
  // Specific signature message used below
  // NOTE: If you provider does not need an Uint8Array message, use soulbind.getSignatureMessage(address, true)
  const signatureMessage = soulbind.getSignatureMessage(address);

  // This example uses ethers.js to get a signer - use w/e method you currently have to get a signer.
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  // Using your signer, get the user to sign the signatureMessage from above.
  const signature = await signer.signMessage(signatureMessage);

  // Pass signature to Soulbind txn methods
  ...
```

### getTokens

getTokens(address, filter?): Promise<[ApiResponse](#apiresponse)<[TokenData](#tokendata)[]>>

Get all SBTs for an address. If `filter = true`, only tokens for your organization will be returned.

```js
const { success } = await soulbind.getTokens('0xab5801a7d398351b8be11c439e05c5b3259aec9b');
console.log(success);
// Output: TokenData[]
```

### validateClaimAuthAddress

validateClaimAuthAddress(eventId, address): Promise<[ApiResponse](#apiresponse)<boolean\>>

Validate if an address has rights to claim a token.

```js
const eventId = 'EventIdHere';
const address = 'AddressHere';

const { success } = await soulbind.validateClaimAuthAddress(eventId, address);
console.log(success);
// Output: true
```

### validateClaimAuthCode

validateClaimAuthCode(eventId: string, code: string): Promise<[ApiResponse](#apiresponse)<boolean\>>

Validate if a unique code has rights to claim a token.

```js
const eventId = 'EventIdHere';
const code = 'CodeHere';

const { success } = await soulbind.validateClaimAuthCode(eventId, code);
console.log(success);
// Output: true
```

### validateClaimedToken

validateClaimedToken(eventId, address, bound?): Promise<[ApiResponse](#apiresponse)<boolean\>>

Validate if a unique code has rights to claim a token.

```js
const eventId = 'EventIdHere';
const address = 'AddressHere';
const isTokenBound = true; // optional - use if your event is BOE and you want to validate that a token is soulbound.

const { success } = await soulbind.validateClaimedToken(eventId, address, isTokenBound);
console.log(success);
// Output: true/false
```

## Models

### ApiResponse

```js
interface ApiResponse<T> {
  errorCode?: ErrorCode;
  success?: T;
}
```

Reference: [ErrorCode](#errorcode)

### BurnAuth

```js
enum BurnAuth {
  IssuerOnly,
  OwnerOnly,
  Both,
  Neither
}
```

### ClaimStatus

```js
enum ClaimStatus {
  issued,
  claimed,
  emailed,
  burned
}
```

### ErrorCode

```js
enum ErrorCode {
  entityExists = 'Entity already exists',
  entityDoesntExist = 'Entity does NOT exists',
  invalidRequest = 'Invalid request',
  unauthorized = 'Unauthorized',
}
```

### IssuedTo

```js
interface IssuedTo {
  to: string; // email address or wallet address
  status: ClaimStatus;
  bound?: boolean; // true or false, only if eventtoken is BOE
  claimersEmail?: string; // added after a uniqueCode claim to retain email addresses
  code?: string; // secret code - for emails
  tokenId?: number | undefined;
  txnHash?: string; // Hash of the transaction that minted the token
}
```

Reference: [ClaimStatus](#claimstatus)

### RequestMethod

```js
enum RequestMethod {
  delete = 'delete',
  get = 'get',
  patch = 'patch',
  post = 'post',
}
```

### SbtMetadata

```js
interface SbtMetadata {
  description: string;
  external_url: string;
  image: string; // IPFS URI or Back Image data
  name: string;
  attributes: TokenAttributes[];
}
```

Reference: [TokenAttributes](#tokenattributes)

### TokenAttributes

```js
interface TokenAttributes {
  trait_type: string;
  value: string;
}
```

### TokenData

```js
interface TokenData {
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
```

Reference: [BurnAuth](#burnauth), [IssuedTo](#issuedto), [SbtMetadata](#sbtmetadata)

### TokenDataResponse

```js
interface TokenDataResponse {
  eventData: TokenData;
  metaData: SbtMetadata;
  issuedTo?: IssuedTo[];
}
```

Reference: [TokenData](#tokendata), [SbtMetadata](#sbtmetadata), [IssuedTo](#issuedto)
