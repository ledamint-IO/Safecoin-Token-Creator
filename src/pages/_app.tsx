import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";

require("@j0nnyboi/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Safecoin Token Creator</title>
      </Head>

      <ContextProvider>
        <div className="flex h-screen flex-col">
          <Notifications />
          <AppBar />
          <ContentContainer>
            <Component {...pageProps} />
          </ContentContainer>
          <Footer />
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
