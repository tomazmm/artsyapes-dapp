import React, {lazy, useEffect, useState} from 'react'
import {useConnectedWallet, useWallet, WalletStatus,} from '@terra-money/wallet-provider'
import * as query from './contract/query'
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {LoadingPage} from "./components/shared/LoadingPage";
import {Header} from "./components/layout/Header/Header"
import {BurgerMenu} from "./components/layout/Header/components/BurgerMenu";
import {Background} from "./components/layout/Background/Background";
import GlobalContext from "./components/shared/GlobalContext";


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


function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState(false);
  const [pathName, setPath] = useState("");
  const [orderPathNames, setOrderPathNames] = useState<any>(["/my-profile"]);
  const [loadPage, setLoadPage] = useState(false);

  const [getTokenNumbers, setGetTokenNumbers] = useState(true);
  const [tokenNumbers, setTokenNumbers] = useState<any>([])
  const [tokenInfo, setTokenInfo] = useState<any>([])


  const { status } = useWallet()

  const connectedWallet = useConnectedWallet()

  useEffect(() => {
    if(pathName !== location.pathname){
      setShow(false);
      setPath(location.pathname);
    }
    const prefetch = async () :Promise<any> => {
      if (connectedWallet && getTokenNumbers) {
        // console.log(tokenNumbers.tokens.length)
        setTokenNumbers(await query.tokens(connectedWallet));
        setGetTokenNumbers(false);

        if(tokenNumbers.tokens == undefined)
          return;

        if(tokenNumbers.length !== 0 && connectedWallet && tokenInfo.length <= tokenNumbers.tokens.length){
          for(const it of tokenNumbers.tokens){
            const token = await query.nftInfo(connectedWallet, it)
            setTokenInfo( (prevState: any) => {
              return [...prevState, token]
            })
            setOrderPathNames( (prevState: any) => {
              return [...prevState, "/order/"+it]
            })
          }
        }
        setLoadPage(true);
      }

    }
    prefetch()
  }, [connectedWallet, location.pathname, tokenNumbers.tokens])


  const toggleBurgerMenu = () => setShow(!show);
  const navigateToOrder = (id: string) => navigate("/order/" + id)

  const globalContext = {
    tokenNum: tokenNumbers,
    tokensInfo: tokenInfo,
    connectedWallet: connectedWallet,
    navigateToOrder
  };

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
        <GlobalContext.Provider value={globalContext}>
          {loadPage ? (
            <div className="ArtsyApesApp">
              <Header setShow={toggleBurgerMenu}/>
              {show ?
                <BurgerMenu/>
                :
                <></>
              }
              <Background/>
              <React.Suspense fallback={<LoadingPage/>}>
                <Routes>
                  <Route path={"/my-profile"} element={<MyProfile connectedWallet={connectedWallet} />}/>
                  <Route path={"/order"} element={<Order />}/>

                  {orderPathNames.find((path:string) => path === pathName) ? (
                    <></>
                  ) : (
                    <Route path={pathName} element={<Navigate to={"/my-profile"} />}/>
                  ) }
                </Routes>
              </React.Suspense>
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


export default App
