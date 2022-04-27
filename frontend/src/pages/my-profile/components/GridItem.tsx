import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";

interface GridItemProps {
  className?: string;
  nftValue?: any;
}

export const GridItemBase = (props: GridItemProps) => {
  const {
    className,
    nftValue
  } = props;

  const navigate = useNavigate();
  const id = nftValue.extension.name.split(" ")[1]

  const [imageName, setImageName] = useState<any>("")
  const [show, setShow] = useState(false);
  const [showCardText, setShowCardText] = useState(false);

  useEffect(() => {
    const tempImageName = nftValue.extension.image.split("//");
    setImageName("https://d1mx8bduarpf8s.cloudfront.net/" + tempImageName[1]);
  }, []);

  const navigateToToken = () => navigate("/token/" + id)

  const toggleModal = () => setShow(!show);

  const onLoadShowText = () => setShowCardText(true);

  return (
    <div className={className}>
      {/*Card View*/}
      <div className="grid-item-wrapper d-flex flex-column" onClick={navigateToToken}>
        <img src={imageName} onLoad={onLoadShowText} />
        {showCardText ? (
          <span>{nftValue.extension.name}</span>
        ) : (<></>)
        }
      </div>

      {/*<GridItemModal nftValue={nftValue} imageName={imageName} show={show} setShow={toggleModal}/>*/}
    </div>
  )
}

export const GridItem = styled(GridItemBase)`
  background: rgb(0,0,0);
  background: linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(71,71,71,.5) 40%, rgba(92,92,92,.5) 100%);
  border: 0.1rem solid rgba(92,92,92,.7);
  border-radius: 0.4rem;
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