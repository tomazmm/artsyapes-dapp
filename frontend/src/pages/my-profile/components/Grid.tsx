import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Col, Container, Modal, Row,} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
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

  const [show, setShow] = useState(false);

  useEffect(() => {
    console.error(nftInfo);
    if(nftInfo.length > 0)
      for(const it of nftInfo){
        if(it.extension === null){
          setShow(false);
          break;
        }
      }
  }, [nftInfo.length]);


  return (
    <div className={className}>
      <Row className="h-auto grid-row">
        { show ?(
            nftInfo.map((value: any, index: any) => {
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
              <span>Your list of tokens is empty.</span>
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
  
  .grid-row{
    margin-right: 0.1rem;
    max-height: 100%;
    height: 100%!important;
    display: flex;
    align-content: center;
    justify-content: center;
    .col-no-nft{
      padding: 1rem;
      background: rgb(0,0,0);
      background: linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(71,71,71,.5) 40%, rgba(92,92,92,.5) 100%);
      border-radius: 0.4rem;
      flex: none;
      border: 1px solid rgba(92,92,92,.7);
      width: 14rem;
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
  
`;