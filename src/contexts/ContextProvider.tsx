import { WalletAdapterNetwork, WalletError } from "@j0nnyboi/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@j0nnyboi/wallet-adapter-react";
import { WalletModalProvider as ReactUIWalletModalProvider } from "@j0nnyboi/wallet-adapter-react-ui";
import {
  //PhantomWalletAdapter,
  //SolflareWalletAdapter,
  //SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  //TorusWalletAdapter,
   LedgerWalletAdapter,
  // SlopeWalletAdapter,
} from "@j0nnyboi/wallet-adapter-wallets";
import { Cluster, clusterApiUrl } from "@safecoin/web3.js";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { notify } from "../utils/notifications";
import {
  NetworkConfigurationProvider,
  useNetworkConfiguration,
} from "./NetworkConfigurationProvider";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  console.log(network);

  const wallets = useMemo(
    () => [
      //new PhantomWalletAdapter(),
      //new SolflareWalletAdapter(),
      new SolletWalletAdapter({ network }),
      //new SolletExtensionWalletAdapter({ network }),
      //new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      // new SlopeWalletAdapter(),
    ],
    [network],
  );

  const onError = useCallback((error: WalletError) => {
    notify({
      type: "error",
      message: error.message ? `${error.name}: ${error.message}` : error.name,
    });
    console.error(error);
  }, []);

  return (
    // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={autoConnect}
      >
        <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <NetworkConfigurationProvider>
        <AutoConnectProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigurationProvider>
    </>
  );
};
