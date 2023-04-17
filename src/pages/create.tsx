import type { NextPage } from "next";
import Head from "next/head";
import { CreateView } from "../views";

const Create: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Safecoin Token Creator - Create Token</title>
        <meta name="description" content="Create safecoin fungible token" />
      </Head>
      <CreateView />
    </div>
  );
};

export default Create;
