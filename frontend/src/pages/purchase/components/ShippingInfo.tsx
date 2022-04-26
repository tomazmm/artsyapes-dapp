import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';


interface ShippingInfoProps {
    className?: string;
}

export const ShippingInfoBase = (props: ShippingInfoProps) => {
    const {
        className,
    } = props;


    return (
        <div className={className}>

        </div>
    )
}

export const ShippingInfo = styled(ShippingInfoBase)`
  
`;
