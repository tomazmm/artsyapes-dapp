import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import {Header} from "../shared/Header";

interface MyAccountProps {
  className?: string;
}

export const MyAccountBase = (props: MyAccountProps) => {
  const {
    className
  } = props;


  return (
    <div className={className}>
      <Header/>
      <Container fluid className="h-100 fixed-top">
          <Row className="h-auto about">
            <Col xs={3} className="d-flex flex-column justify-content-center align-self-end align-content-center align-items-center col">
              <span className="owned-text">Owned</span>
              <div className="white-line"></div>
            </Col>
            <Col className="d-flex flex-column justify-content-center align-self-end align-content-center align-items-end col my-account-col">
              <span className="my-account-text">My Account</span>
              <div className="white-line"></div>
            </Col>
          </Row>
      </Container>
    </div>
  )
}


export const MyAccount = styled(MyAccountBase)`
    //background-color: aliceblue;
    //background-size: cover;
    //height: 100vh;
    > .container-fluid{
        z-index: 1;
        background: url("/assets/my-account-background.png");
        background-size: cover;
        padding: 10rem 4rem;
        .row{
          &.about{
            margin: 9rem 0;
          }
          .col{
            &.my-account-col{
              margin-left: 2rem;
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
