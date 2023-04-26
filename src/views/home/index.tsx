import { FC } from "react";
import pkg from "../../../package.json";

export const HomeView: FC = ({}) => {
  return (
    <div className="mx-auto p-4 md:hero">
      <div className="flex flex-col md:hero-content">
        <h1 className="bg-gradient-to-tr from-[#90f5c5] to-[#14F195] bg-clip-text text-center text-5xl font-bold text-transparent md:pl-12">
          Safecoin Token Creator and Validator monitor{" "}
          <span className="align-top text-sm font-normal text-slate-700">
            v{pkg.version}
          </span>
        </h1>
        <h4 className="my-2 text-center text-slate-300 md:w-full">
          <p>Interactive way to create your own Safecoin token.</p>
          No coding skills or knowledge of token structure required.
        </h4>
        <ol className="animate-pulse list-inside list-decimal self-center bg-gradient-to-tr from-[#90f5c5] to-[#14F195] bg-clip-text text-2xl font-medium text-transparent">
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
      </div>
    </div>
  );
};
