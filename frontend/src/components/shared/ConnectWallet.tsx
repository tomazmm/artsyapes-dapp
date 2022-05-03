import { useWallet, WalletStatus } from '@terra-dev/use-wallet'
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Button} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faWallet} from "@fortawesome/free-solid-svg-icons";
import {ConnectionOptionsModal} from "../../pages/home/components/ConnectionOptionsModal";
import { ConnectType } from '@terra-money/wallet-provider';

interface ConnectWalletProps {
  className?: string;
}

export const ConnectWalletBase = (props: ConnectWalletProps) => {
  const {
    className,
  } = props

  const [allConnectTypes, setAllConnectTypes] = useState<any>([])
  const [showModal, setShowModal] = useState<boolean>(false)

  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    wallets,
    disconnect,
  } = useWallet()

  useEffect(() => {
    const tempArrayOfConnectionTypes: any[] = [];

    for(const it of availableConnectTypes){
      let tempValueName: string;
      switch (it){
        case "CHROME_EXTENSION":
          tempValueName = "Terra Station Wallet"
          tempArrayOfConnectionTypes.push({
            type: it,
            valueName: tempValueName,
            func: connect,
            logo: "terra-station"
          })
          break;
        case "WALLETCONNECT":
          tempValueName = "Wallet Connect"
          tempArrayOfConnectionTypes.push({
            type: it,
            valueName: tempValueName,
            func: connect,
            logo: "wallet-connect"
          })
          break;
      }
    }

    for(const it of availableInstallTypes){
      let tempValueName: string;
      switch (it){
        case "CHROME_EXTENSION":
          tempValueName = "Install Terra Station Extension"
          tempArrayOfConnectionTypes.push({
            type: it,
            valueName: tempValueName,
            func: install,
            logo: "terra-station"
          })
          break;
      }
    }

    setAllConnectTypes(tempArrayOfConnectionTypes);
  }, [availableConnectTypes]);

  const toggleModal = () => setShowModal(!showModal);

  switch (status) {
    case WalletStatus.INITIALIZING:
      return (
          <div className={className}>

          </div>
      );
    case WalletStatus.WALLET_NOT_CONNECTED:
      return (
            <div className={className}>
              {allConnectTypes.length > 0 ?
                (
                  <>
                    <Button variant="light" type="button" onClick={toggleModal}>
                      <span className="button-text">Connect wallet</span>
                      <FontAwesomeIcon className="icon" icon={faWallet}  />
                    </Button>

                    <ConnectionOptionsModal show={showModal} setShow={setShowModal} availableConnectTypes={allConnectTypes}></ConnectionOptionsModal>
                  </>
                ):
                (
                  <div className="text-white">
                    Please use a web browser that is compatible with terra station extension.
                  </div>
              )}
            </div>
      )
    case WalletStatus.WALLET_CONNECTED:
      return (
          <div className={className}>
            {/*{wallets[0].terraAddress}*/}
            <Button variant="light" className="wallet"
                onClick={() => disconnect()}
                type="button"
            >
              <span className="button-text">{wallets[0].terraAddress}</span>
              <FontAwesomeIcon className="icon" icon={faWallet}  />
            </Button>
          </div>
      )
  }
}

export const ConnectWallet = styled(ConnectWalletBase)`
    > .btn{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: auto;
        max-width: 100%;
        font-size: 0.9rem;
      &.wallet {
        width: 13rem;
      }
      
        .icon{
          display: flex;
        }
        .button-text{
          margin-right: 0.5rem!important;
          width: auto!important;
          justify-content: center !important;
          overflow:hidden;
          text-overflow: ellipsis;
        }
        .bold-text{
          font-weight: 700;
          margin: 0 !important;
        }
    }
`;
