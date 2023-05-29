import { useConnection, useWallet } from "@j0nnyboi/wallet-adapter-react";
import { LAMPORTS_PER_SAFE, TransactionSignature } from "@safecoin/web3.js";
import { FC, useCallback, useState} from "react";
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";
import { useNetworkConfiguration } from "../contexts/NetworkConfigurationProvider";

import { ClipLoader } from "react-spinners";

export const RequestAirdrop: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const [isLoading, setIsLoading] = useState(false);
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();

  const onClick = useCallback(async () => {
    if (!publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }
    setIsLoading(true);
    let signature: TransactionSignature = "";
    console.log(connection.rpcEndpoint);
    try {
      signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SAFE * 10);

      const latestBlockHash = await connection.getLatestBlockhash();
		    await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        });

      setIsLoading(false);
      notify({
        type: "success",
        message: "Airdrop successful!",
        txid: signature,
      });


      getUserSOLBalance(publicKey, connection);
    } catch (error: any) {
      setIsLoading(false);
      notify({
        type: "error",
        message: `Airdrop failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Airdrop failed! ${error?.message}`, signature);
    }
  }, [publicKey, connection, getUserSOLBalance]);

  return (
    <div>
     {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}
    <div className="mt-4">
      
      <div className="p-2">
        <div className="text-xl font-normal">Request airdrop</div>
      </div>
      <button
        className="... group btn m-2 w-60 animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#51DF5F] hover:from-pink-500 hover:to-yellow-500 disabled:animate-none "
        onClick={onClick}
        disabled={!publicKey}
      >
        <div className="hidden group-disabled:block">Wallet not connected</div>
        <span className="block group-disabled:hidden">Airdrop 10 Safe</span>
      </button>
      
    </div>
     
    </div>
  );
};
