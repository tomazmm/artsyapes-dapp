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
    </div>
  )
}


export const Order = styled(OrderBase)`
    > .container-fluid{
        z-index: 1;
      }
`;
