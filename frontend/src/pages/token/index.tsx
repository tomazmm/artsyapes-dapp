import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Button, Col, Container, Row} from "react-bootstrap";
import GlobalContext from "../../components/shared/GlobalContext";
import {useNavigate} from "react-router-dom";
import {LoadingCircle} from "./components/LoadingCircle";
import * as query from "../../contract/query";
import {PanelGrid} from "./components/PanelGrid";


type Nullable<T> = T | null | undefined;

interface TokenProps {
  className?: string;
}

export const TokenBase = (props: TokenProps) => {
  const {
    className,
  } = props;

  const globalContext = useContext(GlobalContext);
  const navigate = useNavigate();

  const [tokenId, setTokenId] = useState<Nullable<string>>(null);
  const [nftInfo, setNftInfo] = useState<any>(undefined);
  const [imageName, setImageName] = useState<any>("")

  useEffect( () => {
    const tryReadToken = async () :Promise<any> => {
      if(globalContext.tokens !== undefined && tokenId === null){
        const token_id = window.location.pathname.replace( /^\D+/g, '');
        if(!/^\d+$/.test(token_id) || parseInt(token_id) <= 0 || parseInt(token_id) >= 3778){
          navigate('/404')
        }

        const token = globalContext.tokens.find((value : string) => value === token_id);
        setTokenId(token);
      }
    }
    tryReadToken()
  }, [globalContext.tokens])

  useEffect( () => {
    if(nftInfo === undefined && tokenId !== null ){
      if(tokenId !== undefined){
        const token_info = globalContext
            .tokensInfo
            .find((value : any) => value.info.extension.name.split(" ")[1] === tokenId);
        if(token_info){
          setNftInfo(token_info);
          setImageName("https://d1mx8bduarpf8s.cloudfront.net/" + token_info.info.extension.image.split("//")[1]);
        }
      } else{
        fetchTokenInfo();
      }
    }
  }, [globalContext.tokensInfo, tokenId])

  const fetchTokenInfo = async () :Promise<any> => {
      const token_id = window.location.pathname.replace( /^\D+/g, '');
      const token = await query.nftInfo(globalContext.connectedWallet!, token_id)
      setNftInfo(token)
      const tempImageName = token.info.extension.image.split("//");
      setImageName("https://d1mx8bduarpf8s.cloudfront.net/" + tempImageName[1])
  }

  const physical_info = [
    {
      title: "Tier 3",
      value: "0/3"
    },
    {
      title: "Tier 2",
      value: "0/3"
    },
    {
      title: "Tier 1",
      value: "0/3"
    }
  ]


  const isOwner = () =>  {
    return globalContext.connectedWallet?.walletAddress == nftInfo.access.owner;
  }

  const traits = () => {
    return nftInfo.info.extension.attributes.map((item: Record<string, string | null>) => {
      return {
        title: item.trait_type,
        value: item.value
      }
    });
  }

  return (
    <div className={className}>
      { nftInfo !== undefined ? (
        <Container fluid>
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
                  <span >Owned by <a href={`https://terrasco.pe/mainnet/address/${nftInfo.access.owner}`} target="_blank" rel="noreferrer noopener">{nftInfo.access.owner}</a></span>
                </div>
                <PanelGrid className="mt-4" title={"Physicals"} items={physical_info}/>
                <PanelGrid className="mt-4" title={"Traits"} items={traits()}/>
                <Button
                    variant="light"
                    className={`btn-order mt-3 ${!isOwner() ? "disabled" : ""}`}>Order Physical Item</Button>
              </Col>
            </Row>
        </Container>
      ) : (
        <LoadingCircle/>
      )
      }
    </div>
  )
}

export const Token = styled(TokenBase)`
  display: flex;
  margin-top: 2.5em;
  height: 90%;
    > .container-fluid{
      padding: 0;
      width: 90rem;
      max-width: 100%;
      max-height: 100%;
      display: flex;
      justify-content: center;
      .row{
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
              font-weight: 700;
            }
            span {
              font-size: .9em;
              font-weight: 700;
              color: grey;
              &.id{
                font-weight: bold;
                color: rgba(218,165,32, 1);
              }
            }
          }
        }
        .btn-order{
          font-weight: bold;
          font-size: 1.2em;
          background-color: rgba(218,165,32, .9);
          color: white;
          &.disabled {
            pointer-events: unset;
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
