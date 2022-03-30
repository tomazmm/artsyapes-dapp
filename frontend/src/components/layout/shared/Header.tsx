import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import {ConnectWallet} from "../../shared/ConnectWallet";

interface HeaderProps {
  className?: string;
}

export const HeaderBase = (props: HeaderProps) => {
  const {
    className
  } = props;


  return (
    <div className={className}>
      <Container fluid className="fixed-top h-auto">
        <Row className="h-auto">
          <Col xs={3} className="d-flex mt-3 flex-column justify-content-start align-self-center align-content-center align-items-start col">
            <img className="logo" src={'/assets/logo.png'}/>
          </Col>
          <Col className="d-flex mt-3 flex-column justify-content-start align-self-center align-content-center align-items-end col">
            <ConnectWallet />
          </Col>
        </Row>
        </Container>
    </div>
  )
}


export const Header = styled(HeaderBase)`
  >.container-fluid{
    z-index: 2;
    background-color: black;
    padding: 2rem 4rem;
    .row{
      .col{
        .logo{
          //max-width:100%;
          //max-height:100%;
          height: 10vh;
          margin: auto;
        }
      }
    }
  }
      
`;