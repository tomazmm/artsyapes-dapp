import { useWallet, WalletStatus } from '@terra-dev/use-wallet'
import React, {useEffect} from "react";

export const ConnectWallet = () => {
  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    wallets,
    disconnect,
  } = useWallet()

  // useEffect(() => {
  //
  // }, [])


  switch (status) {
    case WalletStatus.INITIALIZING:
      return (
          <div>
            Initializing Wallet
          </div>
      );
    case WalletStatus.WALLET_NOT_CONNECTED:
      return (
          <>
              {availableInstallTypes.map((connectType) => (
                  <button
                      key={`install-${connectType}`}
                      onClick={() => install(connectType)}
                      type="button"
                  >
                      Install {connectType}
                  </button>
              ))}
            {availableConnectTypes.map((connectType) => (
                <button
                    key={`connect-${connectType}`}
                    onClick={() => connect(connectType)}
                    type="button"
                >
                  Connect {connectType}
                </button>
            ))}
          </>
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
