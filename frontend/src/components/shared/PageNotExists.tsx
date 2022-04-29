import React from "react";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faWarning} from "@fortawesome/free-solid-svg-icons";


interface PageNotExistsProps {
    className?: string;
}

export const PageNotExistsBase = (props: PageNotExistsProps) => {
    const {
        className
    } = props;


    return (
        <div className={className}>
            <FontAwesomeIcon className="icon" icon={faWarning}/>
            <span>Page does not exist</span>
        </div>
    )
}


export const PageNotExists = styled(PageNotExistsBase)`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  .icon {
    margin: 1rem;
    height: 3rem;
    color: rgb(236, 40, 40);
  }
`;




