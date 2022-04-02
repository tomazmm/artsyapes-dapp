import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Col, Container, Row, Spinner} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

interface ContentProps {
  className?: string;
  nftValue?: any;
}

export const ContentBase = (props: ContentProps) => {
  const {
    className,
    nftValue
  } = props;


  const [imageName, setImageName] = useState<any>("")

  useEffect(() => {
    const tempImageName = nftValue.extension.image.split("//");
    console.log(tempImageName);
    setImageName("https://ipfs.io/ipfs/" + tempImageName[1]);
    console.log(imageName)
    // imageName = "https://ipfs.io/ipfs/" + tempImageName[1];
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
          <span>Name</span>
        </Col>
      </Row>

        {/*<span>Name</span>*/}
    </div>
  )
}


export const Content = styled(ContentBase)`
  background-color: rgba(33, 30, 26, 0.7);
  //display: block;
  //width: 100%;
  //margin: auto;
  //height: 35vh;
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
  //>img{
  //  display: block;
  //  margin: 1rem auto;
  //  max-width: 100%;
  //  max-height: 100%;
  //  height: auto;
  //}
  //>span{
  //  display: block;
  //  margin: auto;
  //}
`;