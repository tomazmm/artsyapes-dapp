import React, {useState} from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import {ConnectWallet} from "../../shared/ConnectWallet";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from 'react-router-dom';

interface HeaderProps {
  className?: string;
  setShow?: any;
}

export const HeaderBase = (props: HeaderProps) => {
  const {
    className,
    setShow
  } = props;

  const toggleBurgerMenu = () => setShow();

  const navigate = useNavigate();
  const navigateMyProfile = () => navigate('/');

  return (
    <div className={className}>
      <Container fluid className="h-auto">
        <Row className="header-row d-flex flex-row align-items-center">
          <Col lg={{span: 12}} sm={{span: 10}}
               xs={{span: 10}} md={{span: 12}} className="left-col" >
            <Row className="h-25 d-flex flex-row align-items-center">
              <Col lg={{span: 6}} md={{span: 6}} className="col logo" >
                <img onClick={navigateMyProfile} className="logo" src={'/assets/logo.png'}/>
              </Col>
              <Col lg={{span: 6}} md={{span: 6}} className="col right-wing">
                <span onClick={navigateMyProfile} className="my-profile">My Apes</span>
                <ConnectWallet />
              </Col>
            </Row>
          </Col>
          <Col sm={{span: 2}}
               xs={{span: 2}}  className="burger-menu" >
            <FontAwesomeIcon className="icon" icon={faBars}  onClick={toggleBurgerMenu}/>
          </Col>
        </Row>
        </Container>
    </div>
  )
}


export const Header = styled(HeaderBase)`
  >.container-fluid{
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

            &.right-wing{
              @media screen and (min-width: 768px) {
                justify-content: end;
              }

              @media screen and (max-width: 767px) {
                display: none!important;
              }
              .my-profile{
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                padding-right: 1rem;
                cursor: pointer;
              }
            }
            padding: 0.5rem;
            .logo{
              width: 10rem;
              cursor: pointer;
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
        cursor: pointer;
        
        svg{
          height: 2rem;
          color: white;
        }
      }
    }
  }
      
`;