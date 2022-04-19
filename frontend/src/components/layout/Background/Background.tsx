import React, {useState} from "react";
import styled from 'styled-components';

interface BackgroundProps {
    className?: string;
}

export const BackgroundBase = (props: BackgroundProps) => {
    const {
        className
    } = props;


    return (
        <div className={className}>

        </div>
    )
}


export const Background = styled(BackgroundBase)`
  z-index: 0;
  background: url("/assets/my-account-background.png");
  height: 100vh;
  background-size: cover;
  padding: 6rem 4rem;
      
`;