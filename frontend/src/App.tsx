import React, { useEffect, useState } from 'react'
import {
  useWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider'
import * as query from './contract/query'
import {Welcome} from "./components/layout/Welcome";


function App() {
  const [count, setCount] = useState(null)
  const [updating, setUpdating] = useState(true)
  const [resetValue, setResetValue] = useState(0)

  const { status } = useWallet()

  const connectedWallet = useConnectedWallet()

  useEffect(() => {
    const prefetch = async () :Promise<any> => {
      if (connectedWallet) {
        setCount((await query.numTokens(connectedWallet)).count)
      }
      setUpdating(false)
    }
    prefetch()
  }, [connectedWallet])

  return (
    <div className="ArtsyApesApp">
      <Welcome/>
      {/*<ConnectWallet/>*/}
      {/*<Welcome>*/}

      {/*</Welcome>*/}
    </div>
  )
}


export default App
