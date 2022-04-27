import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus, faCircle} from "@fortawesome/free-solid-svg-icons";

interface CollectionProps {
  className?: string;
}

export const CollectionBase = (props: CollectionProps) => {
  const {
    className
  } = props;


  return (
    <div className={className}>
      <div className="my-collection">
        <Row>
          <Col xs={{span: 10}}
          className="d-flex justify-content-start align-self-center align-items-center col">
            <span className="text">Collection</span>
          </Col>
          <Col xs={{span: 2}}
               className="d-flex justify-content-end align-self-center align-items-center col">
            <FontAwesomeIcon className="icon" icon={faPlus}  />
          </Col>
        </Row>
      </div>
      {/*TODO: change this with map*/}
      <div className="collection">
        <Row>
          <Col xs={{span: 10}}
               className="d-flex justify-content-center align-self-center align-items-center col">
            <span className="text">ArtsyApes</span>
          </Col>
          <Col xs={{span: 2}}
               className="d-flex justify-content-end align-self-center align-items-center col">
            <FontAwesomeIcon className="icon" icon={faCircle}  />
          </Col>
        </Row>
      </div>
    </div>
  )
}


export const CollectionMenu = styled(CollectionBase)`
  display: block;
  width: 100%;
  height: 100%;
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
  div{
    -webkit-user-select: none;  /* Chrome all / Safari all */
    -moz-user-select: none;     /* Firefox all */
    -ms-user-select: none;      /* IE 10+ */
    user-select: none;          /* Likely future */
    
    &.my-collection{
      color: white;
      border: 0.1rem solid rgba(92,92,92,.7);
      font-size: 1.3rem;
      padding: 0.7rem;
      border-radius: 0.4rem;
      background: rgb(0,0,0);
      background: linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(71,71,71,.5) 52%, rgba(92,92,92,.5) 100%);
    }
    &.collection{
      color: white;
      border: 0.1rem solid rgba(92,92,92,.7);
      font-size: 1.3rem;
      padding: 0.7rem;
      margin-left: 0.5rem;
      border-radius: 0.4rem;
      background: rgb(0,0,0);
      background: linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(71,71,71,.5) 52%, rgba(92,92,92,.5) 100%);
    }
    .row{
      .col{
        svg{
          height:  0.7rem;
        }
        .text{
          padding-left: 1rem;
        }
      }
    }
  }
  
`;