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
import {Page404} from "./pages/404";



const Home = lazy(() =>
  import('./pages/home')
    .then(({ Home }) => ({ default: Home })),
);

const MyProfile = lazy(() =>
  import('./pages/my-profile')
    .then(({ MyProfile }) => ({ default: MyProfile })),
);

const Token = lazy(() =>
    import('./pages/token')
        .then(({ Token }) => ({ default: Token })),
);

interface AppProps {
  className?: string;
}

export const AppBase = (props: AppProps) => {
  const {
    className,
  } = props;

  const [show, setShow] = useState(false);

  const [tokens, setTokens] = useState<any>(undefined)
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
    connectedWallet: connectedWallet
  };


  return (
    <GlobalContext.Provider value={globalContext}>
      <div className={className}>
      {status === WalletStatus.INITIALIZING ? (
          <LoadingPage />
      ) : (
          <>
            {connectedWallet ?(
              <>
                <Background/>
                <div className="header">
                  {/*TODO: add BurgerMenu to Header*/}
                  <Header setShow={toggleBurgerMenu}/>
                </div>
              </>
            ) : (
              <>
              </>
            )}

            <div className="content">
              <React.Suspense fallback={<LoadingPage/>}>
                <Routes>
                  {connectedWallet ? (
                    <>
                      <Route path={"/"} element={<MyProfile />}/>
                      <Route path={"/token/:id"} element={<Token />}/>
                    </>
                  ) : (
                    <>
                      <Route path={"/"} element={<Home />}/>
                    </>
                  )}

                  <Route path="*" element ={<Navigate to="/404"/>}/>
                  <Route path="/404" element={<Page404 />}/>
                </Routes>
              </React.Suspense>
            </div>
          </>
        )}
      </div>
    </GlobalContext.Provider>
  )
}

export const App = styled(AppBase)`
  font-family: 'Montserrat', sans-serif;
  
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