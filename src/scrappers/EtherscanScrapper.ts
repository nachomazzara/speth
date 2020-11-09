import { Web3Provider, TransactionResponse } from '@ethersproject/providers'

import { Scrapper } from './types'
import { resolveInBatch } from '../utils'
import { ETHERSCAN_URI } from '../constants'

export class EtherscanScrapper implements Scrapper {
  async getPendingTransactionHashes(
    library: Web3Provider,
    account: string,
    chainId: number
  ): Promise<TransactionResponse[]> {
    const res = await fetch(this.getURL(chainId) + account)

    const html = await res.text()

    const element = document.createElement('html')
    element.innerHTML = html

    const rows = element.getElementsByTagName('table')[0].rows
    const txsPromises = []
    for (const row of rows) {
      if (row.innerHTML.indexOf('(pending)') !== -1) {
        // Seconds children (column) from the row as current design
        const txHash = row.children[1].textContent
        if (txHash) {
          txsPromises.push(library.getTransaction(txHash))
        }
      }
    }

    const pendingTransactions = (
      await resolveInBatch<TransactionResponse>(txsPromises)
    ).filter((res) => !!res && res.blockHash === null)

    // Order by nonce
    pendingTransactions.sort((a, b) => a.nonce - b.nonce)

    return pendingTransactions
  }

  getURL(chainId: number) {
    return `api/server?url=${ETHERSCAN_URI[chainId]}/address/`
  }
}
