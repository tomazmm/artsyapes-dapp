import React, { useEffect, useState } from 'react'
import {
  useWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider'
import * as query from './contract/query'
import {Home} from "./components/layout/Home";
import {Routes, Route, useNavigate, useLocation, Navigate} from "react-router-dom";
import {MyAccount} from "./components/layout/MyAccount";


function App() {
  const navigate = useNavigate();
  const location = useLocation();

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
      <Routes>
        {connectedWallet !== undefined ? (
          <>
            <Route path={"/profile/"+connectedWallet?.walletAddress} element={<MyAccount />}/>
            {["/home", "/"].map((path, index) =>
              <Route path={path} element={<Navigate to={"/profile/"+connectedWallet?.walletAddress} />} key={index} />
            )}
          </>
        ) :(
          <>
            <Route path="/home" element={<Home />}/>
            <Route
              path="*"
              element={<Navigate to="/home" />}
            />
          </>
        )}

        {/*<Route path="about" element={<About />} />*/}
      </Routes>

    {/*  TODO: add wallet to the right upper corner*/}
    </div>
  )
}


export default App
