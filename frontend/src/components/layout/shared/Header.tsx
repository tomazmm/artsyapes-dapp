import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import {ConnectWallet} from "../../shared/ConnectWallet";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

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
        <Row className="header-row d-flex flex-row align-items-center">
          <Col lg={{span: 12}} sm={{span: 10}}
               xs={{span: 10}} md={{span: 12}} className="left-col" >
            <Row className="h-25 d-flex flex-row align-items-center">
              <Col lg={{span: 6}} sm={{span: 12}}
                   xs={{span: 12}} md={{span: 6}} className="col logo" >
                <img className="logo" src={'/assets/logo.png'}/>
              </Col>
              <Col lg={{span: 6}} sm={{span: 12}}
                   xs={{span: 12}} md={{span: 6}} className="col wallet-button ">
                <ConnectWallet />
              </Col>
            </Row>
          </Col>
          <Col sm={{span: 2}}
               xs={{span: 2}}  className="burger-menu" >
            <FontAwesomeIcon className="icon" icon={faBars}  />
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
    .header-row{
      .left-col{
        .row{
          .col{
            display: flex;
            &.logo{
              justify-content: start;
            }

            &.wallet-button{
              @media screen and (min-width: 768px) {
                justify-content: end;
              }

              @media screen and (max-width: 767px) {
                display: none!important;
              }
            }
            padding: 0.5rem;
            .logo{
              width: 10rem;
            }
          }
        }
      }
      .burger-menu{
        @media screen and (min-width: 768px) {
          display: none;
        }

        @media screen and (max-width: 767px) {
          display: flex;
          justify-content: center;
        }
        
        
        svg{
          height: 2rem;
          color: white;
        }
      }
    }
  }
      
`;