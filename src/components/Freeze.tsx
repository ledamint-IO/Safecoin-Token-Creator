import { FC, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@j0nnyboi/wallet-adapter-react';
import { Metadata } from '@leda-mint-io/lpl-token-metadata';
import { findMetadataPda } from '@leda-mint-io/js';

import { Connection, PublicKey, Keypair, Transaction } from "@safecoin/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createFreezeAccountInstruction  } from "@safecoin/safe-token";


export const FreezeToken: FC = () => {
  const { connection } = useConnection();
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenFreeze, setTokenFreeze] = useState('');
  const { publicKey, wallet,sendTransaction} = useWallet();

  const getFreeze = useCallback(
    async (form) => {

      let transaction: Transaction = new Transaction().add(createFreezeAccountInstruction(new PublicKey(tokenAddress), new PublicKey(tokenAddress), publicKey))
      
      await sendTransaction(transaction,connection);

    },
    [tokenAddress]
  );

  return (
    <>
      <div className='my-6'>
        <button
          className='px-8 m-2 btn animate-pulse animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ...'
          onClick={() => getFreeze({ tokenAddress })}>
          <span>Freeze token</span>
        </button>
      </div>
    </>
  );
};
