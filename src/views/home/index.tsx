import { FC, useState,  useEffect, useRef } from "react";
import pkg from "../../../package.json";

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { useConnection, useWallet } from "@j0nnyboi/wallet-adapter-react";
import { ColDef } from 'ag-grid-community';

const VALIDATOR_UPLOAD_ENDPOINT ="https://onestopshopBridge.ledamint.io";
//const VALIDATOR_UPLOAD_ENDPOINT ="http://127.0.0.1:8080";
const ValListENDPOINT = (VALIDATOR_UPLOAD_ENDPOINT + "/ValList/");


const ValidatorData = async (connection) => {
  let valiID =[];
  let revdata = {};
  const { current, delinquent } = await connection.getVoteAccounts();
  for(var i = 0;i<current.length;i++) {
    const EpochCredits = (current[i]['epochCredits'][4]); 
    revdata  = {'Validator':current[i]['nodePubkey'],
    'Commission':current[i]['commission'],
    'EpochCredits':parseInt(EpochCredits[1])- parseInt(EpochCredits[2])};
    valiID.push(revdata);
 }
 return valiID;
}




export const HomeView: FC = ({}) => {
  const [data, setData] = useState([])
  const { connection } = useConnection();
  const intervalRef = useRef<null | NodeJS.Timeout>(null);
  //setData([Data]);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
    ValidatorData(connection).then((Data) =>{
    setData(Data);
    console.log(Data);
    });
  },60000)
  },[]);

  
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'Validator', width: 450 },
    { field: 'Commission', width: 150 },
    { field: 'EpochCredits', width: 190, sortable: true, sort: 'desc' },
  
  ])

  return (
    <div className="mx-auto p-4 md:hero">
      <div className="flex flex-col md:hero-content">
        <h1 className="bg-gradient-to-tr from-[#90f5c5] to-[#51DF5F] bg-clip-text text-center text-5xl font-bold text-transparent md:pl-12">
          Safecoin 
          </h1>
          <h1 className="bg-gradient-to-tr from-[#90f5c5] to-[#51DF5F] bg-clip-text text-center text-5xl font-bold text-transparent md:pl-12">
          Token Creator and Validator monitor
          <span className="align-top text-sm font-normal text-slate-700">
          </span>
        </h1>
        
        <h4 className="bg-gradient-to-tr from-[#90f5c5] to-[#51DF5F] bg-clip-text text-center text-2xl font-bold text-transparent md:pl-12">
         Validator Battle Arena
          <span className="align-top text-sm font-normal text-slate-700">
          </span>
        </h4>
              
        <div className="ag-theme-alpine" style={{height: 1000, width: 810}}>
           <AgGridReact
               rowData={data}
               domLayout={'autoHeight'}
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>

      </div>
    </div>
  );
};
