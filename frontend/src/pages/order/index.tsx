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
            <h1>Tier 3</h1>
          </Col>
          <Col>
            <h1>Tier 2</h1>
          </Col>
          <Col>
            <h1>Tier 1</h1>
          </Col>
        </Row>
      </Container>
    </div>
  )
}


export const Order = styled(OrderBase)`
    > .container-fluid{
        z-index: 1;
      }
`;
