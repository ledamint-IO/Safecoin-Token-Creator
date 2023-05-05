import { FC, useCallback, useState } from 'react';
import { useConnection, useWallet } from '@j0nnyboi/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SAFE, PublicKey, TransactionSignature } from '@safecoin/web3.js';
import { notify } from "../utils/notifications";
import { ClipLoader } from "react-spinners";

const VALIDATOR_UPLOAD_ENDPOINT ="https://onestopshopBridge.ledamint.io";
//const VALIDATOR_UPLOAD_ENDPOINT ="http://127.0.0.1:8080";

import {
  useNetworkConfiguration,
} from "../contexts/NetworkConfigurationProvider";


export async function ValData(
  request: RequestInfo
): Promise<any> {
  const response = await fetch(request);
  const body = await response.json();
  return body;
}


export const ValidatorMonitor: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [voteAccount, setVoteAcc] = useState('')
  const [discord, setDiscord] = useState('')
  const [isLoading, setIsLoading] = useState(false);
 const { networkConfiguration } = useNetworkConfiguration();
 //console.log('Networt ' + networkConfiguration);

 async function getData() {
 const data =  await ValData(VALIDATOR_UPLOAD_ENDPOINT + "/ValData/" + publicKey);
 //console.log(data);
 var valiID = [];
 for(var i = 0;i<data[0].length;i++) {
   valiID = valiID + data[0][i]
   document.getElementById("Valid").innerHTML = valiID.toString();
 //console.log(valiID)
 }
 var allValID = [];
 for(var i = 0;i<data[1].length;i++) {
   allValID = allValID + data[1][i]
 document.getElementById("allValid").innerHTML = allValID.toString();
 //console.log(allValID)
 }

 var myValID = [];
 for(var i = 0;i<data[2].length;i++) {
   myValID = myValID + data[2][i]
   document.getElementById("MyValid").innerHTML = myValID.toString();
 //console.log(myValID)
 }

	}
	getData();


  const onClick = useCallback(async () => {
    getData();



  }, []);

  return (
  <div  className="my-5">


	  <p>My Montoring Validators that are Delinquent</p>
	  <textarea
	   className="form-control block mb-2 w-full px-2 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        id="Valid"
        placeholder=""
        rows={2}
		    cols={115}
      />
      <p>My Validators that i am monitoring</p>
	  <textarea
	   className="form-control block mb-2 w-full px-2 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        id="MyValid"
        placeholder=""
        rows={2}
		    cols={115}
      />
	  <p>All delinquent Validators</p>
	   <textarea
	   className="form-control block mb-2 w-full px-2 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
	      id="allValid"
        placeholder=""
        rows={20}
		    cols={115}
      />

	  <button
        className="px-8 group disabled:animate-none m-2 btn animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={() => onClick()}
		disabled={!publicKey}
		>
		<div className="hidden group-disabled:block">Wallet not connected</div>
          <span className="block group-disabled:hidden">Update Data</span>
      </button>
    </div>
  )
}
