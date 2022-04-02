import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Col, Modal, Button } from "react-bootstrap";

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

  useEffect(() => {
    const tempImageName = nftValue.extension.image.split("//");
    setImageName("https://ipfs.io/ipfs/" + tempImageName[1]);
  }, []);

  const toggleModal = (e: any) => {
    setShow(!show);
  }

  return (
    <div className={className} onClick={toggleModal}>
      <div className="grid-item-wrapper d-flex flex-column">
        <img src={imageName} />
        <span>{nftValue.extension.name}</span>
      </div>

      <Modal show={show} size="lg">
        <Modal.Header closeButton>
          <Modal.Title># {nftValue.extension.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body-inner d-flex flex-row">

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
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
  
  .modal-content{
    img{
      display: none;
    }
  }
`;