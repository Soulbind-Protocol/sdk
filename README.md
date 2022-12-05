# Soulbind SDK

A complete soulbound token solution in JavaScript (and TypeScript).

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

### Evoke

```js
...

const soulbind = new Soulbind({
    apiKey: 'YourApiKeyHere',
});

soulbind.getCreatedToken('EventIdHere').then((tokenData) => {
    console.log(tokenData)
});
// Output
// {
//     eventData,
//     metaData,
//     issuedTo,
// }
```

## Methods

### claimToken

Claim a token for a given wallet address and signer

```js
const receiverAddress = await signer.getAddress();
const receiverSignature = await signer.signMessage(soulbind.getSignatureMessage(address));

soulbind.claimToken('EventIdHere', 'ReceiverAddress', 'ReceiverSignature').then((response) => {
  console.log(response.success);
  // Output: true
});
```

### getCreatedToken

Returns an on-chain event (aka token shell)

```js
soulbind.getCreatedToken('EventIdHere').then((tokenData) => {
  console.log(tokenData);
});
```

### getSignatureMessage - _required with most txn_

Construct a formatted message to be signed by user and passed to soulbind txn methods.

```js
  const signatureMessage = soulbind.getSignatureMessage(address);
  
  // This example uses ethers.js and Infura to get a signer.
  const provider = new ethers.providers.InfuraProvider(
    process.env.EVM_NETWORK,
    process.env.INFURA_API_KEY
  );
  const signer = new ethers.Wallet({ address: process.env.SIGNER_ADDRESS as string, privateKey: process.env.SIGNER_KEY as string }, provider);
  const address = await signer.getAddress();

  // Using your signer, get the user to sign the signatureMessage from above.
  const signature = await signer.signMessage(signatureMessage);

  // Pass signature to Soulbind txn methods
```

## Models

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

### IssuedTo

```js
interface IssuedTo {
  to: string; // email address or wallet address
  status: ClaimStatus;
  bound?: boolean; // true or false, only if eventtoken is BOE
  code?: string; // secret code - for emails
  tokenId?: number | undefined;
}
```

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
  attributes: TokenAttributes;
}
```

### TokenData

```js
interface TokenData {
  boe: boolean;
  burnAuth: BurnAuth;
  count: number;
  limit: number;
  owner: string;
  restricted: boolean;
  uri: string;
}
```

### TokenDataResponse

```js
interface TokenDataResponse {
  eventData: TokenData;
  metaData: SbtMetadata;
  issuedTo?: IssuedTo[];
}
```
