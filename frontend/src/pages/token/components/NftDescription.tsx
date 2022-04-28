import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";
import {Button, Col, Row} from "react-bootstrap";

interface NftDescriptionProps {
    className?: string;
    nftInfo: any;
    imageName: any;
}

export const NftDescriptionBase = (props: NftDescriptionProps) => {
    const {
        className,
        nftInfo,
        imageName
    } = props;

    return (
        <div className={className}>
            <Row>
                <Col
                     xl={{span: 5}}
                     lg={{span: 5}}
                     md={{span: 12}}
                     xs={{span: 12}} className="col-image">
                    <div className="token-image">
                        <img src={imageName} />
                    </div>
                </Col>
                <Col
                     xl={{span: 7}}
                     lg={{span: 7}}
                     md={{span: 12}}
                     xs={{span: 12}} className="d-flex flex-wrap flex-column col-info">
                    <div className="token-header">
                        <h2 className="image-name">{nftInfo.extension.name}</h2>
                        <span>Owner since 12 Feb 1992</span>
                    </div>
                    <div className="token-physicals mt-4">
                        <div className="physicals">
                            <h4>Physicals</h4>
                            <div className="d-flex flew-row flex-wrap flex-start">
                                <div className="physical text-center">
                                    <h6 className="trait-type">Tier 3</h6>
                                    <h5 className="trait-value">0/3</h5>
                                </div>
                                <div className="physical text-center">
                                    <h6 className="trait-type">Tier 2</h6>
                                    <h5 className="trait-value">0/3</h5>
                                </div>
                                <div className="physical text-center">
                                    <h6 className="trait-type">Tier 1</h6>
                                    <h5 className="trait-value">0/3</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="token-traits">
                        <div className="traits">
                            <h4>Traits</h4>
                            <div className="d-flex flew-row flex-wrap flex-start">
                                {nftInfo.extension.attributes.map((value: any, index: any) => {
                                    return <div key={index} className="trait text-center">
                                        <h6 className="trait-type">{value.trait_type.charAt(0).toUpperCase() + value.trait_type.slice(1)}</h6>
                                        <h5 className="trait-value">{value.value}</h5>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                    <Button variant="light" className="btn-order mt-3">Order Physical Item</Button>
                </Col>
            </Row>
        </div>
    )
}

export const NftDescription = styled(NftDescriptionBase)`
  >.row{
    height: 100%;
    
    overflow-y: auto;
    overflow-x: hidden;

    ::-webkit-scrollbar {
      width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #888;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    
    margin: 0!important;
    .col-image{
      padding: 0 2rem 2rem 2rem;
      img{
        width: 100%;
        border-radius: 0.3rem;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      }
      .image-name{
        font-size: 1.3rem;
      }
    }
    .col-info{
      padding: 0 2rem 2rem 2rem;
      .token-header{
        background-color: rgba(255,255,255,1);
        border-radius: 0.3rem;
        padding: 0.5em;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
        h2{
          font-weight: 600;
        }
        span {
          font-size: .9em;
        }
      }
      .token-physicals {
        h4{
          font-size: 1.3em;
          font-weight: bold;
        }
        .physicals{
          background-color: rgba(255,255,255,1);
          border-radius: 0.3rem;
          padding: 0.5em;
          box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
          width: 100%;
          .physical{
            width: 28%;
            margin: .2rem;
            border: 1px solid rgba(92,92,92,.7);
            border-radius: 0.4rem;
            background: rgba(241, 229, 172, .2);
            padding: 0.5em;
            h5{
              font-size: 0.8em;
              margin: 0;
            }
            h6{
              text-transform: uppercase;
              font-weight: bold;
            }
          }
        }
      }
      .token-traits{
        h4{
          font-size: 1.3em;
          font-weight: bold;
        }
        .traits{
          background-color: rgba(255,255,255,1);
          border-radius: 0.3rem;
          padding: 0.5em;
          box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
          width: 100%;
          .trait{
            width: 28%;
            margin: .2rem;
            border: 1px solid rgba(92,92,92,.7);
            border-radius: 0.4rem;
            background: rgba(241, 229, 172, .2);
            padding: 0.5em;
            h5{
              font-size: 0.8em;
              margin: 0;
            }
            h6{
              text-transform: uppercase;
              font-weight: bold;
              margin-bottom: .3em;
            }
          }
          margin-bottom: 1rem;
        }
      }
    }
    .btn-order{
      font-weight: bold;
      font-size: 1.2em;
      &:hover {
        background-color: #555555;
        color: white;
      }
    }
  }

`;