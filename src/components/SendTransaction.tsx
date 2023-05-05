import { useConnection, useWallet } from "@j0nnyboi/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SAFE,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@safecoin/web3.js";
import { FC, useCallback, useState } from "react";
import { notify } from "../utils/notifications";
import { ClipLoader } from "react-spinners";

export const SendTransaction: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("0.0");

  const solInputValidation = async (e) => {
    const monstrosity = /((^\.(\d+)?$)|(^\d+(\.\d*)?$)|(^$))/;
    const res = new RegExp(monstrosity).exec(e.target.value);
    res && setAmount(e.target.value);
  };

  const onClick = useCallback(async () => {
    if (!publicKey) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    const creatorAddress = new PublicKey(
      "JoNVxV8vwBdHqLJ2FT4meLupYKUVVDYr1Pm4DJUp8cZ",
    );
    let signature: TransactionSignature = "";

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: creatorAddress,
          lamports: LAMPORTS_PER_SAFE * Number(amount),
        }),
      );

      signature = await sendTransaction(transaction, connection);
      setIsLoading(true);
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });
      setIsLoading(false);
      notify({
        type: "success",
        message: "Transaction successful! Thankyou for your support",
        txid: signature,
      });
    } catch (error: any) {
      setIsLoading(false);
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [publicKey, amount, sendTransaction, connection]);

  return (
    <div>
      {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}
    <div className="mt-4">
      <div className="p-2">
        <div className="text-xl font-normal">Send some SAFE to the creator</div>
      </div>
      <div className="p-2">
        <input
          className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none"
          value={amount}
          maxLength={20}
          onChange={(e) => solInputValidation(e)}
        />
      </div>
      <button
        className="... group btn m-2 w-60 animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#51DF5F] hover:from-pink-500 hover:to-yellow-500 disabled:animate-none "
        onClick={onClick}
        disabled={!publicKey}
      >
        <div className="hidden group-disabled:block ">Wallet not connected</div>
        <span className="block group-disabled:hidden">Send Transaction</span>
      </button>
    </div>
    </div>
  );
};
