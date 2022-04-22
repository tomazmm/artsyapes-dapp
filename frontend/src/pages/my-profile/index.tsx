import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import {Grid} from "./components/Grid";
import {CollectionMenu} from "./components/CollectionMenu";

interface MyProfileProps {
  className?: string;
}

export const MyProfileBase = (props: MyProfileProps) => {
  const {
    className
  } = props;


  return (
    <div className={`${className} h-75`} >
      <Container fluid className="h-100 mt-5">
          <Row className="h-100 mb-4">
            <Col xl={{span: 3}}
                 lg={{span: 12}}
                 xs={{span: 12}}
                 className="d-flex flex-column justify-content-center align-self-start align-items-center col my-collection">
              <span className="owned-text">My Collection</span>
              <div className="white-line"></div>
              <CollectionMenu/>
            </Col>
            <Col xl={{span: 9}}
                 lg={{span: 12}}
                 xs={{span: 12}}
                 className="d-flex flex-column col my-account-col">
              <div className="white-line nfts"></div>
              <Grid className={className}/>
            </Col>
          </Row>
      </Container>

    </div>
  )
}


export const MyProfile= styled(MyProfileBase)`
    > .container-fluid{
        width: 95%;
        .row{
          .col{
            &.my-collection{
              @media screen and (max-width: 767px) {
                display: none!important;
              }
            }
            &.my-account-col{
              height: 100%;
              @media screen and (max-width: 1200px) and (min-width: 768px){
                height: 80%;
              }
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
              border-bottom: 2px groove rgba(194, 194, 194, .8);
              width: 100%;
              margin-bottom: 2rem;
              &.nfts{
                margin-top: 3.07rem;
              }
            }
          }
        }
      }
`;
