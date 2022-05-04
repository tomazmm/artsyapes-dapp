import React from "react";
import styled from 'styled-components';
import {Button, Col, Container, Modal, Row} from "react-bootstrap";

interface ConnectionOptionsModalProps {
  className?: string;
  show?: boolean;
  setShow?: any;
  availableConnectTypes: any;
}

export const ConnectionOptionsModalBase = (props: ConnectionOptionsModalProps) => {
  const {
    className,
    show,
    setShow,
    availableConnectTypes,
  } = props;

  const toggleModal = () => setShow();

  return (
      <Modal show={show} onHide={toggleModal} centered dialogClassName={className}>
        <Modal.Header closeButton> </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xl={{span: 12}}
                 lg={{span: 12}}
                 xs={{span: 12}}
                 className="col"
            >
              <span className="d-flex flex-column justify-content-start align-items-center title">Connect Wallet</span>
            </Col>
            {
              availableConnectTypes.map((value: any, index: number) => {
                return <Col xl={{span: 12}}
                            lg={{span: 12}}
                            xs={{span: 12}}
                            className="col"
                            key={`connect-${value.type}`}
                >
                  <Button variant="light"
                          onClick={() => value.func(value.type)}
                          type="button"
                          className="d-flex justify-content-between align-items-center"
                  >
                    <span className="button-text">{value.valueName}</span>
                    <div className={"logo " + value.logo}></div>
                  </Button>
                </Col>
              })
            }
          </Row>
        </Modal.Body>
      </Modal>
  )
}


export const ConnectionOptionsModal = styled(ConnectionOptionsModalBase)`
    >.modal-content{
      border-radius: 0.5rem;
      .modal-header{
        padding-bottom: 0;
        border-bottom: none;
      }
      .modal-body{
        .row{
          .col{
            .title{
              font-size: 1.2rem;
              margin-bottom: 2rem;
            }
            button{
              font-size: 0.9rem;
              width: 100%;
              padding: 1rem 2rem;
              background: white;
              border: none;
              &:hover{
                opacity: 0.7;
              }
              .logo{
                width: 2rem;
                height: 2rem;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                &.terra-station{
                  background-image: url("assets/terrastation-logo.png");
                }
                &.wallet-connect{
                  background-image: url("assets/walletconnect-logo.png");
                  
                }
              }
            }
          }
        }
      }
    }
`;




