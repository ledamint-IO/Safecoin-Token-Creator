import type { NextPage } from "next";
import Head from "next/head";
import { EditView } from "../views";

const Edit: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Safecoin Token Creator - Miscellaneous</title>
        <meta name="description" content="Additional Functionality" />
      </Head>
      <EditView />
    </div>
  );
};

export default Edit;
