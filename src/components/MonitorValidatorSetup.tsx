import { FC, useCallback, useState } from 'react';
import { useConnection, useWallet } from '@j0nnyboi/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SAFE, PublicKey, TransactionSignature, TransactionConfirmationStrategy } from '@safecoin/web3.js';
import { notify } from "../utils/notifications";
import { ClipLoader } from "react-spinners";

const VALIDATOR_UPLOAD_ENDPOINT ="https://onestopshopBridge.ledamint.io";
//const VALIDATOR_UPLOAD_ENDPOINT ="http://127.0.0.1:8080";
const allDataENDPOIN = (VALIDATOR_UPLOAD_ENDPOINT + "/AllValData/");

import {
  useNetworkConfiguration,
} from "../contexts/NetworkConfigurationProvider";


interface IValidatorResult {
  error?: string;
  messages?: Array<{
    transactionId: string;
    Discord: string;
    //Email:string;
    Vote: string;
	Chain: string;
  }>;
}
const uploadToValidator = async (data: FormData): Promise<IValidatorResult> => {
  console.log(data);
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
    console.log("Unable to upload Data to monitor server. Please contact j0nnyboi with TXID.");
    notify({
      type: "error",
       message: `Unable to upload Data to monitor server. Please contact j0nnyboi with TXID.`,
      });
  }

  const result: IValidatorResult = await resp.json();

  if (result.error) {
	console.log('Results Error');
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

async function getData() {

	  const data = await ValData(allDataENDPOIN);
	  let valiID =[];
		for(var i = 0;i<data.length;i++) {
		    //console.log(data[i]);
			  valiID = valiID + data[i]
    document.getElementById("allVal").innerHTML = valiID.toString();
		}
  }



export const MonitorValidator: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
 const { networkConfiguration } = useNetworkConfiguration();
 //console.log('Networt ' + networkConfiguration);
 getData();
  const onClick = useCallback(async () => {
    const voteAccount = (document.getElementById("VoteAcc") as HTMLInputElement).value;
    console.log(voteAccount);
	  if(voteAccount == ""){
      setIsLoading(false);
			console.log("no Vote Account");
			notify({
        type: "error",
        message: "No Vote Account",
		});
		return
		}

    const discord = (document.getElementById("Discord") as HTMLInputElement).value;
    const email = (document.getElementById("Email") as HTMLInputElement).value;
    console.log(discord);
    console.log(email);
	    if(discord == "" && email == ""){
        setIsLoading(false);
			console.log("no discord webhook or email");
			notify({
        type: "error",
        message: "No Discord Webhook or email",
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
        const latestBlockHash = await connection.getLatestBlockhash();
		    await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        });

        const data = new FormData();
        data.append('transaction', signature);
        data.append('Vote', voteAccount);
        data.append('Discord', discord);
        //data.append('email', email);
        data.append('Chain', networkConfiguration);
        data.append('publicKey', publicKey.toString());

        console.log(data);

        const result: IValidatorResult = await uploadToValidator(data);
        setIsLoading(false);
        console.log(result);
        console.log('Added to Monitoring server');
        notify({
            type: "success",
            message: `Added to Monitoring server`,
            description: String(result),
          });


		 //window.location.replace('/');
	  } catch {
		setIsLoading(false);
    console.log("ERROR " + signature);
			notify({
        type: "Error",
        message: "Transaction ERROR!",
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
  }, []);


  return (
  <div  className="my-5">
   {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}
  <h3>
  <p>Costs 10 safe to add or update a validator to monitor</p>
  </h3>
    <div className="my-6">
	<p>To monitor more then 1 Validator, please place a space between each validator pubkey</p>
      <input
        id="VoteAcc"
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Validator Vote Account"
      />

      <input
        id="Discord"
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Discord web hock"
      />
      or
      <input
        id="Email"
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Email Not yet in use"
      />
      <button
        className="px-8 group disabled:animate-none m-2 btn animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#3DCE4A] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={() => onClick()}
		    disabled={!publicKey}
		>
		<div className="hidden group-disabled:block">Wallet not connected</div>
          <span className="block group-disabled:hidden">Pay and Monitor</span>
      </button>

	   <textarea
	   className="form-control block mb-2 w-full px-2 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
	      id="allVal"
        placeholder=""
        rows={20}
		    cols={115}
      />
    </div>
	 </div>
  )
}
