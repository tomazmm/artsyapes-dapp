import React from "react";
import styled from 'styled-components';
import {Col, Container, Modal, Row,} from "react-bootstrap";
import {CollectionMenu} from "../../../../pages/my-profile/components/CollectionMenu";


interface BurgerMenuProps {
  className?: string;
  show?: boolean;
}

export const BurgerMenuBase = (props: BurgerMenuProps) => {
  const {
    className,
    show
  } = props;

  return (
    <div className={className}>
      <Container fluid className="h-100">
        <Row className="h-auto about my-4">
          <Col
               xs={{span: 12}}
               className="d-flex flex-column justify-content-center align-self-start align-items-center col my-collection">
            <div className="white-line"></div>
            <CollectionMenu/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}


export const BurgerMenu = styled(BurgerMenuBase)`
  @media screen and (min-width: 768px) {
    display: none;
  }

  @media screen and (max-width: 767px) {
    display: flex;
  }

  position: fixed;
  height: auto;
  background-color: rgba(0,0,0,1);
  z-index: 1000;
  width: 100%;
  margin-top: 7rem;
`;