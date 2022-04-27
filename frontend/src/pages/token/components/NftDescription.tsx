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
                    <div className="token-traits mt-4">
                        <h4>Traits</h4>
                        <div className="traits d-flex justify-content-center">
                            {nftInfo.extension.attributes.map((value: any, index: any) => {
                                return <div key={index} className="d-flex flew-row justify-content-between">
                                    <span className="trait-type">{value.trait_type.charAt(0).toUpperCase() + value.trait_type.slice(1)}</span>
                                    <span className="trait-value">{value.value}</span>
                                </div>
                            })}
                        </div>
                    </div>
                    <Button className="btn btn-light mt-3">Order Physical Item</Button>
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
        //margin-bottom: 1rem;
      }
      .image-name{
        font-size: 1.3rem;
      }
    }
    .col-info{
      padding: 0 2rem 2rem 2rem;
      .token-header{
        span {
          font-size: .9em;
        }
      }
      .token-traits{
        .traits{
          display: flex;
          flex-wrap: wrap;
          width: 100%;
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
`;