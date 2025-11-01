import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          padding: "20px",
          background: "#f6f7fb",
          color: "#333"
        }}
      >
        <h1 style={{ fontSize: "6rem", marginBottom: "20px" }}>404</h1>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Halaman Tidak Ditemukan</h2>
        <p style={{ marginBottom: "30px" }}>Maaf, halaman yang kamu cari tidak tersedia.</p>
        <Link
          href="/"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "#fff",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          Kembali ke Home
        </Link>
      </main>
    </>
  );
}
