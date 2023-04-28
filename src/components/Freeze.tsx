import { FC, useState, useCallback } from 'react';
import { useConnection } from '@j0nnyboi/wallet-adapter-react';
import { PublicKey } from '@safecoin/web3.js';
import { Metadata } from '@leda-mint-io/lpl-token-metadata';
import { findMetadataPda } from '@leda-mint-io/js';


export const FreezeToken: FC = () => {
  const { connection } = useConnection();
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenFreeze, setTokenFreeze] = useState('');

  const getFreeze = useCallback(
    async (form) => {

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
