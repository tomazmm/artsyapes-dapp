import React from "react";
import styled from 'styled-components';
import {Spinner} from "react-bootstrap";


interface LoadingPageProps {
  className?: string;
}

export const LoadingPageBase = (props: LoadingPageProps) => {
  const {
    className
  } = props;


  return (
    <div className={className}>
      <div className="loading d-flex justify-content-center align-items-center align-self-center flex-column">
        <img className="mb-5 logo p-2" src={'/assets/logo.png'}/>
        <Spinner className="p-2" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  )
}


export const LoadingPage = styled(LoadingPageBase)`
  .loading{
    height: 100vh;
    .logo{
      height: 10vh;
    }
  }
`;




