import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Row, Col, Modal, Button } from "react-bootstrap";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
          <Modal.Body className="nft-details">
            <Row>
              <Col xs={6} className="d-flex flex-wrap col-image">
                <img src={imageName} />
                <span className="image-name">{nftValue.extension.name}</span>
              </Col>
              <Col xs={6} className="d-flex flex-wrap flex-column align-items-center justify-content-start col-info">
                <div className="close-button d-flex flex-wrap justify-content-end">
                  <FontAwesomeIcon className="close" icon={faClose} onClick={toggleModal} />
                </div>
                <div className="title d-flex flex-wrap justify-content-center">
                  <span>Traits</span>
                </div>
                <div className="traits d-flex justify-content-start">
                  {nftValue.extension.attributes.map((value: any, index: any) => {
                    return <div key={index}>
                      <span className="value-title">{value.trait_type.charAt(0).toUpperCase() + value.trait_type.slice(1)}</span>
                      { index < nftValue.extension.attributes.length-1 ?
                        (
                          <div className="value line">
                            <span className="name">{value.value}</span>
                            <span className="percentage">55%</span>
                          </div>
                        ):
                        (
                          <div className="value">
                            <span className="name">{value.value}</span>
                            <span className="percentage">55%</span>
                          </div>
                        )
                      }
                    </div>
                  })}
                </div>
                <Button variant="light">Order Physical Item</Button>
              </Col>
            </Row>
          </Modal.Body>
      </Modal>
  )
}

export const GridItemModal = styled(GridItemModalBase)`
  max-width: 100%;
  display: flex;
  justify-content: center;
  .modal-content{
    background: rgb(0,0,0);
    background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(28, 28, 28,1) 40%, rgba(28, 28, 28,1) 100%);
    border: 1px solid rgba(92,92,92,.7);
    width: 60rem;
    color: white;
    .modal-body{
      padding: 0;
      border-radius: 0.2rem;
      .row{
        margin: 0!important;
        .col-image{
          background: rgb(0,0,0);
          background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(28, 28, 28,1) 40%, rgba(28, 28, 28,1) 100%);
          box-shadow: 5px 0 rgba(0,0,0,.3);
          border: 1px solid rgba(92,92,92,.7);
          border-radius: 0.2rem;
          padding: 2rem;
          img{
            max-width: 100%;
            max-height: 100%;
            margin-bottom: 1rem;
          }
          .image-name{
            font-size: 1.3rem;
          }
        }
        .col-info{
          padding: 1rem;
          .close-button{
            width: 100%;
            padding-right: 1rem;
            margin-bottom: -15px;
            .close{
              cursor: pointer;
            }
          }
          .title{
            font-size: 1.3rem;
            padding-bottom: 1rem;
          }
          .traits{
            display: flex;
            flex-wrap: wrap;
            width: 90%;
            border: 1px solid rgba(92,92,92,.7);
            border-radius: 0.4rem;
            padding: 1rem;
            div{
              width: 100%;
              .value-title{
                color: rgba(92,92,92,1);
              }
              .value{
                padding-left: 0.5rem;
                font-size: 0.9rem;
                display: flex;
                justify-content: space-between;
              }
              &.line{
                border-bottom: 1px solid rgba(92,92,92,.7);
              }
              margin-top: 0.1rem;
            }
            margin-bottom: 1rem;
          }
        }
      }
    }
  }
`;