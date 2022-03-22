
// import { useEffect, useState } from 'react'
// import {
//     useWallet,
//     useConnectedWallet,
//     WalletStatus,
// } from '@terra-money/wallet-provider'
//
// import * as execute from './contract/execute'
// import * as query from './contract/query'
// import { ConnectWallet } from './components/ConnectWallet'
// import backgroundImg from '../../../public/assets/space-background.png';

import styled from 'styled-components';
import {Button, Col, Container, Row} from "react-bootstrap";
import {ConnectWallet} from "../ConnectWallet";


export const Welcome = () => {

    const Background = styled.div`
      background: url("/assets/space-background-new.png");
      background-size: cover;
      height: 100vh;
    `;


    const GoldenApe = styled.img`
      Width: 100%;
    `

    const Logo = styled.img`
      width: 100%;
    `

    return (
        <Background>
            <Container fluid className="h-100">
                <Row className="h-100">
                    <Col xs={{span: 5,offset: 1}} className="d-flex flex-column justify-content-end">
                        <GoldenApe src={'/assets/golden-ape.png'}/>
                    </Col>
                    <Col xs={{span: 5}} className="d-flex flex-column justify-content-center align-content-center align-items-center">
                        <Logo className="w-75 mb-5" src={'/assets/logo.png'}/>
                        <ConnectWallet/>
                        <span>to enter app</span>
                    </Col>
                </Row>
            </Container>
        </Background>
    )
}




