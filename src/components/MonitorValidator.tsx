import { FC, useCallback, useState } from 'react';
import { useConnection, useWallet } from '@j0nnyboi/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SAFE } from '@safecoin/web3.js';




export const MonitorValidator: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [voteAccount, setVoteAcc] = useState('')
  const [discord, setDiscord] = useState('')


  const onClick = useCallback(async (form) => {
		const { publicKey, sendTransaction } = useWallet();
        //form.voteAccount, 
        //form.discord,
		
		transaction.add(
			SystemProgram.transfer({
			fromPubkey: publicKey,
			toPubkey:'j0nnyboi__keypair',
			lamports: 50*LAMPORTS_PER_SAFE,
			}),
		);
		await sendTransaction(connection, transaction);
        
	}, [publicKey, connection, sendTransaction]);
	
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
	  
     /* <input
        type="number"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Decimals"
        onChange={(e) => setDecimals(e.target.value)}
      />*/
      
      <button
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={() => onClick({decimals: Number(decimals), amount: Number(amount), metadata: metadata, symbol: symbol, tokenName: tokenName})}>
          <span>Pay and Monitor</span>
      </button>
    </div>
  )
}
