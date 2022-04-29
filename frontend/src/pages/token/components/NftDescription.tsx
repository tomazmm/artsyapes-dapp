import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";
import {Button, Col, Row} from "react-bootstrap";

interface NftDescriptionProps {
    className?: string;
    nftInfo: any;
    imageName: any;
    enableOrder: boolean;
}

export const NftDescriptionBase = (props: NftDescriptionProps) => {
    const {
        className,
        nftInfo,
        imageName,
        enableOrder
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
                        <h2 className="image-name">{nftInfo.info.extension.name}</h2>
                        <span>Owned by </span>
                        <span className="id">{nftInfo.access.owner}</span>
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
                    <div className="token-traits mt-4">
                        <div className="traits">
                            <h4>Traits</h4>
                            <div className="d-flex flew-row flex-wrap flex-start">
                                {nftInfo.info.extension.attributes.map((value: any, index: any) => {
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
        box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
        h2{
          font-size: 2.7em;
          font-weight: 600;
        }
        span {
          font-size: .9em;
          font-weight: 600;
          color: grey;
          &.id{
            font-weight: bold;
            color: rgba(218,165,32, 1);
          }
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
          box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
          width: 100%;
          .physical{
            flex-grow: 1;
            margin: .2rem;
            border: 1px solid rgba(218,165,32, .4);
            border-radius: 0.4rem;
            background: rgba(241, 229, 172, .2);
            padding: 0.5em;
            h5{
              font-size: 1.1em;
              margin: 0;
            }
            h6{
              color: rgba(218,165,32, 1);
              font-size: 0.7em;
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
          box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
          width: 100%;
          .trait{
            flex-grow: 1;
            flex-basis: 30%;
            margin: .2rem;
            border: 1px solid rgba(218,165,32, .4);
            background: rgba(241, 229, 172, .2);
            border-radius: 0.4rem;
            padding: 0.5em;
            h5{
              font-size: 1.1em;
              margin: 0;
            }
            h6{
              color: rgba(218,165,32, 1);
              font-size: 0.7em;
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