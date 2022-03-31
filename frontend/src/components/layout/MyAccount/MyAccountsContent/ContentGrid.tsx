import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {Content} from "./Content";

interface ContentGridProps {
  className?: string;
}

export const ContentGridBase = (props: ContentGridProps) => {
  const {
    className
  } = props;


  return (
    <div className={className}>
      <Row className="h-auto mt-2">
        <Col
            // xl={{span: 3}}
            lg={{span: 4}}
            md={{span: 6}}
            xs={{span: 12}}
             className="d-flex flex-column justify-content-start align-self-start align-content-center align-items-center col mb-4">
          <Content/>
        </Col>
        <Col
          // xl={{span:3}}
          lg={{span: 4}}
          md={{span: 6}}
          xs={{span: 12}}
             className="d-flex flex-column justify-content-start align-self-end align-content-center align-items-end col my-account-col mb-4">
          <Content/>
        </Col>
        <Col
          // xl={{span:3}}
          lg={{span: 4}}
          md={{span: 6}}
          xs={{span: 12}}
             className="d-flex flex-column justify-content-start align-self-end align-content-center align-items-end col my-account-col mb-4">
          <Content/>
        </Col>
        <Col
          // xl={{span:3}}
          lg={{span: 4}}
          md={{span: 6}}
          xs={{span: 12}}
          className="d-flex flex-column justify-content-start align-self-end align-content-center align-items-end col my-account-col mb-4">
          <Content/>
        </Col>
        <Col
          // xl={{span:3}}
          lg={{span: 4}}
          md={{span: 6}}
          xs={{span: 12}}
          className="d-flex flex-column justify-content-start align-self-end align-content-center align-items-end col my-account-col mb-4">
          <Content/>
        </Col>
        <Col
          // xl={{span:3}}
          lg={{span: 4}}
          md={{span: 6}}
          xs={{span: 12}}
          className="d-flex flex-column justify-content-start align-self-end align-content-center align-items-end col my-account-col mb-4">
          <Content/>
        </Col>
        <Col
          // xl={{span:3}}
          lg={{span: 4}}
          md={{span: 6}}
          xs={{span: 12}}
          className="d-flex flex-column justify-content-start align-self-end align-content-center align-items-end col my-account-col mb-4">
          <Content/>
        </Col>
      </Row>



    </div>
  )
}


export const ContentGrid = styled(ContentGridBase)`
  display: block;
  width: 100%;
  margin: auto;
  height: 65vh;
  overflow-y: scroll;
  overflow-x: hidden;
  //::-webkit-scrollbar {
  //  display: none;
  //}
`;