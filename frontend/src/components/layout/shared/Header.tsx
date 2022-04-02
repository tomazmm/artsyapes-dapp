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
        <Row className="h-25 d-flex flex-row align-items-center">
          <Col>
            <img className="logo" src={'/assets/logo.png'}/>
          </Col>
          <Col className="d-flex justify-content-end">
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
    padding: .5rem 4rem;
    .row{
      .col{
        .logo{
          width: 20%;
        }
      }
    }
  }
      
`;