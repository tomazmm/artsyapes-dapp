import React, {useContext, useEffect, useState} from "react";
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";
import {Button, Col, Row} from "react-bootstrap";
import GlobalContext from "../../../components/shared/GlobalContext";

interface PanelGridProps {
    className?: string;
    title: any;
    items: any;
}

export const PanelGridBase = (props: PanelGridProps) => {
    const {
        className,
        title,
        items,
    } = props;

    return (
        <div className={`${className}`}>
            <div className="panel-grid">
                <h4>{title}</h4>
                <div className="d-flex flew-row flex-wrap flex-start grid">
                    {items.map((item: Record<string, string>, index: number) => {
                        return <div key={index} className="panel-grid-item text-center">
                            <h6 className="item-type">{item.title}</h6>
                            <h5 className="item-value">{item.value}</h5>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export const PanelGrid = styled(PanelGridBase)`
  >.panel-grid{
    border-radius: 0.3rem;
    background-color: rgba(255,255,255,1);
    padding: 0.5em;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
    width: 100%;
    h4{
      font-size: 1.3em;
      font-weight: bold;
    }
    .grid{
      .panel-grid-item{
        flex-grow: 1;
        flex-basis: 26%;
        margin: .2rem;
        border: 1px solid rgba(218,165,32, .4);
        border-radius: 0.4rem;
        background: rgba(241, 229, 172, .2);
        padding: 0.5em;
        h5{
          font-size: 1.1em;
          margin: 0;
        }
        h6{
          color: rgba(218,165,32, 1);
          font-size: 0.7em;
          text-transform: uppercase;
          font-weight: bold;
        }
      }
    }
    }
`;