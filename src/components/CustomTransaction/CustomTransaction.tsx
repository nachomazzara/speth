import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'

import { TxForm } from './types'

import './CustomTransaction.css'

const initialTxFormValue: TxForm = {
  to: '',
  data: '',
  value: '',
  gasPrice: '',
  gas: '',
  nonce: '',
}

export default function CustomTransaction() {
  const [values, setValues] = useState<TxForm>(initialTxFormValue)
  const [error, setError] = useState<string | null>(null)
  const { account, library } = useWeb3React()

  function handleSend() {
    setError(null)

    if (!values) {
      setError('Please, set values')
      return
    }

    const { to, data, value, gas, gasPrice, nonce } = values

    try {
      const params = [
        {
          from: account,
          to: to,
          value: BigNumber.from(value).toHexString(),
          data: data,
          nonce: BigNumber.from(nonce).toHexString(),
          gas: BigNumber.from(gas).toHexString(),
          gasPrice: BigNumber.from(gasPrice).toHexString(),
        },
      ]

      library
        .send('eth_sendTransaction', params)
        .then((res: any) => console.log(res))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="custom-transaction">
      <div className="custom-transaction-form">
        <div>
          <div>
            <label>To</label>
            <input
              type="text"
              placeholder="0x....."
              onChange={(e) => setValues({ ...values, to: e.target.value })}
            />
          </div>
          <div>
            <label>Data</label>
            <textarea
              placeholder="0x....."
              onChange={(e) => setValues({ ...values, data: e.target.value })}
            />
          </div>
        </div>
        <div className="short">
          <div>
            <label>Value</label>
            <input
              type="text"
              placeholder="10"
              onChange={(e) => setValues({ ...values, value: e.target.value })}
            />
          </div>
          <div>
            <label>Gas limit</label>
            <input
              type="text"
              placeholder="21000"
              onChange={(e) => setValues({ ...values, gas: e.target.value })}
            />
          </div>
          <div>
            <label>Gas Price</label>
            <input
              type="text"
              placeholder="10"
              onChange={(e) =>
                setValues({ ...values, gasPrice: e.target.value })
              }
            />
          </div>
          <div>
            <label>Nonce</label>
            <input
              type="text"
              placeholder="0"
              onChange={(e) => setValues({ ...values, nonce: e.target.value })}
            />
          </div>
        </div>
      </div>
      <button onClick={handleSend}>SEND</button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
