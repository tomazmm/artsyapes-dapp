import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import {Header} from "../shared/Header";
import {Grid} from "./MyAccountsContent/Grid";
import {SideMenu} from "./MyAccountsContent/SideMenu";
import {useConnectedWallet} from "@terra-money/wallet-provider";
import * as query from "../../../contract/query";
import {ConnectedWallet} from "@terra-dev/use-wallet/useConnectedWallet";
import {LoadingContent} from "../../shared/LoadingContent";
import {ProfileGiveavays} from "./MyAccountsContent/ProfileGiveaways";
import {MobileBurgerMenu} from "./MyAccountsContent/MobileBurgerMenu";

interface MyAccountProps {
  className?: string;
  connectedWallet?: ConnectedWallet;
}

export const MyAccountBase = (props: MyAccountProps) => {
  const {
    className,
    connectedWallet
  } = props;

  const [tokens, setTokens] = useState<any>([])
  const [nftInfo, setNftInfo] = useState<any>([])
  const [nftsCount, setNftsCount] = useState<any>(0)
  const [show, setShow] = useState(false);


  useEffect(() => {
    const fetch = async () :Promise<any> => {
      if (connectedWallet) {
        setTokens(await query.tokens(connectedWallet));
      }
      if(tokens.length !== 0 && connectedWallet){
        for(const it of tokens.tokens){
          const token = await query.nftInfo(connectedWallet, it)

          setNftInfo( (prevState: any) => {
            return [...prevState, token]
          })
        }
      }
    }
    fetch()
  }, [tokens.length, connectedWallet])

  const toggleBurgerMenu = () => setShow(!show);


  return (
    <div className={className}>
      <Header setShow={toggleBurgerMenu}/>
      {show ?
        <MobileBurgerMenu/>
        :
        <></>
      }
      <Container fluid className="h-100 fixed-top">
          <Row className="h-auto about mb-4">
            <Col xl={{span: 3}}
                 lg={{span: 12}}
                 xs={{span: 12}}
                 className="d-flex flex-column justify-content-center align-self-start align-items-center col my-collection">
              <span className="owned-text">My Collection</span>
              <div className="white-line"></div>
              <SideMenu/>
            </Col>
            <Col xl={{span: 9}}
                 lg={{span: 12}}
                 xs={{span: 12}}
                 className="d-flex flex-column justify-content-end align-self-start col align-items-end my-account-col">
              {/*<span className="my-account-text">My Account</span>*/}
              <ProfileGiveavays/>
              <div className="white-line"></div>
              <Grid className={className} nftInfo={nftInfo}/>
            </Col>
          </Row>
      </Container>

    </div>
  )
}


export const MyAccount = styled(MyAccountBase)`
    > .container-fluid{
        z-index: 1;
        background: url("/assets/my-account-background.png");
        background-size: cover;
        padding: 6rem 4rem;
        .row{
          &.about{
            margin-top: 3rem;
          }
          .col{
            &.my-collection{
              @media screen and (max-width: 767px) {
                display: none!important;
              }
            }
            &.my-account-col{
              //margin-left: 2rem;
              //margin-bottom: 0.5rem;
            }
            .owned-text{
              color: white;
              font-size: 1.7rem;
              font-weight: 700;
              margin-bottom: 0.5rem;
            }
            .my-account-text{
              color: white;
              font-size: 3rem;
              font-weight: 700;
              margin-bottom: 1rem;
            }
            .white-line{
              border-bottom: 0.2rem groove rgba(194, 194, 194, .8);
              width: 100%;
              margin-bottom: 2rem;
            }
          }
        }
      }
`;
