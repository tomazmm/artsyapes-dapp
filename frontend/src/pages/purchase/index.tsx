import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Col, Container, Row} from "react-bootstrap";
import GlobalContext from "../../components/shared/GlobalContext";
import {useNavigate} from "react-router-dom";
import {CollectionMenu} from "../my-profile/components/CollectionMenu";
import {Grid} from "../my-profile/components/Grid";

interface PurchaseProps {
    className?: string;
}

export const PurchaseBase = (props: PurchaseProps) => {
    const {
        className,
    } = props;

    const globalContext = useContext(GlobalContext);

    const navigate = useNavigate();
    const navigateToMyProfile = () => navigate('/');

    useEffect( () => {
        // redirect if token_id (from 'pathname') not in user's wallet
        const token_id = window.location.pathname.replace( /^\D+/g, '').split("/")[0];
        if (!globalContext.tokens?.includes(token_id)) {
            navigateToMyProfile();
        }
    }, [])

    console.log(globalContext)

    return (
        <div className={className}>
            <Container fluid className="h-100 mt-5">
                <Row className="h-100 mb-4">
                    <Col xl={{span: 3}}
                         lg={{span: 12}}
                         xs={{span: 12}}
                         className="d-flex flex-column justify-content-center align-self-start align-items-center col my-purchase">
                        <span className="purchase-text">My Purchase</span>
                        <div className="white-line"></div>

                    </Col>
                    <Col xl={{span: 9}}
                         lg={{span: 12}}
                         xs={{span: 12}}
                         className="d-flex flex-column col my-shipping-info ">
                        <span className="shipping-text d-flex justify-content-end">Shipping Information</span>
                        <div className="white-line "></div>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export const Purchase = styled(PurchaseBase)`
  > .container-fluid{
    width: 95%;
    .row{
      .col{
        &.my-purchase{
          margin-top: 0.95rem;
        }
        
        .purchase-text{
          color: white;
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .shipping-text{
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .white-line{
          border-bottom: 2px groove rgba(194, 194, 194, .8);
          width: 100%;
          margin-bottom: 2rem;
          &.nfts{
            margin-top: 3.07rem;
          }
        }
      }
    }
  }
`;
