// pages/index.tsx
import { useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const REDIRECT_URL = "https://bestsmartvpn.com/qyzhbbw1?key=94c0b7f8c03251e52b0a13aca62c58cd";

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
