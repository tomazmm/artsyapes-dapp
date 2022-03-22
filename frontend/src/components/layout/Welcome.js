
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
import {Col, Container, Row} from "react-bootstrap";


export const Welcome = () => {

    const Background = styled.div`
      background: url("/assets/space-background.png");
      background-size: cover;
      height: 100vh;
      overflow: hidden;
    `;
    //
    // const container = styled(Container)`
    //     height: 100%;
    // `
    //
    // const Row = styled(Row)`
    //   height: 100%;
    // `


    const GoldenApe = styled.img`
      Width: 100%;
      bottom: 0
    `

    const Logo = styled.img``

    return (
        <Background>
            <Container>
                <Row>
                    <Col>
                        <GoldenApe src={'/assets/golden-ape.png'}/>
                    </Col>
                    <Col>
                        <Logo src={'/assets/logo.png'}/>
                    </Col>
                </Row>
            </Container>
        </Background>
    )
}




