import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Spinner} from "react-bootstrap";

interface LoadingCircleProps {
    className?: string;
}

export const LoadingCircleBase = (props: LoadingCircleProps) => {
    const {
        className,
    } = props;

    return (
        <div className={className}>
            <Spinner className="p-2" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
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