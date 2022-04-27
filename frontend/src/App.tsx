import React, {lazy, useEffect, useState} from 'react'
import {useConnectedWallet, useWallet, WalletStatus,} from '@terra-money/wallet-provider'
import * as query from './contract/query'
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {LoadingPage} from "./components/shared/LoadingPage";
import {Header} from "./components/layout/Header/Header"
import {BurgerMenu} from "./components/layout/Header/components/BurgerMenu";
import {Background} from "./components/layout/Background/Background";
import GlobalContext from "./components/shared/GlobalContext";
import styled from "styled-components";



const Home = lazy(() =>
  import('./pages/home')
    .then(({ Home }) => ({ default: Home })),
);

const MyProfile = lazy(() =>
  import('./pages/my-profile')
    .then(({ MyProfile }) => ({ default: MyProfile })),
);

const Order = lazy(() =>
    import('./pages/order')
        .then(({ Order }) => ({ default: Order })),
);

const Purchase = lazy(() =>
    import('./pages/purchase')
        .then(({ Purchase }) => ({ default: Purchase })),
);

interface AppProps {
  className?: string;
}

export const AppBase = (props: AppProps) => {
  const {
    className,
  } = props;

  const [show, setShow] = useState(false);
  const [loadPage, setLoadPage] = useState(true);

  const [tokens, setTokens] = useState<any>([])
  const [tokenInfo, setTokenInfo] = useState<any>([])

  const { status } = useWallet()

  const connectedWallet = useConnectedWallet()

  useEffect(() => {
    const fetchTokenInfo = async () :Promise<any> => {
      if (connectedWallet) {
        const wallet_tokens = await query.tokens(connectedWallet);
        setTokens(wallet_tokens.tokens);

        if(wallet_tokens.tokens.length){
          for(const it of wallet_tokens.tokens){
            const token = await query.nftInfo(connectedWallet, it)
            setTokenInfo( (prevState: any) => {
              return [...prevState, token]
            })
          }
        }
      }
    }
    fetchTokenInfo()
  }, [connectedWallet])

  const toggleBurgerMenu = () => setShow(!show);

  const globalContext = {
    tokens,
    tokensInfo: tokenInfo,
    connectedWallet: connectedWallet,
  };


  switch (status){
    case WalletStatus.INITIALIZING:
      return (
        <>
          <div className={className}>
            <LoadingPage />
          </div>
        </>
      )
    case WalletStatus.WALLET_CONNECTED:
      return (
        <GlobalContext.Provider value={globalContext}>
          {loadPage ? (
            <div className={className}>
              <Background/>
              <div className="header">
                  <Header setShow={toggleBurgerMenu}/>
                  {show ?
                      <BurgerMenu/>
                      :
                      <></>
                  }
              </div>
              <div className="content">
                <React.Suspense fallback={<LoadingPage/>}>
                  <Routes>
                    <Route path={"/order/:id"} element={<Order />}/>
                    <Route path={"/order/:id/purchase"} element={<Purchase />}/>
                    <Route path={"/"} element={<MyProfile />}/>
                  </Routes>
                </React.Suspense>
              </div>
            </div>

          ) : (
            <>
              <div className="ArtsyApesApp">
                <LoadingPage />
              </div>
            </>
          )
          }
        </GlobalContext.Provider>
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

export const App = styled(AppBase)`
  display: flex;
  flex-flow: column;
  height: 100vh;
  .header{
    flex: 0 1 auto;
  }
  .content{
    flex: 1 1 auto;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100%;
  }
`;