import React from "react";
import styled from 'styled-components';
import {Spinner} from "react-bootstrap";


interface ErrorPageProps {
  className?: string;
}

export const ErrorPageBase = (props: ErrorPageProps) => {
  const {
    className,
  } = props;


  return (
    <div className={className}>
      <h1>404</h1>
      <h2>False request. Page unavailable</h2>
    </div>
  )
}


export const ErrorPage = styled(ErrorPageBase)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;




