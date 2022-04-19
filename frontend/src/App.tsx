import React, {lazy, useEffect, useState} from 'react'
import {useConnectedWallet, useWallet, WalletStatus,} from '@terra-money/wallet-provider'
import * as query from './contract/query'
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {LoadingPage} from "./components/shared/LoadingPage";
import {Header} from "./components/layout/shared/Header"
import {MobileBurgerMenu} from "./components/layout/MyAccount/MyAccountsContent/MobileBurgerMenu";


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
  const [show, setShow] = useState(false);

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


  const toggleBurgerMenu = () => setShow(!show);

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
          <Header setShow={toggleBurgerMenu}/>
          {show ?
              <MobileBurgerMenu/>
              :
              <></>
          }
          <React.Suspense fallback={<LoadingPage/>}>
            <Routes>
              <Route path={"/my-profile"} element={<MyAccount connectedWallet={connectedWallet} />}/>

              {["/"].map((path, index) =>
                <Route path={path} element={<Navigate to={"/my-profile"} />} key={index} />
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
              <Route path="/" element={<Home />}/>
              <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
          </React.Suspense>
        </div>
      )
  }
}


export default App
