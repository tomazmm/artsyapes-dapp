import React, {lazy, useEffect, useState} from 'react'
import {useConnectedWallet, useWallet, WalletStatus,} from '@terra-money/wallet-provider'
import * as query from './contract/query'
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {LoadingPage} from "./components/shared/LoadingPage";


const Home = lazy(() =>
  import('./components/layout/Home/Home')
    .then(({ Home }) => ({ default: Home })),
);

const MyAccount = lazy(() =>
  import('./components/layout/MyAccount/MyAccount')
    .then(({ MyAccount }) => ({ default: MyAccount })),
);


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
          <React.Suspense fallback={<LoadingPage/>}>
            <Routes>
              <Route path={"/"+connectedWallet?.walletAddress} element={<MyAccount />}/>

              {["/home", "/"].map((path, index) =>
                <Route path={path} element={<Navigate to={"/"+connectedWallet?.walletAddress} />} key={index} />
              )}
            </Routes>
          </React.Suspense>

          {/*  TODO: add wallet to the right upper corner*/}
        </div>
      )
    case WalletStatus.WALLET_NOT_CONNECTED:
      return (
        <div className="ArtsyApesApp">
          <React.Suspense fallback={<LoadingPage/>}>
            <Routes>
              <Route path="/home" element={<Home />}/>

              <Route
                path="*"
                element={<Navigate to="/home" />}
              />
            </Routes>
          </React.Suspense>
        </div>
      )
  }
}


export default App
