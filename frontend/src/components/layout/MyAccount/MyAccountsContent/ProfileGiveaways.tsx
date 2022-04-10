import React from "react";
import styled from 'styled-components';
import {Col, Container, Modal, Row,} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {GridItem} from "./GridItem";

interface ProfileGiveavaysProps {
  className?: string;
  nftInfo?: any;
}

export const ProfileGiveavaysBase = (props: ProfileGiveavaysProps) => {
  const {
    className,
  } = props;


  return (
    <div className={className}>
      <div className="info-container free-shipping-tier-3">
        <span className="text">Free Shipping Tier 3</span>
        <span className="value"> 0/3</span>
      </div>
      <div className="info-container free-shipping-tier-2">
        <span className="text">Free Tier 2</span>
        <span className="value"> 1/1</span>
      </div>
      <div className="info-container free-shipping-tier-1">
        <span className="text">Free Giclee</span>
        <span className="value"> 1/1</span>
      </div>
      <div className="info-container free-shipping-tier-0">
        <span className="text">Voucher</span>
        <span className="value"> 500$</span>
      </div>
      {/*<Row>*/}
      {/*  <Col className="d-flex justify-content-end" xs={{span: 3}}>*/}
      {/*    <span>dsd</span>*/}
      {/*  </Col>*/}
      {/*  <Col className="d-flex justify-content-end" xs={{span: 3}}>*/}
      {/*    <span>dsd</span>*/}
      {/*  </Col>*/}
      {/*  <Col className="d-flex justify-content-end" xs={{span: 3}}>*/}
      {/*    <span>dssdadasd</span>*/}
      {/*  </Col>*/}
      {/*  <Col className="d-flex justify-content-end" xs={{span: 3}}>*/}
      {/*    <span>dsd</span>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
    </div>
  )
}


export const ProfileGiveavays = styled(ProfileGiveavaysBase)`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  margin: 0.4rem;
  .info-container{
    font-size: 0.9rem;
    border: 0.1rem solid white;
    padding: 0.1rem 0.6rem;
    margin-bottom: 0.5rem;
    color: white;
    border-radius: 0.4rem;
    background: rgb(0,0,0);
    background: linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(71,71,71,.5) 52%, rgba(92,92,92,.5) 100%);
    .text{
      display: inline-block;
      margin-right: 1.7rem;
    }
    margin-right: 1rem;
    
    //&.free-shipping-tier-3{
    //  margin-right: 1rem;
    //}
    //&.free-shipping-tier-2{
    //  margin-right: 1rem;
    //}
    //&.free-shipping-tier-1{
    //  margin-right: 1rem;
    //}
    //&.free-shipping-tier-0{
    //  
    //}
  }
  
`;