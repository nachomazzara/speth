import { useState, useEffect } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { getPendingTransactionsByAddress } from './scrappers'

export function usePendingTransactions(): {
  pendingTransactions: TransactionResponse[]
  pendingTransactionsLoading: boolean
} {
  const [pendingTransactions, setPendingTransactions] = useState<
    TransactionResponse[]
  >([])
  const [pendingTransactionsLoading, setLoading] = useState(true)
  const { library, chainId, active, account } = useWeb3React()

  useEffect(() => {
    if (active && chainId && account) {
      setLoading(true)
      getPendingTransactionsByAddress(library, account, chainId)
        .then((txs) => {
          setPendingTransactions(txs)
          setLoading(false)
        })
        .catch((e) => console.warn(e.message))
    }
  }, [active, chainId, library, account])

  return { pendingTransactions, pendingTransactionsLoading }
}
