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

    // useEffect(() => {
    //
    // }, []);



    return (
        <div className={className}>
            <Row>
                <Col
                     xl={{span: 6}}
                     lg={{span: 6}}
                     md={{span: 12}}
                     xs={{span: 12}} className="d-flex flex-wrap col-image">
                    <img src={imageName} />
                    <span className="image-name">{nftInfo.extension.name}</span>
                </Col>
                <Col
                     xl={{span: 6}}
                     lg={{span: 6}}
                     md={{span: 12}}
                     xs={{span: 12}} className="d-flex flex-wrap flex-column align-items-center justify-content-between col-info">
                    <div className="d-flex justify-content-center flex-column">
                        <div className="title d-flex justify-content-center">
                            <span>Traits</span>
                        </div>
                        <div className="traits d-flex justify-content-center">
                            {nftInfo.extension.attributes.map((value: any, index: any) => {
                                return <div key={index}>
                                    <span className="value-title">{value.trait_type.charAt(0).toUpperCase() + value.trait_type.slice(1)}</span>
                                    { index < nftInfo.extension.attributes.length-1 ?
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
                    </div>
                    <Button className="btn btn-light">Order Physical Item</Button>
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
      div{
        padding: 0 1rem;
        .title{
          font-size: 1.3rem;
          padding-bottom: 1rem;
        }
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