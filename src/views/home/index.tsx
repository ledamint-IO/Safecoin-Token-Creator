import { FC, useState,  useEffect } from "react";
import pkg from "../../../package.json";

import { Grid , _ } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";

import { useConnection, useWallet } from "@j0nnyboi/wallet-adapter-react";

const VALIDATOR_UPLOAD_ENDPOINT ="https://onestopshopBridge.ledamint.io";
//const VALIDATOR_UPLOAD_ENDPOINT ="http://127.0.0.1:8080";
const ValListENDPOINT = (VALIDATOR_UPLOAD_ENDPOINT + "/ValList/");


const ValidatorData = async (connection) => {
  let valiID =[];
  let revdata = [];
  const { current, delinquent } = await connection.getVoteAccounts();
  for(var i = 0;i<current.length;i++) {
    const EpochCredits = (current[i]['epochCredits'][4]); 
    revdata  = [current[i]['nodePubkey']];
    revdata.push(current[i]['commission']);
    revdata.push(parseInt(EpochCredits[1])- parseInt(EpochCredits[2]));
    valiID.push(revdata);
 }
 return valiID;
}



export const HomeView: FC = ({}) => {
  const [data, setData] = useState(['Getting', 'Data','Now'])
  const { connection } = useConnection();

  //setData([Data]);
  useEffect(() => {
    ValidatorData(connection).then((Data) =>{
    setData(Data);
    });
  },[]);


//console.log(Data);



  return (
    <div className="mx-auto p-4 md:hero">
      <div className="flex flex-col md:hero-content">
        <h1 className="bg-gradient-to-tr from-[#90f5c5] to-[#51DF5F] bg-clip-text text-center text-5xl font-bold text-transparent md:pl-12">
          Safecoin Token Creator and Validator monitor{" "}
          <span className="align-top text-sm font-normal text-slate-700">
            v{pkg.version}
          </span>
        </h1>
        <h4 className="my-2 text-center text-slate-300 md:w-full">
          <p>Interactive way to create your own Safecoin token.</p>
          No coding skills or knowledge of token structure required.
        </h4>
        <ol className="animate-pulse list-inside list-decimal self-center bg-gradient-to-tr from-[#51DF5F] to-[#51DF5F] bg-clip-text text-2xl font-medium text-transparent">
          <li>
            <a
              className="cursor-pointer bg-gradient-to-tr bg-clip-text text-transparent hover:from-purple-500 hover:to-yellow-500"
              href="./upload"
            >
              Upload token metadata to IPFS
            </a>
          </li>
          <li>
            <a
              className="cursor-pointer bg-gradient-to-tr bg-clip-text text-transparent hover:from-purple-500 hover:to-yellow-500"
              href="./misc"
            >
              {"Request airdrop if needed (for Testnet & devnet)"}
            </a>
          </li>
          <li>
            <a
              className="cursor-pointer bg-gradient-to-tr bg-clip-text text-transparent hover:from-purple-500 hover:to-yellow-500"
              href="./create"
            >
              Create token
            </a>
          </li>
		  <li>
            <a
              className="cursor-pointer bg-gradient-to-tr bg-clip-text text-transparent hover:from-purple-500 hover:to-yellow-500"
              href="./validator"
            >
              Setup to Monitor Validator
            </a>
          </li>
		  <li>
            <a
              className="cursor-pointer bg-gradient-to-tr bg-clip-text text-transparent hover:from-purple-500 hover:to-yellow-500"
              href="./validatorMonitor"
            >
              Monitor Validator's
            </a>
          </li>
        </ol>
        <h1 className="list-inside list-decimal self-center bg-gradient-to-tr from-[#51DF5F] to-[#51DF5F] bg-clip-text text-2xl font-medium text-transparent">
        Validator Battle Area
        </h1>
        <ol className="list-inside list-decimal self-center bg-gradient-to-tr from-[#51DF5F] to-[#51DF5F] bg-clip-text font-medium text-transparent"
        id='ValList'>

        </ol>

        <div id="hot-app">
        <Grid
          autoWidth={true}
          resizable={true}
          autoGroupColumnDef={[{field:'Epoch Credits'},
            {sort:'asc'}] // 'asc' or 'desc'
          }
          columns={[{name:'Validator', width: '50%'}, {name:'Commission', width: '20%'},{name:'Epoch Credits',sort: {
            compare: (a, b) => {
              if (a > b) {
                return 1;
              } else if (b > a) {
                return -1;
              } else {
                return 0;
              }
            }
          }}]}
		  data={data}
        />

        </div>
      </div>
    </div>
  );
};
