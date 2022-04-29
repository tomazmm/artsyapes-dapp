import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Container} from "react-bootstrap";
import GlobalContext from "../../components/shared/GlobalContext";
import {useNavigate} from "react-router-dom";
import {NftDescription} from "./components/NftDescription";
import {LoadingCircle} from "./components/LoadingCircle";
import * as query from "../../contract/query";
import {PageNotExists} from "../../components/shared/PageNotExists";


type Nullable<T> = T | null | undefined;

interface TokenProps {
  className?: string;
}

export const TokenBase = (props: TokenProps) => {
  const {
    className,
  } = props;

  const globalContext = useContext(GlobalContext);

  const [nftInfo, setNftInfo] = useState<any>(undefined);
  const [imageName, setImageName] = useState<any>("")
  const [tokenId, setTokenId] = useState<Nullable<string>>(null);
  const [isOrderable, setIsOrderable] = useState(false);
  const [notValidId, setNotValidId] = useState(false);

  const navigate = useNavigate();
  const navigateToMyProfile = () => navigate('/');

  useEffect( () => {
    // catch token id
    const fetchInfo = async () :Promise<any> => {
      if(globalContext.tokens !== undefined && tokenId === null){
        const token_id = window.location.pathname.replace( /^\D+/g, '');
        if(!/^\d+$/.test(token_id) || parseInt(token_id) <= 0 || parseInt(token_id) >= 3778){
          await setNotValidId(true);
        }

        const token = globalContext.tokens.find((value : any) => {
          if( value === token_id){
            return value
          }
        })
        await setTokenId(token)
      }
    }
    fetchInfo()

  }, [globalContext.tokens])

  useEffect( () => {
    // get and set token information
    if(nftInfo === undefined && tokenId !== null && !notValidId){
      if(tokenId !== undefined){
        const token_info = globalContext.tokensInfo.find((value : any) => {
          if( value.info.extension.name.split(" ")[1] === tokenId){
            return value
          }
        })
        if(token_info !== undefined){
          getTokenInfo(token_info)
        }

      } else{
        fetchTokenInfo()
      }
    }
  }, [globalContext.tokensInfo, tokenId])


  const getTokenInfo = (token_info: any) => {
    setNftInfo(token_info)
    setIsOrderable(true);
    const tempImageName = token_info.info.extension.image.split("//");
    setImageName("https://d1mx8bduarpf8s.cloudfront.net/" + tempImageName[1])
  }

  const fetchTokenInfo = async () :Promise<any> => {
    if (globalContext.connectedWallet) {
      const token_id = window.location.pathname.replace( /^\D+/g, '');
      const token = await query.nftInfo(globalContext.connectedWallet, token_id)
      setNftInfo(token)
      const tempImageName = token.info.extension.image.split("//");
      setImageName("https://d1mx8bduarpf8s.cloudfront.net/" + tempImageName[1])
    }
  }

  return (
    <div className={className}>
      { nftInfo !== undefined ? (
        <Container fluid>
            <NftDescription nftInfo={nftInfo} enableOrder={isOrderable} imageName={imageName}></NftDescription>
        </Container>
      ) : (
          (notValidId) ?
              <PageNotExists/>
            :
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
