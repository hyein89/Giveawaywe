import React from "react";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Halaman utama" />
      </Head>
      <main style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <h1>Welcome to Tes.vercel.app</h1>
      </main>
    </>
  );
}
