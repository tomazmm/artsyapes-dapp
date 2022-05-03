import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Button, Col, Modal, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

interface OrderModalProps {
    className?: string;
    show: boolean,
    toggleModal: any // is a function
}

export const OrderModalBase = (props: OrderModalProps) => {
    const {
        className,
        show,
        toggleModal
    } = props;

    return (
        <Modal show={show} onHide={toggleModal} centered size="lg" dialogClassName={className}>
            <Modal.Body>
                <div>
                    <div id="step-1">
                        <div className="row">
                            <div className="col-md-6">
                                <input type="text" className="form-control" placeholder="Name" required/>
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control" placeholder="Email" required/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <input type="text" className="form-control" placeholder="Password" required/>
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control" placeholder="Repeat password" required/>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button >Next</Button>
                <Button variant="secondary" onClick={toggleModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export const OrderModal = styled(OrderModalBase)`
  
`;