# `Lisk React`

Simple react packages for building modern [Lisk dApps](https://lisk.com/docs/)

## @lisk-react/use-lisk
A react application built for the Lisk ecosystem will most likely use the following features:
- listen to blockchain changes such as (new blocks, active connections)
- Authenticate a user wallet for accessing private routes

For that, we introduce a global Lisk Context Provider:

#### Example
```javascript
import { LiskProvider } from '@lisk-react/use-lisk'

const targetNetwork = {
    nodeUrl: 'http://localhost:4000',
    wsUrl: 'ws://localhost:4001/ws'
}

function App () {
  return (
    <LiskProvider targetNetwork={targetNetwork}>
      {/* <...> */}
    </LiskProvider>
  )
}
```
LiskProvider brings you out of the box websocket connection, a wallet to authenticate the user and an up-to-date LiskAPIClient with all of the components listening to your given endpoints at the start.

### useLiskClient
useLiskClient can be called from within any function component to access context variables such as `isConnected`, `setTargetNetwork` or `block`

#### Example
```javascript
import { useLiskClient } from '@lisk-react/use-lisk'

function Component () {
  const { block, accounts, network: { isConnected, endpoint } } = useLiskClient()
  // ...
}
```

The hook returns to the following interface:

```typescript
interface UseLiskClientProps {
  block: Block // The latest decoded block produced by the blockchain
  accounts: LiskAccount[] // All decoded accounts involved in the last block
  network?: {
      isConnected: boolean // Indicator if LiskProvider is connected with the blockchain
      endpoint: { // Your given endpoints to LiskProvider
          wsUrl: string
          nodeUrl: string
      }
  }
}
```
### useLiskWallet
useLiskWallet can be called from within any function component to access context variables such as `isAuthenicated`, `authenticate`, `generateAccount` or `logout`

#### Example
```javascript
import { useLiskWallet } from '@lisk-react/use-lisk'

function Component () {
  const { authenticate, isAuthenicated } = useLiskWallet()
  // ...
}
```

The hook returns to the following interface:

```typescript
interface UseLiskWalletProps {
    account?: LiskAccount; // An up-to-date account when authenticated
    isAuthenticated: boolean; // indicator if the user is authenticated
    loading: boolean; // A state transition between authenticating and fetching the blockchain state
    generate(): LiskAccount; // A function that generate a random account
    logout(): void; // A reset function for the wallet
    setAccount(account: LiskAccount): void; // Persisting a generated account in the wallet
    authenticate(passphrase: string): void; // Authenticating the user via a given passphrase
}
```
## @lisk-react/use-wallet
A react application built for the Lisk ecosystem will most likely authenticate users so that part of the application can become private vs. public. The developer will need to define a authenication methods and make sure that application can react to user changes with ease. The `useWallet()` library will abstract all of those settings into an easy to use React hook.

#### Example
```javascript
import { LiskWalletProvider } from '@lisk-react/use-wallet'

function App () {
  return (
    <LiskWalletProvider>
      {/* <...> */}
    </LiskWalletProvider>
  )
}
```

### useLiskWallet
useLiskWallet can be called from within any function component to access context variables such as `isAuthenicated`, `authenticate`, `generateAccount` or `logout`

#### Example
```javascript
import { useLiskWallet } from '@lisk-react/use-wallet'

function Component () {
  const { authenticate, isAuthenicated } = useLiskWallet()
  // ...
}
```
