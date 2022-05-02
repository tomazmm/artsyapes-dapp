import { useWallet, WalletStatus } from '@terra-dev/use-wallet'
import React from "react";
import styled from "styled-components";
import {Button} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faWallet} from "@fortawesome/free-solid-svg-icons";

interface ConnectWalletProps {
  className?: string;
}

export const ConnectWalletBase = (props: ConnectWalletProps) => {
  const {
    className,
  } = props

  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    wallets,
    disconnect,
  } = useWallet()


  const terraStationWallet = availableConnectTypes.find((value) => value === "CHROME_EXTENSION")
  const installTerraStationWalletExt = availableInstallTypes.find((value) => value === "CHROME_EXTENSION");

  switch (status) {
    case WalletStatus.INITIALIZING:
      return (
          <div className={className}>

          </div>
      );
    case WalletStatus.WALLET_NOT_CONNECTED:
      return (
            <div className={className}>
              {terraStationWallet !== undefined ?
                (
                  <Button variant="light"
                    key={`connect-${terraStationWallet}`}
                    onClick={() => connect(terraStationWallet)}
                    type="button"
                  >
                      <span className="button-text">Connect wallet</span>
                      <FontAwesomeIcon className="icon" icon={faWallet}  />
                  </Button>) :
                (
                  installTerraStationWalletExt !== undefined ? (
                    <Button variant="primary"
                            key={`install-${installTerraStationWalletExt}`}
                            onClick={() => install(installTerraStationWalletExt)}
                            type="button"
                    >
                      <span className="button-text ">Install</span>
                      <span className="button-text bold-text">Terra Station Wallet</span>
                    </Button>
                  ) : (
                    <div className="text-white">
                      Please use a web browser that is compatible with terra station extension.
                    </div>
                  )
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
