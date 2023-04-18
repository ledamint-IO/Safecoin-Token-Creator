import { FC, useCallback, useState } from 'react';
import { useConnection, useWallet } from '@j0nnyboi/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SAFE, PublicKey, TransactionSignature } from '@safecoin/web3.js';
import { notify } from "../utils/notifications";


const ARWEAVE_UPLOAD_ENDPOINT ="https://validatorMonitor.ledamint.io"
interface IArweaveResult {
  error?: string;
  messages?: Array<{
    transactionId: string;
    Discord: string;
    Vote: string;
  }>;
}
const uploadToArweave = async (data: FormData): Promise<IArweaveResult> => {
  const resp = await fetch(ARWEAVE_UPLOAD_ENDPOINT, {
    method: 'POST',
    // @ts-ignore
    body: data,
  });

  if (!resp.ok) {
    return Promise.reject(
      new Error(
        'Unable to upload Data to monitor server. Please contact j0nnyboi with TXID.',
      ),
    );
  }

  const result: IArweaveResult = await resp.json();

  if (result.error) {
    return Promise.reject(new Error(result.error));
  }

  return result;
};




 


export const MonitorValidator: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [voteAccount, setVoteAcc] = useState('')
  const [discord, setDiscord] = useState('')


  const onClick = useCallback(async (form) => {
		const { publicKey, sendTransaction } = useWallet();
		
		const creatorAddress = new PublicKey(
      "JoNVxV8vwBdHqLJ2FT4meLupYKUVVDYr1Pm4DJUp8cZ",
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
		
		const data = new FormData();
		data.append('transaction', txid);
		data.append('Vote', form.voteAccount);
		data.append('Discord', form.discord);

		const result: IArweaveResult = await uploadToArweave(data);
  
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
