import React from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {ContentGrid} from "./ContentGrid";

interface SideMenuProps {
  className?: string;
}

export const SideMenuBase = (props: SideMenuProps) => {
  const {
    className
  } = props;


  return (
    <div className={className}>

    </div>
  )
}


export const SideMenu = styled(SideMenuBase)`
    background-color: black;
    display: block;
    margin: auto;
    width: auto;
`;