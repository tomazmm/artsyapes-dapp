import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import {ConnectWallet} from "../shared/ConnectWallet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

interface MyAccountProps {
  className?: string;
}

export const MyAccountBase = (props: MyAccountProps) => {
  const {
    className
  } = props;


  return (
    <div className={className}>
      <Container fluid className="h-100">
        <Row className="h-auto mx-3">
          <Col className="d-flex mt-3 flex-column justify-content-start align-self-center align-content-center align-items-start col">
            <img className="w-25 logo" src={'/assets/logo.png'}/>
          </Col>
          <Col  className="d-flex mt-3 flex-column justify-content-start align-self-center align-content-center align-items-end col">
            {/*<img className="w-75 mb-5 logo" src={'/assets/logo.png'}/>*/}
            <ConnectWallet />
            {/*<div className="enter-text">*/}
            {/*  <span className="text-white button-text" > TO ENTER THE APESHOP*/}
            {/*  </span>*/}
            {/*  <FontAwesomeIcon className="icon" icon={faChevronRight} />*/}
            {/*</div>*/}
          </Col>
        </Row>
      </Container>
    </div>
  )
}


export const MyAccount = styled(MyAccountBase)`
    background-color: black;
    background-size: cover;
    height: 100vh;
    > .container-fluid{
        .row{
          .col{
            .enter-text{
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: auto;
              max-width: 100%;
              font-size: 0.9rem;
              margin: 2% 0;
              .button-text{
                margin-right: 0.5rem!important;
                width: auto!important;
                justify-content: center !important;
              }
              .icon{
                color: white;
                display: flex;
              }
            }
          }
      }
    }
`;
