import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import {ConnectWallet} from "../../shared/ConnectWallet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

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
            <div className="enter-text">
              <span className="text-white button-text" > TO ENTER THE APESHOP
              </span>
              <FontAwesomeIcon className="icon" icon={faChevronRight} />
            </div>
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




