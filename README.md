# `Lisk React`

Simple react packages for building modern [Lisk dApps](https://lisk.com/docs/)

## @lisk-react/use-client
A react application built for the Lisk ecosystem will most likely listen to blockchain changes such as new blocks, set active connections, .. The developer will need to define a websocket listener, decode new blocks and needs to make sure that the application can change with those new blocks. The `useClient()` library will abstract all of those settings into an easy to use React hook.

#### Example
```javascript
import { LiskClientProvider } from '@lisk-react/use-client'

const targetNetwork = {
    nodeUrl: 'http://localhost:4000',
    wsUrl: 'ws://localhost:4001/ws'
}

function App () {
  return (
    <LiskClientProvider targetNetwork={targetNetwork}>
      {/* <...> */}
    </LiskClientProvider>
  )
}
```
### useLiskClient
useLiskClient can be called from within any function component to access context variables such as `isConnected`, `setTargetNetwork` or `block`

#### Example
```javascript
import { useLiskClient } from '@lisk-react/use-client'

function Component () {
  const { block, isConnected } = useLiskClient()
  // ...
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
A neat feature of `useLiskWallet` is that we use `useLiskClient` internally if there is an active connection. If used correctly, our `LiskWalletProvider` will make sure that the account object is in sync with the blockchain state.
#### Example
```javascript
import { LiskClientProvider } from '@lisk-react/use-client'
import { LiskWalletProvider } from '@lisk-react/use-wallet'

function App () {
  return (
    <LiskClientProvider>
        <LiskWalletProvider>
            {/* <...> */}
        </LiskWalletProvider>
    </LiskClientProvider>
  )
}
```
