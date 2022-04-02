import React from "react";
import styled from 'styled-components';
import {Spinner} from "react-bootstrap";


interface LoadingContentProps {
  className?: string;
  ammountNfts?: number;
  ammountNftsLoaded?: number;
}

export const LoadingContentBase = (props: LoadingContentProps) => {
  const {
    className,
    ammountNfts,
    ammountNftsLoaded
  } = props;


  return (
    <div className={className}>
      <div className="loading-content d-flex justify-content-center align-items-center align-self-center flex-column">
        <Spinner className="p-2" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="loading-text">{"Loading NFTS... (" + ammountNftsLoaded +"/" + ammountNfts + ")"}</span>
      </div>
    </div>
  )
}


export const LoadingContent = styled(LoadingContentBase)`
  .loading-content{
    height: 65vh;
    .loading-text{
      margin-top: 1rem;
      color: white;
      font-size: 1.1rem;
    }
  }
`;




