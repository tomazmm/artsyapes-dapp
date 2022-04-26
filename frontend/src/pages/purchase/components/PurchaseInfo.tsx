import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';


interface PurchaseInfoProps {
    className?: string;
}

export const PurchaseInfoBase = (props: PurchaseInfoProps) => {
    const {
        className,
    } = props;


    return (
        <div className={className}>

        </div>
    )
}

export const PurchaseInfo = styled(PurchaseInfoBase)`
  
`;
