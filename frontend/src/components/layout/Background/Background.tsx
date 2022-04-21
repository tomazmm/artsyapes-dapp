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
        <div className={className}></div>
    )
}


export const Background = styled(BackgroundBase)`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
  
  background: url("/assets/my-account-background.png");
  background-size: cover;
`;