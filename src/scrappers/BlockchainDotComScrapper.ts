import { Web3Provider, TransactionResponse } from '@ethersproject/providers'

import { Scrapper } from './types'
import { resolveInBatch } from '../utils'
import { BLOCKCHAIN_DOT_COM_URI } from '../constants'

export class BlockchainDotComScrapper implements Scrapper {
  async getPendingTransactionHashes(
    library: Web3Provider,
    account: string,
    chainId: number
  ): Promise<TransactionResponse[]> {
    const res = await fetch(this.getTransactiosByAddressURL(account, chainId))

    const html = await res.text()

    const element = document.createElement('html')
    element.innerHTML = html

    const rows = element.getElementsByClassName('sc-1fp9csv-0')
    const txsPromises = []
    for (const row of rows) {
      if (row.innerHTML.indexOf('Unconfirmed') !== -1) {
        const links = row.getElementsByClassName(
          'sc-1r996ns-0 gzrtQD sc-1tbyx6t-1 kXxRxe iklhnl-0 boNhIO'
        )
        for (const link of links) {
          const href = link.getAttribute('href')
          if (href && href.indexOf('tx/') !== -1) {
            txsPromises.push(library.getTransaction(link.textContent!))
          }
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

  getTransactiosByAddressURL(account: string, chainId: number): string {
    return `api/server?url=${BLOCKCHAIN_DOT_COM_URI[chainId]}/${account}`
  }
}
