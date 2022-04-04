import React from "react";
import styled from 'styled-components';
import {Col, Container, Modal, Row,} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {GridItem} from "./GridItem";

interface GridProps {
  className?: string;
  nftInfo?: any;
}

export const GridBase = (props: GridProps) => {
  const {
    className,
    nftInfo
  } = props;


  return (
    <div className={className}>
      <Row className="h-auto grid-row">
        {nftInfo.map((value: any, index: any) => {
          return <Col key={index}
            xl={{span:4}}
            lg={{span: 6}}
            md={{span: 6}}
            xs={{span: 12}}
            className="d-flex flex-column justify-content-start align-self-start align-content-center align-items-center col mb-4">
            <GridItem nftValue={value}/>
          </Col>
        })}
      </Row>
    </div>
  )
}


export const Grid = styled(GridBase)`
  display: block;
  width: 100%;
  margin: auto;
  height: 65vh;
  overflow-y: auto;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  .grid-row{
    margin-right: 0.1rem;
  }
  
`;