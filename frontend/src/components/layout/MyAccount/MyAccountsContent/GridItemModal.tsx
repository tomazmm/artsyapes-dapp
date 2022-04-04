import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Row, Col, Modal, Button } from "react-bootstrap";

interface GridItemModalProps {
  className?: string;
  nftValue?: any;
  imageName?: string;
  show?: boolean;
  setShow?: any;
}

export const GridItemModalBase = (props: GridItemModalProps) => {
  const {
    className,
    nftValue,
    imageName,
    show,
    setShow
  } = props;

  const toggleModal = () => setShow();

  return (
      <Modal show={show} onHide={toggleModal} centered dialogClassName={className}>
          <Modal.Header closeButton>
            <Modal.Title># {nftValue.extension.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="nft-details">
            <Row>
              <Col xs={6} className="col-image">
                <img src={imageName} />
              </Col>
              <Col xs={6} className="d-flex flex-column justify-content-between">
                {JSON.stringify(nftValue.extension.attributes)}
                <Button onClick={() => {console.log(123)}}>
                  Order physical Item
                </Button>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
      </Modal>
  )
}

export const GridItemModal = styled(GridItemModalBase)`
  max-width: 60%;
  .modal-content{
    .modal-body{
      .col-image{
        img{
          width: 100%;
        }
      }
    }
  }
`;