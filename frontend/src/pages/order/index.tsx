import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";

interface OrderProps {
  className?: string;
}

export const OrderBase = (props: OrderProps) => {
  const {
    className,
  } = props;

  return (
    <div className={className}>
      <Container fluid>
        <Row>
          <Col>
            <h2>Tier 3</h2>
            <img src="../../assets/golden-ape-trait.png"/>
          </Col>
          <Col>
            <h2 className="mt-5">Tier 2</h2>
            <img src="../../assets/golden-ape-trait.png"/>
          </Col>
          <Col>
            <h2>Tier 1</h2>
            <img src="../../assets/golden-ape-trait.png"/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}


export const Order = styled(OrderBase)`
    > .container-fluid{
      margin-top: 6em;
      width: 80%;
        .row {
          .col{
            display: flex;
            flex-direction: column;
            align-items: center;
            h2 {
              color: white;
            }
            img {
              margin-top: 1.5em;
              width: 60%;
              cursor: pointer;
            }
          }
        }
      }
`;
