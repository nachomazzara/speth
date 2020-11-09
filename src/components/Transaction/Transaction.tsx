import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'

import { Props } from './types'
import { ETHERSCAN_URI } from '../../constants'

import './Transaction.css'

export default function Transaction({ transaction }: Props) {
  const { account, library, chainId } = useWeb3React()

  function handleCancelTx() {
    const params = [
      {
        from: account,
        to: account,
        nonce: BigNumber.from(transaction.nonce).toHexString(),
        gas: '0x5208',
        gasPrice: transaction.gasPrice.toHexString(),
      },
    ]

    library
      .send('eth_sendTransaction', params)
      .then((res: any) => console.log(res))
  }

  function handleRetryTx() {
    const params = [
      {
        from: account,
        to: transaction.to,
        value: transaction.value.toHexString(),
        data: transaction.data,
        nonce: BigNumber.from(transaction.nonce).toHexString(),
        gas: transaction.gasLimit.toHexString(),
        gasPrice: transaction.gasPrice.toHexString(),
      },
    ]

    library
      .send('eth_sendTransaction', params)
      .then((res: any) => console.log(res))
  }

  return (
    <div key={transaction.hash} className="transaction row">
      <p>
        <a
          href={`${ETHERSCAN_URI[chainId!]}/tx/${transaction.hash}`}
          rel="noreferrer"
          target="_blank"
        >
          {transaction.hash}
        </a>
      </p>
      <p>
        <a
          href={`${ETHERSCAN_URI[chainId!]}/address/${transaction.to}`}
          rel="noreferrer"
          target="_blank"
        >
          {transaction.to}
        </a>
      </p>
      <p>{transaction.nonce}</p>
      <p>{(transaction.gasPrice.toNumber() / 1e9).toString()}</p>
      <p>{transaction.gasLimit.toString()}</p>
      <button onClick={handleCancelTx}>Cancel</button>
      <button onClick={handleRetryTx}>Retry</button>
    </div>
  )
}
