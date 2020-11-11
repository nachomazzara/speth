import { TransactionResponse, Web3Provider } from '@ethersproject/providers'

export interface Scrapper {
  getPendingTransactionHashes(
    provider: Web3Provider,
    account: string,
    chainId: number
  ): Promise<TransactionResponse[]>

  getTransactiosByAddressURL(account: string, chainId: number): string
}
