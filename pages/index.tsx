import { useEffect } from "react";
import Head from "next/head";
import { REDIRECT_URL } from "../lib/config"; // sesuaikan path

export default function Home() {
  useEffect(() => {
    window.location.href = REDIRECT_URL;
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0;URL=${REDIRECT_URL}`} />
      </Head>
    </>
  );
}

