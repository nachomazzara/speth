import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import { ETHERSCAN_URI } from './constants'
import Transactions from './components/Transactions'
import CustomTransaction from './components/CustomTransaction'
import Tutorial from './components/Tutorial'

import './App.css'

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 42, 56, 97, 137, 80001],
})

const walletConnect = new WalletConnectConnector({
  rpc: {
    1: 'https://mainnet.infura.io/v3/85bbcb55329846258cda4ad9734d2e1f',
    3: 'https://ropsten.infura.io/v3/85bbcb55329846258cda4ad9734d2e1f',
    4: 'https://rinkeby.infura.io/v3/85bbcb55329846258cda4ad9734d2e1f',
    5: 'https://goerli.infura.io/v3/85bbcb55329846258cda4ad9734d2e1f',
    42: 'https://kovan.infura.io/v3/85bbcb55329846258cda4ad9734d2e1f',
    137: 'https://polygon-mainnet.infura.io/v3/fa3357a65e2d4214ac735190646a3c53',
    80001: 'https://polygon-mumbai.infura.io/v3/fa3357a65e2d4214ac735190646a3c53',
 },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
})

const walletLinkConnector = new WalletLinkConnector({
  appName: 'speth',
  url: 'https://mainnet.infura.io/v3/85bbcb55329846258cda4ad9734d2e1f',
})

function App() {
  const [showTutorial, setShowTutorial] = useState(false)
  const { account, chainId, activate, active } = useWeb3React()

  function handleConnect(connector: AbstractConnector) {
    activate(connector, undefined, true).catch((e) => {
      console.error(e.message)
    })
  }

  function handleShowTutorial() {
    setShowTutorial(!showTutorial)
  }

  return (
    <div className="container">
      {active ? (
        <>
          <div className="how-it-works">
            <button onClick={handleShowTutorial}>How it works</button>
          </div>
          <h1 className="wallet">
            Connected:{' '}
            <a
              href={`${ETHERSCAN_URI[chainId || 1]}/address/${account}`}
              rel="noreferrer"
              target="_blank"
            >
              {account}
            </a>
          </h1>
        </>
      ) : (
        <div className="connect">
          <button onClick={() => handleConnect(injected)}>
            Connect Metamask
          </button>
          <button onClick={() => handleConnect(walletConnect)}>
            Connect WalletConnect
          </button>
          <button onClick={() => handleConnect(walletLinkConnector)}>
            Connect Coinbase
          </button>
        </div>
      )}
      {showTutorial && <Tutorial onClose={handleShowTutorial} />}
      <CustomTransaction />
      {active && <Transactions />}
    </div>
  )
}

export default App
