import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Col, Container, Modal, Row,} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {GridItem} from "./GridItem";
import globalContext from "../../../components/shared/GlobalContext";
import GlobalContext from "../../../components/shared/GlobalContext";

interface GridProps {
  className?: string;
}

export const GridBase = (props: GridProps) => {
  const {
    className
  } = props;

  const [show, setShow] = useState(true);
  const context = useContext(GlobalContext);

  useEffect(() => {
    if(context.tokensInfo.length)
      for(const it of context.tokensInfo){
        if(it.extension === null){
          setShow(false);
          break;
        }
      }
  }, [context.tokensInfo.length]);


  return (
    <div className={className}>
      <Row className={`grid-row ${ !show ? "grid-row-center" : ""}`}>
        { show ?(
          context.tokensInfo.map((value: any, index: any) => {
              return <Col key={index}
                          xl={{span:4}}
                          lg={{span: 6}}
                          md={{span: 6}}
                          xs={{span: 12}}
                          className="d-flex flex-column justify-content-start align-self-start align-content-center align-items-center col mb-4">
                <GridItem nftValue={value}/>
              </Col>
            })
        ) : (
            <Col className="d-flex flex-column justify-content-center align-content-center align-items-center col-no-nft">
              <FontAwesomeIcon className="warning" icon={faCircleExclamation}  />
              <span>You do not own an ArtsyApe yet.</span>
            </Col>
        )
        }
      </Row>
    </div>
  )
}


export const Grid = styled(GridBase)`
  display: block;
  width: 100%;
  margin: auto;
  max-height: 100%;
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
    max-height: 100%;
    height: 100%!important;
    display: flex;
    .col-no-nft{
      padding: 1rem;
      background: rgb(0,0,0);
      background: linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(71,71,71,.5) 40%, rgba(92,92,92,.5) 100%);
      border-radius: 0.4rem;
      flex: none;
      border: 1px solid rgba(92,92,92,.7);
      width: 20rem;
      color: white;
      .warning{
        margin: 1rem;
        color: yellow;
        height: 2rem;
      }
      span{
        display: flex;
        justify-content: center;
        text-align: center;
      }
    }
  }
  .grid-row-center {
    align-content: center;
    justify-content: center;
  }
  
`;