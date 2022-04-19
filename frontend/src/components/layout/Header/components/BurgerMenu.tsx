import React from "react";
import styled from 'styled-components';
import {Col, Container, Modal, Row,} from "react-bootstrap";
import {CollectionMenu} from "../../../../pages/my-profile/components/CollectionMenu";
import {ConnectWallet} from "../../../shared/ConnectWallet";
import {useLocation, useNavigate} from "react-router-dom";


interface BurgerMenuProps {
  className?: string;
  show?: boolean;
}

export const BurgerMenuBase = (props: BurgerMenuProps) => {
  const {
    className,
    show
  } = props;

  const navigate = useNavigate();
  const navigateMyProfile = () => navigate('/my-profile');

  const location = useLocation();

  return (
    <div className={className}>
      <Container fluid className="h-100">
        <Row className="h-auto about my-4">
          <Col xs={{span: 12}} className="col navbar-burger">
            <span onClick={navigateMyProfile} className="my-profile">My profile</span>
            <ConnectWallet />
          </Col>
        </Row>
        { location.pathname === "/my-profile"
          ?
            <Row className="h-auto about my-4">
              <Col
                  xs={{span: 12}}
                  className="d-flex flex-column justify-content-center align-self-start align-items-center col my-collection">
                <div className="white-line"></div>
                <CollectionMenu/>
              </Col>
            </Row>
          :
            <></>
        }

      </Container>
    </div>
  )
}


export const BurgerMenu = styled(BurgerMenuBase)`
  @media screen and (min-width: 768px) {
    display: none;
  }

  @media screen and (max-width: 767px) {
    display: flex;
  }

  position: fixed;
  height: auto;
  background-color: rgba(0,0,0,1);
  z-index: 1000;
  width: 100%;
  padding: 1rem;
  margin-top: 6rem;
  .container-fluid{
    .row{
      .col{
        &.navbar-burger{
          display: flex;
          justify-content: end;
          .my-profile{
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 1rem;
            color: white;
            cursor: pointer;
          }
        }
      }
    }
  }
`;