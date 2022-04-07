import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {GridItemModal} from "./GridItemModal";

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
    setImageName("https://d1mx8bduarpf8s.cloudfront.net/" + tempImageName[1]);
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

      <GridItemModal nftValue={nftValue} imageName={imageName} show={show} setShow={toggleModal}/>
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