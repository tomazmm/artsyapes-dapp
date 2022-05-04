import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Button, Col, Modal, ModalHeader, Row} from "react-bootstrap";
import { useFormik } from 'formik';

interface ShippingFormProps {
    className?: string;
}

export const ShippingFormBase = (props: ShippingFormProps) => {
    const {
        className,
    } = props


    const formik = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <Row className={className}>
            <Col lg={{span: 6, offset:3}}>
                <label htmlFor="full-name">Full Name</label>
                <input
                    id="full-name"
                    name="full-name"
                    type="text"
                    className="form-control"
                    placeholder="Artsy Ape"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    required
                />
                <label htmlFor="discord">Discord Handle</label>
                <input
                    id="discord"
                    name="discord"
                    type="text"
                    className="form-control"
                    placeholder="ArtsyApe#1337"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    required
                />
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="artsyape-69@mail.banana"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    required
                />
                <label htmlFor="country">Country</label>
                <input
                    id="country"
                    name="country"
                    type="text"
                    className="form-control"
                    placeholder="Austria"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    required
                />
                <label htmlFor="country">City</label>
                <input
                    id="city"
                    name="city"
                    type="text"
                    className="form-control"
                    placeholder="UnderTree"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    required
                />
                <label htmlFor="country">Address</label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    className="form-control"
                    placeholder="Palm Beach Street 23"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    required
                />
            </Col>
        </Row>
    )
}

export const ShippingForm = styled(ShippingFormBase)`
  
`;