import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Container} from "react-bootstrap";
import GlobalContext from "../../components/shared/GlobalContext";
import {useNavigate} from "react-router-dom";
import {NftDescription} from "./components/NftDescription";
import {LoadingCircle} from "./components/LoadingCircle";
import * as query from "../../contract/query";


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
    const fetchInfo = async () :Promise<any> => {
      if(globalContext.tokens !== undefined && tokenId === null){
        const token_id = window.location.pathname.replace( /^\D+/g, '');
        if(!/^\d+$/.test(token_id) || parseInt(token_id) <= 0 || parseInt(token_id) >= 3778){
          navigate('/404')
        }

        const token = globalContext.tokens.find((value : string) => value === token_id);
        setTokenId(token);
      }
    }
    fetchInfo()
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

  return (
    <div className={className}>
      { nftInfo !== undefined ? (
        <Container fluid>
            <NftDescription nftInfo={nftInfo} imageName={imageName}/>
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
    }
`;
