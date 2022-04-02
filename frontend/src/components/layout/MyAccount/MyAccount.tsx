import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import {Header} from "../shared/Header";
import {ContentGrid} from "./MyAccountsContent/ContentGrid";
import {SideMenu} from "./MyAccountsContent/SideMenu";
import {useConnectedWallet} from "@terra-money/wallet-provider";
import * as query from "../../../contract/query";
import {ConnectedWallet} from "@terra-dev/use-wallet/useConnectedWallet";

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


  useEffect(() => {
    const fetch = async () :Promise<any> => {
      if (connectedWallet) {
        setTokens(await query.tokens(connectedWallet));
      }
      if(tokens.length !== 0 && connectedWallet){
        for(const it of tokens.tokens){
          const test = await query.nftInfo(connectedWallet, it)

          setNftInfo( (prevState: any) => {
            return [...prevState, test]
          })
        }
      }
    }
    fetch()
  }, [tokens.length, connectedWallet])

  return (
    <div className={className}>
      <Header/>
      <Container fluid className="h-100 fixed-top">
          <Row className="h-auto about mb-4">
            <Col xl={{span: 3}}
                 lg={{span: 12}}
                 xs={{span: 12}}
                 className="d-flex flex-column justify-content-center align-self-end align-content-center align-items-center col">
              <span className="owned-text">Owned</span>
              <div className="white-line"></div>
            </Col>
            <Col xl={{span: 9}}
                 lg={{span: 12}}
                 xs={{span: 12}}
                 className="d-flex flex-column justify-content-center align-self-end align-content-center align-items-end col my-account-col">
              <span className="my-account-text">My Account</span>
              <div className="white-line"></div>
            </Col>
          </Row>

          <Row className="h-auto">
            <Col xl={{span: 3}}
                 lg={{span: 12}}
                 xs={{span: 12}}
              className="d-flex flex-column justify-content-center align-self-end align-content-center align-items-center col">
              <SideMenu/>
            </Col>
            <Col xl={{span: 9}}
                 lg={{span: 12}}
                 xs={{span: 12}}
              className="d-flex flex-column justify-content-center align-self-end align-content-center align-items-end col my-account-col">
              <ContentGrid className={className} nftInfo={nftInfo}/>
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
        padding: 10rem 4rem;
        .row{
          &.about{
            margin-top: 7rem;
          }
          .col{
            &.my-account-col{
              //margin-left: 2rem;
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
            }
          }
        }
      }
`;
