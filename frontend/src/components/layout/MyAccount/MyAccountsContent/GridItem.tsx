import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Row, Col, Modal, Button } from "react-bootstrap";

interface GridItemProps {
  className?: string;
  nftValue?: any;
}

export const GridItemBase = (props: GridItemProps) => {
  const {
    className,
    nftValue
  } = props;


  const [imageName, setImageName] = useState<any>("")
  const [show, setShow] = useState(false);
  const [showCardText, setShowCardText] = useState(false);

  useEffect(() => {
    const tempImageName = nftValue.extension.image.split("//");
    setImageName("https://ipfs.io/ipfs/" + tempImageName[1]);
  }, []);

  const toggleModal = () => setShow(!show);

  const onLoadShowText = () => setShowCardText(true);

  return (
    <div className={className}>
      {/*Card View*/}
      <div className="grid-item-wrapper d-flex flex-column" onClick={toggleModal}>
        <img src={imageName} onLoad={onLoadShowText} />
        {showCardText ? (
          <span>{nftValue.extension.name}</span>
        ) : (<></>)
        }
      </div>

      {/*Detailed Modal View*/}
      <Modal show={show} onHide={toggleModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title># {nftValue.extension.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="nft-details">
          <Row>
            <Col xs={6}>
              <img src={imageName} style={{width: "100%"}}/>
            </Col>
            <Col xs={6} className="d-flex flex-column justify-content-between">
              {JSON.stringify(nftValue.extension.attributes)}
              <Button onClick={() => {console.log(123)}}>
                Order physical Item
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  )
}

export const GridItem = styled(GridItemBase)`
  background-color: rgba(33, 30, 26, 0.7);
  .grid-item-wrapper {
    cursor: pointer;
    img{
      max-width: 100%;
      max-height: 100%;
      padding: 1rem;
    }
    span{
      color: white;
      padding-bottom: 2rem ;
      padding-left: 1rem;
    }
  }
`;