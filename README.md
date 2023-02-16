# Soulbind SDK

A complete soulbound token solution in JavaScript (and TypeScript).

<!-- ## Table of Contents -->

<!-- ## Preface

### Definitions -->

## Platform

Want to see what's possible? Check out the site we built with this SDK: [mainnet](https://app.soulbind.app/create) or [testnet](https://testnet.soulbind.app/create)

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

### Invoke

```js
...

const soulbind = new Soulbind({
    apiKey: 'YourApiKeyHere',
    // testnet: true, // Use this in your dev/test environments.
});

const { success } = await soulbind.getTokens('0xab5801a7d398351b8be11c439e05c5b3259aec9b');
console.log(success);
// Output: TokenData[]
```

# Table of Contents

- [Features](#features)
  - [Burn Auth](#burn-authorization)
  - [Restricted](#restricted)
  - [Transferable (until bound)](#transferable-until-bound)
  - [Updatable](#updatable)
- [Email](#email) - seamlessly onboard users via email.
  - [Connect](#emailconnect)
  - [Disconnect](#emaildisconnect)
  - [Get Signature](#getemailsignature)
  - [Get Address](#getemailwalletaddress)
- [Core](#core) - core methods for your soulbound tokens.
  - [Add To Issued](#addtoissued)
  - [Bind](#bind)
  - [Burn](#burn)
  - [Claim](#claim)
  - [Drop](#drop)
  - [Create](#create)
  - [Get Created Account Tokens](#getaccounttokens)
  - [Get Created Account Tokens Filtered](#getaccounttokensfiltered)
  - [Get Created Token](#getcreatedtoken)
  - [Get Signature Message](#getsignaturemessage)
  - [Get Tokens](#gettokens) - get all SBTs for a given address
  - [Increase Token Limit](#increaseTokenLimit)
  - [Update](#update)
  - [Validate Address Claim Authorization](#validateclaimauthaddress)
  - [Validate Code Claim Authorization](#validateclaimauthcode)
  - [Validate Claimed Token](#validateclaimedtoken)
- [Data Structures](#models)
  - [ApiResponse](#apiresponse) - generic response from all calls.
  - [BurnAuth](#burnauth)
  - [ClaimStatus](#claimstatus)
  - [ErrorCode](#errorcode)
  - [SbtMetadata](#sbtmetadata)
  - [Tenant](#tenant)
  - [Token](#token)
  - [TokenAttributes](#tokenattributes)
  - [TokenData](#tokendata) - main object.

# Features

## Burn Authorization

This allows you to set a token Burn Auth. Or in other words, after a token has been claimed, this will determine who has the right to burn/delete that token.

Options: Issuer (you), Claimer, Both, Neither.

## Restricted

Toggling this on allows you to pre-issue tokens to wallet AND/OR email addresses.

Data on who has claimed a token can be surfaced via our [Core Methods](#core) or within the Soulbind Token Management page ([mainnet](https://app.soulbind.app/manage) / [testnet](https://testnet.soulbind.app/manage)).

## Transferable (until bound)

Toggling this on will allow a token to be transferred until bound. After a user claims this token, they will have the ability to transfer this token at will. Users who own this token can choose to "[Soulbind](#bind)" it, preventing it from being transferred further.

Data on who has bound (or not bound) a token can be surfaced via our [Core Methods](#core) or within the Soulbind Token Management page ([mainnet](https://app.soulbind.app/manage) / [testnet](https://testnet.soulbind.app/manage)).

In our data structures, you will see this represented as BoE (Bind on Equip).

## Updatable

Creating a token with updatable functionality allows you to [update](#update) an individual token's metadata at a later date. Once a token has been claimed, you can update that token to reflect new data at any time.

# Methods

## Email

These methods are used to seamlessly onboard users via email. Perfect for, but not limited to, non-web3 native users.

### emailConnect

emailConnect(): string

Connects (or re-connects) a user via email address. For first-time connection, a UI will be displayed that walks the user through the process. Subsequent attempts to this call will re-connect the user without the UI process.

```js
const address = await soulbind.emailConnect();
console.log(address);
// Output: 0xab5801a7d398351b8be11c439e05c5b3259aec9b
```

### emailDisconnect

emailDisconnect(): string

Disconnects an email user.

```js
await soulbind.emailDisconnect();
```

### getEmailSignature

getEmailSignature(): Promise<string\>

Gets a signature hash that can be passed to Soulbind txn methods. i.e. [claim](#claim)

```js
const signature = await soulbind.getEmailSignature();
console.log(signature);
// Output: EVM signature for the connected address.
```

### getEmailWalletAddress

getEmailWalletAddress(): string

Returns the currently connected email wallet address.

```js
const address = soulbind.getEmailWalletAddress();
console.log(address);
// Output: 0xab5801a7d398351b8be11c439e05c5b3259aec9b
```

## Core

These are the core methods for your soulbound tokens.

### addToIssued

addToIssued(eventId, [AddToIssuedRequest](#addtoissuedrequest), [AuthorizationRequest](#authorizationrequest)): Promise<[ApiResponse](#apiresponse)<string[]\>>

Issues more tokens or unique codes. Accepts address whitelist, unique codes, or both.

```js
const authorizedAddress = await signer.getAddress();
const authorizedMessage = soulbind.getSignatureMessage(authorizedAddress);
const authorizersSignature = await signer.signMessage(authorizedMessage);

const data = {
  addresses: [
    '0xA1d04574E852cB814465E19220d06d04cDb272af',
    '0x3C229411128107734DCEA2c0b2Bd3B47755Fce16',
  ],
  codeCount: 5, // Generates 5 more unique codes.
};

const { success } = await soulbind.addToIssued('EventIdHere', data, {
  signature: authorizersSignature,
  message: authorizedMessage,
});
console.log(success);
// Output: 'txnHash'
```

### bind

bind(eventId, tokenId, address, signature, message): Promise<[ApiResponse](#apiresponse)<boolean\>>

Bind SBT. Only useable on BoE tokens.

```js
const receiverAddress = await signer.getAddress();
const message = soulbind.getSignatureMessage(address);
const receiverSignature = await signer.signMessage(message);

const { success } = await soulbind.bind(
  'EventIdHere',
  'TokenIdHere',
  receiverAddress,
  receiverSignature,
  message
);
console.log(success);
// Output: true
```

### burn

burn(eventId, tokenId, address, signature, message): Promise<[ApiResponse](#apiresponse)<boolean\>>

Burn a token for a given wallet address.

```js
const receiverAddress = await signer.getAddress();
const message = soulbind.getSignatureMessage(address);
const receiverSignature = await signer.signMessage(message);

const { success } = await soulbind.burn(
  'EventIdHere',
  'TokenIdHere',
  receiverAddress,
  receiverSignature,
  message
);
console.log(success);
// Output: true
```

### claim

claim(eventId, address, signature, message, uniqueCode?): Promise<[ApiResponse](#apiresponse)<boolean\>>

Mint SBT to given address.

```js
const receiverAddress = await signer.getAddress();
const message = soulbind.getSignatureMessage(address);
const receiverSignature = await signer.signMessage(message);

const { success } = await soulbind.claim(
  'EventIdHere',
  receiverAddress,
  receiverSignature,
  message
);
console.log(success);
// Output: tokenId
```

### drop

drop(eventId, dropTo, [AuthorizationRequest](#authorizationrequest)): Promise<[ApiResponse](#apiresponse)<string[]\>>

Drops a token to any number of addresses. This functions like a bulk [claim](#claim) that does not require receiver interaction.

**NOTE:** Only works with tokens that have BurnAuth.OwnerOnly OR BurnAuth.Both.

```js
const authorizedAddress = await signer.getAddress();
const authorizedMessage = soulbind.getSignatureMessage(authorizedAddress);
const authorizersSignature = await signer.signMessage(authorizedMessage);

const dropTo = [
  '0xA1d04574E852cB814465E19220d06d04cDb272af',
  '0x3C229411128107734DCEA2c0b2Bd3B47755Fce16',
];
const { success } = await soulbind.drop('EventIdHere', dropTo, {
  signature: authorizersSignature,
  message: authorizedMessage,
});
console.log(success);
// Output: ['txnHash', 'txnHash']
```

### create

createFile([FileUploadRequest](#fileuploadrequest))
createToken(data: CreateRequest)

Token creation is a 2-step process that involves uploading a token image and its metadata to IPFS and then creating a Token on the Soulbind protocol.

**NOTE:** This is in development. In the interim, use: Soulbind Create Page ([mainnet](https://app.soulbind.app/create) / [testnet](https://testnet.soulbind.app/create))

### getAccountTokens

getAccountTokens(): Promise<[ApiResponse](#apiresponse)<[TokenData](#tokendata)[]>>

Get SBT events that your organization has created.

```js
const { success } = await soulbind.getAccountTokens();
console.log(success);
// Output: TokenData[]
```

### getAccountTokensFiltered

**NOTE:** Used for specific account token queries or multi-tennant accounts. For a simpler query, use: [getAccountTokens()](#getaccounttokens)

getAccountTokensFiltered(address, signature, message): Promise<[ApiResponse](#apiresponse)<[TokenData](#tokendata)>>

Get SBT events that your address or other tenant that you are authorized to use has created.

```js
const creatorsAddress = await signer.getAddress();
const creatorsSignature = await signer.signMessage(soulbind.getSignatureMessage(address));

const { success } = await soulbind.getAccountTokensFiltered(creatorsAddress, creatorsSignature);
console.log(success);
// Output: TokenData[]
```

### getCreatedToken

getCreatedToken(eventId, tokenId?): Promise<[ApiResponse](#apiresponse)<[TokenData](#tokendata)>>

Get a created SBT - use when you need the most current TokenData directly from chain.
Pass in tokenId to populate the issuedTo property with token owner data.

```js
const eventId = 'EventIdHere';
const optionalTokenId = 'TokenIdHere';

const { success } = await soulbind.getCreatedToken(eventId, optionalTokenId);
console.log(success);
// Output: TokenData
```

### getSignatureMessage

**NOTE:** _required with most txn_

getSignatureMessage(address): string

Construct a formatted message to be signed by user and passed to Soulbind txn methods.

```js
  // Specific signature message used below
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

Get all SBTs for an address. For filter options see: [FilterType](#filtertype).

```js
const { success } = await soulbind.getTokens('0xab5801a7d398351b8be11c439e05c5b3259aec9b');
console.log(success);
// Output: TokenData[]
```

### increaseTokenLimit

increaseTokenLimit(eventId, limitIncrease, [AuthorizationRequest](#authorizationrequest)): Promise<[ApiResponse](#apiresponse)<string[]\>>

Increase token limit of a non-restricted token.

```js
const authorizedAddress = await signer.getAddress();
const authorizedMessage = soulbind.getSignatureMessage(authorizedAddress);
const authorizersSignature = await signer.signMessage(authorizedMessage);

const limitIncrease = 5;

const { success } = await soulbind.increaseTokenLimit('EventIdHere', limitIncrease, {
  signature: authorizersSignature,
  message: authorizedMessage,
});
console.log(success);
// Output: 'txnHash'
```

### update

update(updateRequest: [UpdateRequest](#updaterequest)): Promise<[ApiResponse](#apiresponse)<string\>>

Update a single token. Returns the update txn hash.

```js
const message = soulbind.getSignatureMessage(address);
const issuersAddress = await signer.getAddress();
const IssuersSignature = await signer.signMessage(message);

const newMetadata = {
  name: 'Awesome blossom',
  description: 'This token represents your level.',
  external_url: 'https://soulbind.app',
  attributes: [
    {
      trait_type: 'Level',
      value: '2',
    },
  ],
};

const updateRequest = {
  address: issuersAddress,
  eventId: 'EventIdHere',
  message,
  metaData: newMetadata,
  signature: IssuersSignature,
  tokenId: 'TokenIdHere', // ID of the token you will be updating.
  tokenUri: 'TokenUriHere',
};

const { success } = await soulbind.update(updateRequest);
console.log(success);
// Output: txnHash
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

Validate that an address has claimed a token.

```js
const eventId = 'EventIdHere';
const address = 'AddressHere';
const isTokenBound = true; // optional - use if your event is BOE and you want to validate that a token is soulbound.

const { success } = await soulbind.validateClaimedToken(eventId, address, isTokenBound);
console.log(success);
// Output: true/false
```

## Models

### AddToIssuedRequest

```js
interface AddToIssuedRequest {
  addresses?: string[]; // (optional) Array of addresses to add to whitelist.
  codeCount?: number; // (optional) Number representing how many unique codes to generate.
}
```

### AuthorizationRequest

```js
interface AuthorizationRequest {
  signature: string;
  message: string;
}
```

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

### CreateRequest

```js
interface CreateRequest {
  address: string;
  boe: boolean;
  burnAuth: BurnAuth;
  metaData: SbtMetadata;
  restricted: boolean;
  signature: string;
  tokenUri: string; // must be in the format: 'ipfs://<CID>/metadata.json'
  // restricted = false
  tokenLimit?: number;
  // restricted = true
  issuedToCodes?: Token[];
  issuedToWalletAddresses?: Token[];
}
```

Reference: [BurnAuth](#burn-authorization), [SbtMetadata](#sbtmetadata), [Token](#token)

### UpdateRequest

```js
interface UpdateRequest {
  address: string;
  eventId: string;
  message: string;
  metaData: SbtMetadata;
  signature: string;
  tokenId: string;
  tokenUri: string; // must be in the format: 'ipfs://<CID>/metadata.json'
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

### FileUploadRequest

```js
interface FileUploadRequest extends SbtMetadata {
  file: File; // js native file object
}
```

Reference: [SbtMetadata](#sbtmetadata), [File](https://developer.mozilla.org/en-US/docs/Web/API/File)

### FilterType

```js
interface FilterType {
  organization?: boolean; // return user owned tokens that your org has created.
  canClaim?: boolean; // return restricted tokens that have been issued but not claimed by the user.
}
```

Reference: [ClaimStatus](#claimstatus), [SbtMetadata](#SbtMetadata)

### SbtMetadata

```js
interface SbtMetadata {
  description: string;
  external_url: string;
  image: string; // IPFS URI or Backend Image data
  name: string;
  attributes: TokenAttributes[];
}
```

Reference: [TokenAttributes](#tokenattributes)

### Tenant

```js
interface Tenant {
  id: string;
  name: string;
}
```

### Token
```js
interface Token {
  created: number;
  eventId: string; // id of the EventToken
  status: ClaimStatus;
  to: string; // email address, wallet address, or code
  bound?: boolean; // true or false, only if eventtoken is BOE
  claimersEmail?: string; // added after a uniqueCode claim to retain email addresses
  code?: string; // secret code
  metaData?: SbtMetadata; // If token was updated, its data will display here.
  tenantId?: string; // Id of Tenant
  tokenId?: number | undefined; // On-chain token ID - not available for un-claimed issued tokens
  txnHash?: string; // Hash of the transaction that minted the token
}
```

### TokenAttributes

```js
interface TokenAttributes {
  trait_type: string;
  value: string | number;
}
```

### TokenData

This is the main object within the Soulbind ecosystem. When you create a token (see [create()](#create) or our create page [mainnet](https://app.soulbind.app/create) / [testnet](https://testnet.soulbind.app/create)) the Soulbind contract generates this object based on the data received. When users claim this token, data about that claim will be added to the issuedTo array. This includes who claimed the token in the form of a wallet address and the token's on-chain ID (tokenId).

```js
interface TokenData {
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
  restricted: boolean; // Pre-issued tokens = true
  txnHash: string; // Hash of the create transaction
}
```

Reference: [BurnAuth](#burnauth), [SbtMetadata](#sbtmetadata), [Tenant](#tenant), [Token](#token)
