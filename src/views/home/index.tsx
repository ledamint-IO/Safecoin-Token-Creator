import { FC, useState,  useEffect } from "react";
import pkg from "../../../package.json";

import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";

const VALIDATOR_UPLOAD_ENDPOINT ="https://onestopshopBridge.ledamint.io";
//const VALIDATOR_UPLOAD_ENDPOINT ="http://127.0.0.1:8080";
const ValListENDPOINT = (VALIDATOR_UPLOAD_ENDPOINT + "/ValList/");

async function getData() {
  const response = await fetch(ValListENDPOINT);
  const data = await response.json()
  //console.log(data);
  let valiID =[];
  let revdata = [];
  for(var i = 0;i<data.length;i++) {
    var dataSplit = data[i].split('-');
     //console.log(dataSplit);
       revdata  = [dataSplit[2]];
       revdata.push(dataSplit[1]);
       revdata.push(dataSplit[0]);
      valiID.push(revdata);
  //document.getElementById("ValList").innerHTML = valiID.toString();
 }
 //console.log(valiID);
 return valiID;
}



export const HomeView: FC = ({}) => {
  const [data, setData] = useState(['Getting', 'Data','Now'])

  //setData([Data]);
  useEffect(() => {
    getData().then((Data) =>{
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
          data={data}
          autoWidth={true}
          resizable={true}
          columns={[{name:'Validator', width: '50%'}, {name:'Commission', width: '20%'},{name:'Epoch Credits'}]}

        />

        </div>
      </div>
    </div>
  );
};
