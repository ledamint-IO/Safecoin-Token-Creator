import { FC, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@j0nnyboi/wallet-adapter-react';
import { Metadata } from '@leda-mint-io/lpl-token-metadata';
import { findMetadataPda } from '@leda-mint-io/js';

import { Connection, PublicKey, Keypair, TransactionMessage, VersionedTransaction } from "@safecoin/web3.js";
import { createBurnCheckedInstruction, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@safecoin/safe-token";



export const BurnToken: FC = () => {
  const { connection } = useConnection();
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenBurn, setTokenBurn] = useState('');
  const { publicKey, wallet, sendTransaction } = useWallet();
  const MINT_DECIMALS = 9;
  const BURN_QUANTITY = 1;
  const getBurn = useCallback(
    async (form) => {

      const account = await getAssociatedTokenAddress(new PublicKey(tokenAddress), publicKey);


      const burnIx = createBurnCheckedInstruction(
        account, // PublicKey of Owner's Associated Token Account
        new PublicKey(tokenAddress), // Public Key of the Token Mint Address
        publicKey, // Public Key of Owner's Wallet
        BURN_QUANTITY * (10**MINT_DECIMALS), // Number of tokens to burn
        MINT_DECIMALS // Number of Decimals of the Token Mint
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');

      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [burnIx]
      }).compileToV0Message();
      const transaction = new VersionedTransaction(messageV0);

      const txid = await sendTransaction(transaction, connection);

    console.log("    ✅ - Transaction sent to network");
    const confirmation = await connection.confirmTransaction({
        signature: txid,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight
    });
    if (confirmation.value.err) { throw new Error("    ❌ - Transaction not confirmed.") }
    console.log('🔥 SUCCESSFUL BURN!🔥', '\n', `https://explorer.safecoin.org/tx/${txid}?cluster=devnet`);

    },
    [tokenAddress]
  );

  return (
    <>
      <div className='my-6'>
        <button
          className='px-8 m-2 btn animate-pulse animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ...'
          onClick={() => getBurn({ tokenAddress })}>
          <span>Burn</span>
        </button>
        <input
                className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none"
                type={"number"}
                onChange={(e) => setTokenBurn(e.target.value)}
              />
      </div>
    </>
  );
};
