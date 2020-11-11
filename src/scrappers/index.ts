import { EtherscanScrapper } from './EtherscanScrapper'
import { BlockchainDotComScrapper } from './BlockchainDotComScrapper'

const Scrappers = [EtherscanScrapper, BlockchainDotComScrapper]

export async function getPendingTransactionsByAddress(
  library: any,
  account: string,
  chainId: number
) {
  for (const Scrapper of Scrappers) {
    try {
      const instance = new Scrapper()
      const pendingTxs = await instance.getPendingTransactionHashes(
        library,
        account,
        chainId
      )
      return pendingTxs
    } catch (e) {
      console.warn(
        `Failed to fetch pending transactions with '${typeof Scrapper}' : ${e.message
        }`
      )
    }
  }

  throw new Error('Failed to fetch pending transactions with all scrappers')
}
