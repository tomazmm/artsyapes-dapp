
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


    const Background = styled.section`
      background: url("/assets/space-background.png");
      background-size: cover;
      height: 100vh;
      overflow: hidden;
    `;

    const GoldenApe = styled.img`
      //position: absolute;
      //height: 95%;
      //left: 7%;
      //bottom: 0;
    `
    // const GoldenApe = styled.img`
    //   //position: absolute;
    //   //height: 95%;
    //   //left: 7%;
    //   //bottom: 0;
    // `

    return (
        <Background>
            <Container>
                <Row>
                    <Col>
                        {/*<GoldenApe src={'/assets/golden-ape.png'}/>*/}
                    </Col>
                    <Col>
                        <GoldenApe src={'/assets/logo.png'}/>
                    </Col>
                </Row>
            </Container>

        </Background>
    )
}

// export const Welcome = styled(WelcomeBase)`
//     > .wrapper {
//       background-color: red;
//       color: brown;
//       font-size: 3em;
//     }
// `


