import { GetServerSideProps } from "next";
import Head from "next/head";
import data from "../data.json";

interface PageProps {
  title: string;
  avatar: string;
  image: string;
}

export default function Page({ title, avatar, image }: PageProps) {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { key } = context.query;

  const entry = data.find((d) => d.key === key);

  if (!entry) {
    // redirect ke 404 jika key tidak cocok
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: entry.title,
      avatar: entry.avatar,
      image: entry.image,
    },
  };
};

