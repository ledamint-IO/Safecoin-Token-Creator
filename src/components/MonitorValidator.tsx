import { FC, useCallback, useState } from 'react';
import { useConnection, useWallet } from '@j0nnyboi/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SAFE, PublicKey, TransactionSignature } from '@safecoin/web3.js';
import { notify } from "../utils/notifications";



export const MonitorValidator: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [voteAccount, setVoteAcc] = useState('')
  const [discord, setDiscord] = useState('')


  const onClick = useCallback(async (form) => {
		const { publicKey, sendTransaction } = useWallet();
		
		const creatorAddress = new PublicKey(
      "8347h8LeaVAUzyWES3Xj2Gd6QTpGrCayKBpuYvBW3PWD",
    );
	let signature: TransactionSignature = "";
        //form.voteAccount, 
        //form.discord,
		
		try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: creatorAddress,
          lamports: LAMPORTS_PER_SAFE * 50,
        }),
      );

      signature = await sendTransaction(transaction, connection);

      notify({
        type: "success",
        message: "Transaction successful!",
        txid: signature,
      });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [publicKey, sendTransaction, connection]);
	
  return (
    <div className="my-6">
      <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Validator Vote Account"
        onChange={(e) => setVoteAcc(e.target.value)}
      />
      <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Discord web hock"
        onChange={(e) => setDiscord(e.target.value)}
      />      
      
      <button
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={() => onClick({voteAccount: voteAccount, discord: discord})}>
          <span>Pay and Monitor</span>
      </button>
    </div>
  )
}
