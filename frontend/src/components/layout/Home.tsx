import React from "react";
import styled from 'styled-components';
import {Button, Col, Container, Row} from "react-bootstrap";
import {ConnectWallet} from "../shared/ConnectWallet";

interface HomeProps {
  className?: string;
}

export const HomeBase = (props: HomeProps) => {
    const {
        className
    } = props;


    return (
      <div className={className}>
          <Container fluid className="h-100">
              <Row className="h-100">
                  <Col xl={{span: 6, offset: 6}}
                       lg={{span: 12}}
                       className="d-flex flex-column justify-content-center align-content-center align-items-center col">
                      <img className="w-75 mb-5 logo" src={'/assets/logo.png'}/>
                      <ConnectWallet/>
                      <span className="text-white" >to enter app </span>
                  </Col>
              </Row>
          </Container>
      </div>
    )
}


export const Home = styled(HomeBase)`
    background: url("/assets/space-background-new.png");
    background-size: cover;
    height: 100vh;
`;




