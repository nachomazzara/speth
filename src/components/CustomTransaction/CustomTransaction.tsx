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

  async function handleSend() {
    setError(null)

    if (!values) {
      setError('Please, set values')
      return
    }

    const { to, data, value, nonce, gas, gasPrice } = values

    try {
      const tx =  {
        from: account,
        to: to,
        value: value ? BigNumber.from(value).toHexString() : 0,
        data: data,
        nonce: nonce ? BigNumber.from(nonce).toHexString() : null,
        gas: gas ? BigNumber.from(gas).toHexString() : null,
        gasPrice: gasPrice ? BigNumber.from(gasPrice).mul(BigNumber.from(1000000000)).toHexString() : '0x01',
      }

      if (!gasPrice) {
        const estimatedGasPrice = await library.getGasPrice()
        tx.gasPrice = estimatedGasPrice.toHexString()
      }

      if (!gas) {
        const estimatedGas = await library.estimateGas(tx)
        tx.gas = estimatedGas.toHexString()
      }


      library
        .send('eth_sendTransaction',   [tx])
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
              value={values.to}
              onChange={(e) => setValues({ ...values, to: e.target.value.trim() })}
            />
          </div>
          <div>
            <label>Data</label>
            <textarea
              placeholder="0x....."
              value={values.data}
              onChange={(e) => setValues({ ...values, data: e.target.value.trim() })}
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
      <button onClick={handleSend} disabled={!account}>SEND</button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
