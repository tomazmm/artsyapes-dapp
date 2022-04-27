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
    <div className={`${className}`} >
      <Container fluid >
          <Row>
            <Col xl={{span: 12}}
                 lg={{span: 12}}
                 xs={{span: 12}}
                 className="d-flex flex-column col my-account-col">
                <h2 className="mb-0 text-white text-bold">Collection</h2>
                <div className="white-line nfts"></div>
                <Grid/>
            </Col>
          </Row>
      </Container>
    </div>
  )
}


export const MyProfile= styled(MyProfileBase)`
  height: 100%;
  margin-top: 2.5em;
    > .container-fluid{
        height: 100%;
        width: 70%;
        .row{
          height: 100%;
          .col{
            &.my-account-col{
              height: 95%;
              @media screen and (max-width: 1200px) and (min-width: 768px){
                height: 70%;
              }
            }
            .white-line{
              border-bottom: 2px groove white;
              width: 100%;
              margin-bottom: 2rem;
              &.nfts{
                margin-top: 1rem;
                @media screen and (max-width: 1200px) and (min-width: 768px){
                  margin-top: 0;
                }
              }
            }
          }
        }
      }
`;
