import { FC, useCallback, useState } from 'react';
import { useConnection, useWallet } from '@j0nnyboi/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SAFE, PublicKey, TransactionSignature } from '@safecoin/web3.js';
import { notify } from "../utils/notifications";
import { ClipLoader } from "react-spinners";

//const VALIDATOR_UPLOAD_ENDPOINT ="https://validatorMonitor.ledamint.io";
const VALIDATOR_UPLOAD_ENDPOINT ="http://127.0.0.1:8080";
const allDataENDPOIN = (VALIDATOR_UPLOAD_ENDPOINT + "/AllValData/");

import {
  useNetworkConfiguration,
} from "../contexts/NetworkConfigurationProvider";


interface IValidatorResult {
  error?: string;
  messages?: Array<{
    transactionId: string;
    Discord: string;
    Email:string;
    Vote: string;
	Chain: string;
  }>;
}
const uploadToValidator = async (data: FormData): Promise<IValidatorResult> => {
  const resp = await fetch(VALIDATOR_UPLOAD_ENDPOINT, {
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

  const result: IValidatorResult = await resp.json();

  if (result.error) {
    return Promise.reject(new Error(result.error));
  }

  return result;
};

export async function ValData(
  request: RequestInfo
): Promise<any> {
  const response = await fetch(request);
  const body = await response.json();
  return body;
}




export const MonitorValidator: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [voteAccount, setVoteAcc] = useState('')
  const [discord, setDiscord] = useState('')
  const [email, setEmail] = useState('empty')
  const [isLoading, setIsLoading] = useState(false);
 const { networkConfiguration } = useNetworkConfiguration();
 //console.log('Networt ' + networkConfiguration);

  const onClick = useCallback(async (form) => {

	  if(form.voteAccount == ""){
			console.log("no Vote Account");
			notify({
        type: "error",
        message: "No Vote Account",
		});
		return
		}

	    if(form.discord == ""){
			console.log("not discord hook");
			notify({
        type: "error",
        message: "No Discord Webhook",
		});
		return
  }

		//document.location.href = '/upload';
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
          lamports: LAMPORTS_PER_SAFE * 1 ,
        }),
      );
		setIsLoading(true);
      signature = await sendTransaction(transaction, connection);
	  try {
		await connection.confirmTransaction(signature, 'max');

	  setIsLoading(false);
      notify({
        type: "success",
        message: "Transaction successful!",
        txid: signature,
		});

		const data = new FormData();
		data.append('transaction', signature);
		data.append('Vote', form.voteAccount);
		data.append('Discord', form.discord);
    data.append('email', form.email);
		data.append('Chain', networkConfiguration);
		data.append('publicKey', publicKey.toString());

		const result: IValidatorResult = await uploadToValidator(data);
		notify({
        type: "success",
        message: `Added to Monitoring server`,
        description: String(result),
      });

		 //window.location.replace('/');
	} catch {
		setIsLoading(false);
			notify({
        type: "Error",
        message: "Transaction unsuccessful!",
        txid: signature,
		});
		}


    } catch (error: any) {
		setIsLoading(false);
		//setIsHidden(true);
      notify({
        type: "error",
        message: `Transaction failed! Please try again`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [publicKey, sendTransaction, connection]);

  async function getData() {
    
	  const data = await ValData(allDataENDPOIN);

	  let valiID;
		for(var i = 0;i<data.length;i++) {
		    console.log(data[i]);
			valiID = valiID + data[i]  + " "
		allVal.value = valiID
		}
  }
  getData();

  return (
  <div  className="my-5">
   {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}
  <h3>
  <p>Costs 1 safe to add or update a validator to monitor</p>
  </h3>
    <div className="my-6">
	<p>To monitor more then 1 Validator, please place a space between each validator pubkey</p>
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
      or
      <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Email Not yet in use"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="px-8 group disabled:animate-none m-2 btn animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={() => onClick({voteAccount: voteAccount, discord: discord})}
		disabled={!publicKey}
		>
		<div className="hidden group-disabled:block">Wallet not connected</div>
          <span className="block group-disabled:hidden">Pay and Monitor</span>
      </button>

	   <textarea
	   className="form-control block mb-2 w-full px-2 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
	    id="allVal"
        placeholder=""
		value=""
        rows={20}
		    cols={115}
      />
    </div>
	 </div>
  )
}
