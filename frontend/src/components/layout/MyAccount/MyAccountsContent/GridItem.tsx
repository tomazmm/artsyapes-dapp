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



  return (
    <div className={className}>
      <Row className="h-auto">
        <Col xs={{span: 12}}
             className="d-flex flex-column justify-content-center  col">
          <img src={imageName} />
        </Col>
      </Row>

      <Row className="h-auto">
        <Col xs={{span: 12}}
             className="d-flex flex-column justify-content-start align-self-center align-content-center align-items-start col">
          <span>{nftValue.extension.name}</span>
        </Col>
      </Row>
    </div>
  )
}


export const GridItem = styled(GridItemBase)`
  background-color: rgba(33, 30, 26, 0.7);
  border-radius: 0.5rem;
  .row{
    .col{
      img{
        //display: block;
        //margin: auto;
        max-width: 100%;
        max-height: 100%;
        height: auto;
        padding: 1rem;
      }
      span{
        color: white;
        padding-bottom: 2rem ;
        padding-left: 1rem;
      }
    }
  }
`;