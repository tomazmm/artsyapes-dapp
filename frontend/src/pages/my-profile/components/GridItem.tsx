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
  const id = nftValue.info.extension.name.split(" ")[1]

  const [imageName, setImageName] = useState<any>("")
  const [show, setShow] = useState(false);
  const [showCardText, setShowCardText] = useState(false);

  useEffect(() => {
    const tempImageName = nftValue.info.extension.image.split("//");
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
          <span>{nftValue.info.extension.name}</span>
        ) : (<></>)
        }
      </div>
    </div>
  )
}

export const GridItem = styled(GridItemBase)`
  background: rgba(255,255,255, .9);
  border-radius: 0.4rem;
  transition: margin 0.1s ease-in-out; // Add the transition
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
  margin-top: 1px;
  &:hover {
    margin-top: -1px;
  }
  .grid-item-wrapper {
    cursor: pointer;
    img{
      border-radius: 0.4rem 0.4rem 0 0;
      max-width: 100%;
      max-height: 100%;
    }
    span{
      font-weight: bold;
      padding: .5em;
    }
  }
`;