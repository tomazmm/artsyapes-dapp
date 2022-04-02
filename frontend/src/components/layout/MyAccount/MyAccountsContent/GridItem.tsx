import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Col, Container, Row, Spinner} from "react-bootstrap";

interface GridItemProps {
  className?: string;
  nftValue?: any;
}

export const GridItemBase = (props: GridItemProps) => {
  const {
    className,
    nftValue
  } = props;


  const [imageName, setImageName] = useState<any>("")

  useEffect(() => {
    const tempImageName = nftValue.extension.image.split("//");
    setImageName("https://ipfs.io/ipfs/" + tempImageName[1]);
  }, []);

  const showModal = (e: any) => {
    console.log("Pop up modal");
  }

  return (
    <div className={className} onClick={showModal}>
      <div className="grid-item-wrapper d-flex flex-column">
        <img src={imageName} />
        <span>{nftValue.extension.name}</span>
      </div>
    </div>
  )
}


export const GridItem = styled(GridItemBase)`
  background-color: rgba(33, 30, 26, 0.7);
  .grid-item-wrapper {
    img{
      max-width: 100%;
      max-height: 100%;
      padding: 1rem;
    }
    span{
      color: white;
      padding-bottom: 2rem ;
      padding-left: 1rem;
    }
  }
`;