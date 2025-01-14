import { FC } from "react";
import dynamic from "next/dynamic";
import { useNetworkConfiguration } from "../contexts/NetworkConfigurationProvider";
import { WalletAdapterNetwork, WalletError } from "@j0nnyboi/wallet-adapter-base";

const NetworkSwitcher: FC = () => {
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();
  const network = WalletAdapterNetwork[networkConfiguration];
  console.log(networkConfiguration);


  return (
    <label className="label cursor-pointer">
      <a>Network</a>
      <select
        value={networkConfiguration}
        onChange={(e) => setNetworkConfiguration(e.target.value)}
        className="select max-w-xs bg-green-300 "
      >
        <option value="mainnet-beta">mainnet</option>
        <option value="testnet">testnet</option>
      </select>
    </label>
  );
};

export default dynamic(() => Promise.resolve(NetworkSwitcher), {
  ssr: false,
});
