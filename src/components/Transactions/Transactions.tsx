import React from 'react'
import { useWeb3React } from '@web3-react/core'

import Transaction from '../Transaction'
import { usePendingTransactions } from '../../hooks'
import { ETHERSCAN_URI } from '../../constants'

import './Transactions.css'

export default function Transactions() {
  const { account, chainId } = useWeb3React()

  const {
    pendingTransactions,
    pendingTransactionsLoading,
  } = usePendingTransactions()

  return (
    <div className="transactions">
      <h3>Pending Transactions</h3>
      {pendingTransactionsLoading && (
        <p>
          Fetching pending transactions for{' '}
          <a
            href={`${ETHERSCAN_URI[chainId!]}/address/${account}`}
            rel="noreferrer"
            target="_blank"
          >
            {account}
          </a>
        </p>
      )}
      {!pendingTransactionsLoading && pendingTransactions.length > 0 && (
        <>
          <div className="transaction-header row">
            <p>Tx Hash</p>
            <p>To</p>
            <p>Nonce</p>
            <p>Gas Price</p>
            <p>Gas Limit</p>
            {/* Dummy elements */}
            <p />
            <p />
          </div>
          {pendingTransactions.map((tx) => (
            <Transaction key={tx.hash} transaction={tx} />
          ))}
        </>
      )}
      {!pendingTransactionsLoading && pendingTransactions.length === 0 ? (
        <p className="no-txs"> No pending transactions 🚀 </p>
      ) : null}
    </div>
  )
}
