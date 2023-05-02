import { FC, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@j0nnyboi/wallet-adapter-react';
import { PublicKey, Transaction, TransactionMessage, VersionedTransaction,} from '@safecoin/web3.js';
import { mintTo, getAssociatedTokenAddress, createMintToCheckedInstruction,
   createAssociatedTokenAccountInstruction, createFreezeAccountInstruction,
   createBurnCheckedInstruction, createThawAccountInstruction, } from "@safecoin/safe-token";
import { Metadata } from '@leda-mint-io/lpl-token-metadata';
import { findMetadataPda } from '@leda-mint-io/js';
import { notify } from "utils/notifications";
import { ClipLoader } from "react-spinners";

export const EditToken: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { connection } = useConnection();
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const [logo, setLogo] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const { publicKey, sendTransaction } = useWallet();


  async function getTKBallance(tokenATA) {
    try{
    let accountDetails = await connection.getTokenAccountBalance(new PublicKey(tokenATA));
    console.log(accountDetails.value.uiAmount);
    document.getElementById("TKnumber").innerHTML = accountDetails.value.uiAmount.toString();
    }catch  (error: any) {
      console.log(0);
      document.getElementById("TKnumber").innerHTML = "0";
    }
   };


  const getMetadata = useCallback(
    async () => {

      //console.log(TKaddress.toString());
      //const metadataPDA =  await findMetadataPda(new PublicKey(form.TKaddress));
      //console.log(metadataPDA.toBase58());
      //const metadataAccount = "test";
     // const metadataAccount = await connection.getAccountInfo(metadataPDA);
      //console.log(metadataAccount);
      //const [metadata, _] = await Metadata.deserialize(metadataAccount.data);
      //let logoRes = await fetch(metadata.data.uri);
      //let logoJson = await logoRes.json();
      //let { image } = logoJson;
      //setTokenMetadata({ tokenMetadata, ...metadata.data });
      setTokenMetadata({ tokenMetadata, "name":"NOT Working Yet","symbol":"NOT Working","tokenAmount":0});
      //setLogo(image);
      setLoaded(true);
      //setTokenAddress('')

      const tokenAddress = (document.getElementById("Token_Address") as HTMLInputElement).value;
	  console.log(tokenAddress);
      const tokenATA = await getAssociatedTokenAddress(new PublicKey(tokenAddress), publicKey);

      console.log(tokenATA);
	  getTKBallance(tokenATA);
    },
    []
  );


  const getMintToken = useCallback(

    async () => {
      const TKAmount = (document.getElementById("TKAMT") as HTMLInputElement).value;
      const tokenAddress = (document.getElementById("Token_Address") as HTMLInputElement).value;
      const tokenATA = await getAssociatedTokenAddress(new PublicKey(tokenAddress), publicKey);

    try {
      const mint = new PublicKey(tokenAddress);
      let tx = new Transaction().add(

      createMintToCheckedInstruction(
      mint,
      new PublicKey(tokenATA),
      publicKey,
      parseInt(TKAmount)* Math.pow(10, 9),
      9
    ));
    setIsLoading(true);
      const signature = await sendTransaction(tx, connection);

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });
     getTKBallance(tokenATA);
     setIsLoading(false);
      notify({
        type: "success",
        message: "Token Mint successful",
        txid: signature,
      });
    } catch (error: any) {
      setIsLoading(false);
      notify({ type: "error", message: "Token Mint failed" });
    }


    },
    []
  );

  const getFreeze = useCallback(
    async () => {
  try{

    const tokenAddress = (document.getElementById("Token_Address") as HTMLInputElement).value;
      const tokenATA = await getAssociatedTokenAddress(new PublicKey(tokenAddress), publicKey);
      console.log(tokenAddress);
      let transaction: Transaction = new Transaction().add(
        createFreezeAccountInstruction(
          new PublicKey(tokenATA),
          new PublicKey(tokenAddress),
          publicKey));
      setIsLoading(true);
      const signature = await sendTransaction(transaction,connection);
      const latestBlockHash = await connection.getLatestBlockhash();
		    await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        });
      setIsLoading(false);
      notify({
        type: "success",
        message: "Token Freeze successful",
        txid: signature,
      });
    } catch (error: any) {
      setIsLoading(false);
      notify({ type: "error", message: "Token Freeze failed" });
    }
    },
    []
  );

  const getThaw = useCallback(
    async () => {
      try{
        const tokenAddress = (document.getElementById("Token_Address") as HTMLInputElement).value;
      const tokenATA = await getAssociatedTokenAddress(new PublicKey(tokenAddress), publicKey);
        console.log(tokenATA);
        let transaction: Transaction = new Transaction().add(
        createThawAccountInstruction(
          new PublicKey(tokenATA),
          new PublicKey(tokenAddress),
          publicKey
        ));
        setIsLoading(true);
        const signature = await sendTransaction(transaction,connection);
        const latestBlockHash = await connection.getLatestBlockhash();
		    await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        });
        setIsLoading(false);
        notify({
          type: "success",
          message: "Token Thaw successful",
          txid: signature,
        });
      } catch (error: any) {
        setIsLoading(false);
        notify({ type: "error", message: "Token Thaw failed" });
      }

    },
    []
  );


  const getBurn = useCallback(
    async () => {
    try{
      const BurnAmount = (document.getElementById("BURNAMT") as HTMLInputElement).value;
      const tokenAddress = (document.getElementById("Token_Address") as HTMLInputElement).value;
      const tokenATA = await getAssociatedTokenAddress(new PublicKey(tokenAddress), publicKey);
      console.log(tokenATA);
      console.log(tokenAddress);
      setIsLoading(true);
      let transaction: Transaction = new Transaction().add(
      createBurnCheckedInstruction(
        new PublicKey(tokenATA), // PublicKey of Owner's Associated Token Account
        new PublicKey(tokenAddress), // Public Key of the Token Mint Address
        publicKey, // Public Key of Owner's Wallet
        parseInt(BurnAmount) * (10**9), // Number of tokens to burn
        9 // Number of Decimals of the Token Mint
      ));
      const signature = await sendTransaction(transaction, connection);
      const latestBlockHash = await connection.getLatestBlockhash();
		    await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        });
      getTKBallance(tokenATA);
      setIsLoading(false);
      notify({
        type: "success",
        message: "Token Burn successful",
        txid: signature,
      });
    } catch (error: any) {
      setIsLoading(false);
      notify({ type: "error", message: "Token Burn failed" });
    }

   },
    []
  );


  return (
    <>
    <div>
      {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}
      <div className='my-6'>
        <input
          type='text'
          className='form-control block mb-2 ml-auto mr-auto max-w-800 px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          placeholder='Token Address'
          id="Token_Address"
        />
        <button
          className='px-8 group disabled:animate-none m-2 btn animate-pulse animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ...'
          onClick={() => getMetadata()}
          disabled={!publicKey}
		      >
		      <div className="hidden group-disabled:block">Wallet not connected</div>
          <span className="block group-disabled:hidden">Get Metadata</span>
        </button>
      </div>
      <div className='my-6'>
        {!loaded ? undefined : (
            <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
              <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                  Token Metadata
                </h3>
              </div>
              <div className='border-t border-gray-200'>
                <dl className='divide-y divide-gray-200'>
                  <>
                    <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        logo
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                        <img src={logo} alt='token' className='w-1/4 h-full inline-block object-center object-cover lg:w-1/4 lg:h-full'/>
                      </dd>
                    </div>
                    <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        name
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                        {tokenMetadata.name}
                      </dd>
                    </div>
                    <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        symbol
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                        {tokenMetadata.symbol || 'undefined'}
                      </dd>
                    </div>
                    <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        amount
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'id="TKnumber">
                        {tokenMetadata.tokenAmount}
                      </dd>
                    </div>
                    <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        uri
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                        <a href={tokenMetadata.uri} target='_blank'rel="noreferrer">{tokenMetadata.uri}</a>
                      </dd>
                    </div>
                    <div className='my-6'>
                     <button
                        className='px-8 m-2 btn animate-pulse animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ...'
                        onClick={() => getMintToken()}>
                        <span>Mint</span>
                      </button>
                      <input
                        className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none" id="TKAMT"
                        type={"number"}
                      />
                    </div>
                    <div className='my-6'>
                      <button
                          className='px-8 m-2 btn animate-pulse animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ...'
                          onClick={() => getBurn()}>
                          <span>Burn</span>
                        </button>
                        <input
                                className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none"id="BURNAMT"
                                type={"number"}
                              />
                    </div>
                    <div className='my-6'>
                      <button
                        className='px-8 m-2 btn animate-pulse animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ...'
                        onClick={() => getFreeze()}>
                        <span>Freeze token</span>
                      </button>
                    </div>
                    <div className='my-6'>
                    <button
                      className='px-8 m-2 btn animate-pulse animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ...'
                      onClick={() => getThaw()}>
                      <span>Thaw Token</span>
                    </button>
                  </div>
                  </>
                </dl>
              </div>
            </div>

        )}
      </div>
    </div>
    </>
  );
};
