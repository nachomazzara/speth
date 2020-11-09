import { useState, useEffect } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { EtherscanScrapper } from './scrappers'

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
      const etherscanScrapper = new EtherscanScrapper()
      etherscanScrapper
        .getPendingTransactionHashes(library, account, chainId)
        .then((txHashes) => {
          setPendingTransactions(txHashes)
          setLoading(false)
        })
    }
  }, [active, chainId, library])

  return { pendingTransactions, pendingTransactionsLoading }
}
