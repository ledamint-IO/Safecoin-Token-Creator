import type { NextPage } from "next";
import Head from "next/head";
import { ValidatorMonView } from "../views";

const ValidatorMonitor: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Safecoin</title>
        <meta
          name="description"
          content="Safecoin"
        />
      </Head>
      <ValidatorMonView />
    </div>
  );
};

export default ValidatorMonitor;