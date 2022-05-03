import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Button, Col, Modal, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {increment} from "../../../contract/execute";

interface OrderModalProps {
    className?: string;
    show: boolean,
    toggleModal: any
}

export const OrderModalBase = (props: OrderModalProps) => {
    const {
        className,
        show,
        toggleModal
    } = props

    const MAX_STEP_SIZE = 2;
    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step + 1 > MAX_STEP_SIZE) return;
        const current_step = document?.getElementById(`step-${step}`);
        if (current_step){
            current_step.classList.remove("step-active");
            const next_step = document?.getElementById(`step-${step + 1}`);
            next_step?.classList.add("step-active");
            setStep(step + 1);
        }
    };

    const hideModal = () => {
        setStep(1);
        toggleModal()
    }

    return (
        <Modal show={show} onHide={hideModal} centered size="xl" dialogClassName={className}>
            <Modal.Body>
                <div id="step-1" className="step step-active">
                    <h4>Tier selection</h4>
                    <div className="d-flex flew-row">
                        <div className="tier flex-column justify-content-center">
                            <img src="/assets/tier-3.png" />
                            <h5>Tier 3</h5>
                        </div>
                        <div className="tier flex-column justify-content-center">
                            <img src="/assets/tier-2.png" />
                            <h5>Tier 2</h5>
                        </div>
                        <div className="tier flex-column justify-content-center">
                            <img src="/assets/tier-1.png" />
                            <h5>Tier 1</h5>
                        </div>
                    </div>
                </div>
                <div id="step-2" className="step">
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="Name" required/>
                        </div>
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="Email" required/>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={nextStep}>Next</Button>
                <Button variant="secondary" onClick={hideModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export const OrderModal = styled(OrderModalBase)`
  &.modal-xl{
    width: 70vw;
  }
  .modal-content {
    height: 50vh;
    .modal-body{
      .step {
        display: none;
      }
      .step-active {
        display: block !important;
      }
      #step-1{
        .tier{
          display: flex;
          flex-direction: column;
          align-items: center;
          img{
            width: 80%;    
          }  
        }
      }
    }
  }
`;