import { FC, useState, useCallback } from 'react';
import { useConnection } from '@j0nnyboi/wallet-adapter-react';
import { PublicKey } from '@safecoin/web3.js';
import { Metadata } from '@leda-mint-io/lpl-token-metadata';
import { findMetadataPda } from '@leda-mint-io/js';


export const MintToken: FC = () => {
  const { connection } = useConnection();
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState("");

  const getMint = useCallback(
    async (form) => {

    },
    [tokenAddress]
  );

  return (
    <>
      <div className='my-6'>
        <button
          className='px-8 m-2 btn animate-pulse animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ...'
          onClick={() => getMint({ tokenAddress })}>
          <span>Mint</span>
        </button>
        <input
                className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none"
                type={"number"}
                onChange={(e) => setTokenAmount(e.target.value)}
              />
      </div>
    </>
  );
};
