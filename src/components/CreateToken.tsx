import { useConnection, useWallet } from "@j0nnyboi/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@safecoin/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToCheckedInstruction,
} from "@safecoin/safe-token";
import {
  createCreateMetadataAccountInstruction,
  PROGRAM_ID,
} from "@leda-mint-io/lpl-token-metadata";


import { FC, useCallback, useState } from "react";
import { notify } from "utils/notifications";
import { ClipLoader } from "react-spinners";
import { useNetworkConfiguration } from "contexts/NetworkConfigurationProvider";

export const CreateToken: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("9");
  const [tokenMintAddress, setTokenMintAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createToken = useCallback(async () => {
    if (!publicKey) {
      notify({ type: "error", message: `Wallet not connected!` });
      return;
    }
	//const PROGRAM_ID = new PublicKey('WbMTNyvtk8vSMu2AmXV7mKuYrADRNw9GSkNtWKsZ7qe');
	//console.log(PROGRAM_ID.toString());
	//console.log(TOKEN_PROGRAM_ID.toString());
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const mintKeypair = Keypair.generate();
    const tokenATA = await getAssociatedTokenAddress(new PublicKey(mintKeypair.publicKey), publicKey);
    const TKAmount = (document.getElementById("TKAMT") as HTMLInputElement).value;
    setIsLoading(true);
    try {
      const tx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),

        createInitializeMintInstruction(
          mintKeypair.publicKey,
          Number(tokenDecimals),
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID,
        ),
      createAssociatedTokenAccountInstruction(
        publicKey, // payer
        tokenATA, // ata
        publicKey, // owner
        mintKeypair.publicKey // mint
      ),

      createMintToCheckedInstruction(
        mintKeypair.publicKey,
        tokenATA,
        publicKey,
        parseInt(TKAmount)* Math.pow(10, 9),
        9
      ),

      );
      const signature = await sendTransaction(tx, connection, {
        signers: [mintKeypair],
      });
      await  connection.confirmTransaction(signature);
      setTokenMintAddress(mintKeypair.publicKey.toString());
      notify({
        type: "success",
        message: "Token creation successful",
        txid: signature,
      });

    } catch (error: any) {
      notify({ type: "error", message: "Token creation failed" });
    }
    setIsLoading(false);
  }, [
    publicKey,
    connection,
    tokenDecimals,
    tokenName,
    tokenSymbol,
    tokenUri,
    sendTransaction,
  ]);

  return (
    <div>
      {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}
      {!tokenMintAddress ? (
        <div>
          <div className="mt-4 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="m-auto p-2 text-xl font-normal">Token name</div>
            <div className="m-auto p-2">
              <input
                className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none"
                onChange={(e) => setTokenName(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="m-auto p-2">
              <div className="text-xl font-normal">Token symbol</div>
              <p>{"Abbreviated name (e.g. Safecoin -> SAFE)."}</p>
            </div>
            <div className="m-auto p-2">
              <input
                className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none"
                onChange={(e) => setTokenSymbol(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="m-auto p-2">
              <div className="text-xl font-normal">Token URI</div>
              <p>Link to your metadata json file.</p>
              <p>
                Paste an existing one or create new
                <a
                  className="cursor-pointer font-medium text-green-500 hover:text-indigo-500"
                  href="./upload"
                >
                  {" here"}
                </a>
                .
              </p>
              <p>You can leave it blank if you don`t need token image.</p>
            </div>
            <div className="m-auto p-2">
              <input
                className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none"
                onChange={(e) => setTokenUri(e.target.value)}
                placeholder="Not working yet"
              />
            </div>
          </div>
          <div className="mt-4 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="m-auto p-2">
              <div className="text-xl font-normal">Token Mint Amount</div>
            </div>
            <div className="m-auto p-2">
              <input
                className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none" id="TKAMT"
                type={"number"}
                min={0}
              />
            </div>
          </div>
          <div className="mt-4 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="m-auto p-2">
              <div className="text-xl font-normal">Token decimals</div>
              <p>Default value is 9 for safecoin.</p>
            </div>
            <div className="m-auto p-2">
              <input
                className="rounded border px-4 py-2 text-xl font-normal text-gray-700 focus:border-blue-600 focus:outline-none"
                type={"number"}
                min={0}
                value={tokenDecimals}
                onChange={(e) => setTokenDecimals(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              className="... group disabled:animate-none btn m-2 animate-pulse bg-gradient-to-r from-[#90f5c5] to-[#14F195] px-8 hover:from-pink-500 hover:to-yellow-500"
              onClick={createToken}
			  disabled={!publicKey}
			>
			<div className="hidden group-disabled:block">Wallet not connected</div>
               <span className="block group-disabled:hidden">Create token</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 break-words">
          <p className="font-medium">Link to your new token.</p>
          <a
            className="cursor-pointer font-medium text-purple-500 hover:text-indigo-500"
            href={`https://explorer.safecoin.org/address/${tokenMintAddress}?cluster=${networkConfiguration}`}
            target="_blank"
            rel="noreferrer"
          >
            {tokenMintAddress}
          </a>
        </div>
      )}
    </div>
  );
};
