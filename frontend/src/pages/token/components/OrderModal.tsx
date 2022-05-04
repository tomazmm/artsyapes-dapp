import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Button, Col, Modal, ModalHeader, Row} from "react-bootstrap";
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

    const MODAL_TITLES = ["Tier selection", "Shipping Information"]
    const TIERS = ["tier-3", "tier-2", "tier-1"]

    const MIN_STEP_SIZE = 1;
    const MAX_STEP_SIZE = 2;
    const [step, setStep] = useState(1);

    const [order, setOrder] = useState({
        tier: -1
    });

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

    const prevStep = () => {
        if (step - 1 < MIN_STEP_SIZE) return;
        const current_step = document?.getElementById(`step-${step}`);
        if (current_step){
            current_step.classList.remove("step-active");
            const next_step = document?.getElementById(`step-${step - 1}`);
            next_step?.classList.add("step-active");
            setStep(step - 1);
        }
    };

    const hideModal = () => {
        setStep(1);
        setOrder({
            tier: -1
        })
        toggleModal()
    }

    const selectTier = (tier: string) => {
        const selected_tier = parseInt(tier.split("-")[1]);
        if(selected_tier == order.tier) return;
        if (order.tier) {
            document?.getElementById(`tier-${order.tier}`)?.classList.remove("tier-active");
        }
        document?.getElementById(tier)?.classList.add("tier-active");
        setOrder({
            tier: selected_tier
        })
    }

    return (
        <Modal show={show} onHide={hideModal} centered size="xl" dialogClassName={className}>
            <ModalHeader closeButton={true}>
                <h4>{MODAL_TITLES[step - 1]}</h4>
            </ModalHeader>
            <Modal.Body>
                <div id="step-1" className="step step-active">
                    <div className="d-flex h-100 justify-content-around align-items-center">
                        {TIERS.map((tier: string, index: number) => {
                            return <div key={index} id={tier} className="tier" onClick={() => selectTier( tier)}>
                                <img src={`/assets/${tier}.png`} />
                                <h5 className="mb-4">Tier {tier.split("-")[1]}</h5>
                            </div>
                        })}
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
                <div className="w-100 d-flex justify-content-between">
                    <Button onClick={prevStep}
                            className={`btn-step ${step === 1 ? "disabled" : ""}`}>Back</Button>
                    <Button onClick={nextStep}
                            className={`btn-step ${order.tier === -1 ? "disabled" : ""}`}>Next</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export const OrderModal = styled(OrderModalBase)`
  &.modal-xl{
    width: 70vw;
  }
  .modal-content {
    height: 65vh;
    .modal-body{
      .step {
        display: none;
      }
      .step-active {
        display: block !important;
      }
      #step-1{
        height: 100%;
        .tier{
          width: 28%;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
          //background-color: rgba(200,200,200, .3);
          border-radius: 2%;
          img{
            width: 80%;    
          }
          &:hover{
            background-color: rgba(200,200,200, .3);
          }
        }
        .tier-active {
          background-color: rgba(200,200,200, .2);
        }
      }
    }
    .modal-footer{
      .btn-step {
        font-weight: bold;
        font-size: 1.2em;
        background-color: rgba(218,165,32, .9);
        border: none;
        color: white;
        &.disabled {
          cursor: not-allowed;
        }
        &:hover {
          background-color: rgba(218,165,32, .75);
          color: white;
        }
        &:focus{
          box-shadow: 0 0 0 0.2rem rgba(218,165,32, .35);
        }
      }
    }
  }
`;