import type { NextPage } from "next";
import Head from "next/head";
import { ValidatorView } from "../views";

const Validator: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Safecoin</title>
        <meta
          name="description"
          content="Safecoin"
        />
      </Head>
      <ValidatorView />
    </div>
  );
};

export default Validator;