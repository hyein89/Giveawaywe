import { GetServerSideProps } from "next";
import Head from "next/head";
import data from "../data.json";

interface PageProps {
  title?: string;
  avatar?: string;
  image?: string;
  notFound?: boolean;
}

export default function Home({ title, avatar, image, notFound }: PageProps) {
  if (notFound) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Key tidak cocok atau tidak ada.</p>
      </div>
    );
  }

  // Jika query key valid, tampilkan data giveaway
  if (title && avatar && image) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={`Giveaway ${title}`} />
        </Head>
        <main style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
          <img src={avatar} alt="Avatar" style={{ borderRadius: "50%" }} />
          <h1>{title}</h1>
          <img src={image} alt="Giveaway Image" style={{ maxWidth: "500px", width: "100%", marginTop: "20px" }} />
        </main>
      </>
    );
  }

  // Tampilan homepage default
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Tes.vercel.app</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { key } = context.query;

  if (!key) {
    return { props: {} }; // homepage biasa
  }

  const entry = data.find((d) => d.key === key);

  if (!entry) {
    return { props: { notFound: true } };
  }

  return {
    props: {
      title: entry.title,
      avatar: entry.avatar,
      image: entry.image,
    },
  };
};
