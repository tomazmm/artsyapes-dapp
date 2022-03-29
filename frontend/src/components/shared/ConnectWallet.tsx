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
  // useEffect(() => {
  //
  // }, [])


  switch (status) {

    case WalletStatus.INITIALIZING:
      return (
          <div className={className}>
            Initializing Wallet
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
                    Connect wallet
                      <FontAwesomeIcon className="icon" icon={faWallet}  />
                  </Button>) :
                (
                  <div className="text-white">
                    Please install terra station wallet.
                  </div>
              )}
            </div>
      )
    case WalletStatus.WALLET_CONNECTED:
      return (
          <div>
            {wallets[0].terraAddress}
            <button
                onClick={() => disconnect()}
                type="button"
            >
              Disconnect
            </button>
          </div>
      )
  }
}

export const ConnectWallet = styled(ConnectWalletBase)`
    > .btn{
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        width: 11rem;
        white-space: nowrap;
        font-size: 1.1rem;
      .icon{
        margin: 0 5%;
        display: flex;
      }
    }
`;
