import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";
import {Button, Col, Row, Spinner} from "react-bootstrap";

interface LoadingCircleProps {
    className?: string;
}

export const LoadingCircleBase = (props: LoadingCircleProps) => {
    const {
        className,
    } = props;

    return (
        <div className={className}>
            <Spinner className="p-2 m-4" animation="grow" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <span>Loading token...</span>
        </div>
    )
}

export const LoadingCircle = styled(LoadingCircleBase)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
  span{
    font-size: 1.5rem;
  }
`;