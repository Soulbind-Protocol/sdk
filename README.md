# Soulbind SDK

A complete soulbound token solution in JavaScript (and TypeScript).

<!-- ## Table of Contents -->

<!-- ## Preface

### Definitions -->

## Platform
Want to see what's possible? Check out the site we built with this SDK: [app.soulbind.app](https://app.soulbind.app/create)

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
});

const { success } = await soulbind.getTokens('0xab5801a7d398351b8be11c439e05c5b3259aec9b');
console.log(success);
// Output: TokenData[]
```

# Table of Contents

- [Features](#features)
  - [Bind on Equip (BoE)](#bind-on-equip-boe)
  - [Burn Auth](#burn-authorization)
  - [Restricted](#restricted)
  - [Updatable](#updatable)
- [Email](#email) - seamlessly onboard users via email.
  - [Connect](#emailconnect)
  - [Disconnect](#emaildisconnect)
  - [Get Signature](#getemailsignature)
  - [Get Address](#getemailwalletaddress)
- [Core](#core) - core methods for your soulbound tokens.
  - [Bind](#bind)
  - [Burn](#burn)
  - [Claim](#claim)
  - [Create](#create)
  - [Get Created Account Tokens](#getaccounttokens)
  - [Get Created Account Tokens Filtered](#getaccounttokensfiltered)
  - [Get Created Token](#getcreatedtoken)
  - [Get Signature Message](#getsignaturemessage)
  - [Get User Tokens](#gettokens)
  - [Update](#update)
  - [Validate Address Claim Authorization](#validateclaimauthaddress)
  - [Validate Code Claim Authorization](#validateclaimauthcode)
  - [Validate Claimed Token](#validateclaimedtoken)
- [Data Structures](#models)
  - [ApiResponse](#apiresponse) - generic response from all calls.
  - [BurnAuth](#burnauth)
  - [ClaimStatus](#claimstatus)
  - [ErrorCode](#errorcode)
  - [IssuedTo](#issuedto)
  - [SbtMetadata](#sbtmetadata)
  - [TokenAttributes](#tokenattributes)
  - [TokenData](#tokendata) - main object.

# Features

## Bind on Equip (BoE)

Toggling this on will allow a token to be transferred until bound. After a user claims this token, they will have the ability to transfer this token at will. Users who own this token can choose to "[Soulbind](#bind)" it, preventing it from being transferred further.

Data on who has bound (or not bound) a token can be surfaced via our [Core Methods](#core) or within the Soulbind Token Management page (coming soon).

## Burn Authorization

This allows you to set a token Burn Auth. Or in other words, after a token has been claimed, this will determine who has the right to burn/delete that token.

Options: Issuer (you), Claimer, Both, Neither.

## Restricted

Toggling this on allows you to pre-issue tokens to wallet AND/OR email addresses.

Data on who has claimed a token can be surfaced via our [Core Methods](#core) or within the Soulbind Token Management page (coming soon).

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

### create

(coming soon) Create a token event.

**NOTE:** This is in development. In the interim, use: [Soulbind Create Page](https://app.soulbind.app/create)

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

Get a created SBT event - use when you need the most current data for a single event directly from chain. 
Pass in tokenId to populate the issuedTo property.

```js
const eventId = 'EventIdHere';
const optionalTokenId = 'TokenIdHere';

const { success } = await soulbind.getCreatedToken(eventId, optionalTokenId);
console.log(success);
// Output: TokenData
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

### update

<!-- update(tokenId, eventId, metadata, address, signature, message): Promise<[ApiResponse](#apiresponse)<boolean\>> -->

(coming soon) Update a token.

<!-- TODO(nocs): update this with an individual token get - based on tokenId -->

<!-- ```js
const tokenId = 'TokenIdHere';
const eventId = 'EventIdHere';
const issuersAddress = await signer.getAddress();
const message = soulbind.getSignatureMessage(address);
const IssuersSignature = await signer.signMessage(message);

const newMetadata = {
  name: 'Awesome blossom'
  description: 'This token represents your level.'
  attributes: [
    {
      "trait_type": "Level",
      "value": "2"
    },
  ]
}

const { success } = await soulbind.update(tokenId, eventId, issuersAddress, IssuersSignature, message);
console.log(success);
// Output: true
``` -->

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

### TokenAttributes

```js
interface TokenAttributes {
  trait_type: string;
  value: string | number;
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
