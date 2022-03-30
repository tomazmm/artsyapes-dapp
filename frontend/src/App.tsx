import React, {useEffect, useState} from 'react'
import {useConnectedWallet, useWallet, WalletStatus,} from '@terra-money/wallet-provider'
import * as query from './contract/query'
import {Home} from "./components/layout/Home/Home";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {MyAccount} from "./components/layout/MyAccount/MyAccount";
import {LoadingPage} from "./components/shared/LoadingPage";



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

  switch (status){
    case WalletStatus.INITIALIZING:
      return (
        <>
          <div className="ArtsyApesApp">
            <LoadingPage />
          </div>
        </>
      )
    case WalletStatus.WALLET_CONNECTED:
      return (
        <div className="ArtsyApesApp">
          <Routes>
            <Route path={"/"+connectedWallet?.walletAddress} element={<MyAccount />}/>

            {["/home", "/"].map((path, index) =>
              <Route path={path} element={<Navigate to={"/"+connectedWallet?.walletAddress} />} key={index} />
            )}
          </Routes>

          {/*  TODO: add wallet to the right upper corner*/}
        </div>
      )
    case WalletStatus.WALLET_NOT_CONNECTED:
      return (
        <div className="ArtsyApesApp">
          <Routes>
            <Route path="/home" element={<Home />}/>

            <Route
              path="*"
              element={<Navigate to="/home" />}
            />
          </Routes>
        </div>
      )
  }
}


export default App
