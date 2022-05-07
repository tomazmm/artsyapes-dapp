import React from "react";
import styled from 'styled-components';
import {Spinner} from "react-bootstrap";


interface Page404Props {
  className?: string;
}

export const Page404Base = (props: Page404Props) => {
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


export const Page404 = styled(Page404Base)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;




