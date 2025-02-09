// Next, React
import { FC, useEffect } from "react";

// Wallet
import { useWallet, useConnection } from "@j0nnyboi/wallet-adapter-react";

// Components
import { EditToken } from "components/EditToken";



export const EditView: FC = ({}) => {
  
  return (
    <div className="mx-auto p-4 md:hero">
      <div className="flex flex-col md:hero-content">
        <h1 className="bg-gradient-to-tr from-[#90f5c5] to-[#14F195] bg-clip-text text-center text-5xl font-bold text-transparent">
          Edit your Token
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          Burn,
		  Freeze,
		  Thaw,
		  Mint,
        <EditToken />		  
        </div>
      </div>
    </div>
  );
};
