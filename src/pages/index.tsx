import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Safecoin Token Creator</title>
        <meta name="description" content="Safecoin token creator" />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
