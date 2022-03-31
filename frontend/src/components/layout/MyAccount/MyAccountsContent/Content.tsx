import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

interface ContentProps {
  className?: string;
}

export const ContentBase = (props: ContentProps) => {
  const {
    className
  } = props;


  return (
    <div className={className}>

    </div>
  )
}


export const Content = styled(ContentBase)`
  background-color: red;
  display: block;
  width: 100%;
  margin: auto;
  height: 30vh;
`;