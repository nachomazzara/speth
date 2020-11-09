import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { isMobile } from 'react-device-detect'

import { ETHERSCAN_URI } from './constants'
import Transactions from './components/Transactions'
import CustomTransaction from './components/CustomTransaction'

import './App.css'

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})

function App() {
  const { account, chainId, activate } = useWeb3React()

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          //setTried(true)
        })
      } else {
        if (isMobile && (window as any).ethereum) {
          activate(injected, undefined, true).catch(() => {
            // setTried(true)
          })
        } else {
          // setTried(true)
        }
      }
    })
  }, [activate])

  return (
    <div className="container">
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
      <CustomTransaction />
      <Transactions />
    </div>
  )
}

export default App
