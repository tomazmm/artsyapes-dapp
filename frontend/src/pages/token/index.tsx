import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {Container} from "react-bootstrap";
import GlobalContext from "../../components/shared/GlobalContext";
import {useNavigate} from "react-router-dom";
import {NftDescription} from "./components/NftDescription";

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

  const navigate = useNavigate();
  const navigateToMyProfile = () => navigate('/');

  useEffect( () => {
    // redirect if token_id (from 'pathname') not in user's wallet
    const token_id = window.location.pathname.replace( /^\D+/g, '');
    if (!globalContext.tokens?.includes(token_id)) {
      navigateToMyProfile();
    }
  }, [])

  useEffect( () => {
    const token_id = window.location.pathname.replace( /^\D+/g, '');
    const token_info = globalContext.tokensInfo.find((value : any) => {
      if( value.extension.name.split(" ")[1] === token_id){
        return value;
      }else
        return null;
    })
    if(token_info !== undefined){
      setNftInfo(token_info)
      const tempImageName = token_info.extension.image.split("//");
      setImageName("https://d1mx8bduarpf8s.cloudfront.net/" + tempImageName[1])
    }
  }, [globalContext.tokensInfo])


  return (
    <div className={className}>
      { nftInfo !== undefined ? (
        <Container fluid>
            <NftDescription nftInfo={nftInfo} imageName={imageName}></NftDescription>
        </Container>
      ) : (
          <>
          </>
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