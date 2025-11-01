// pages/view.tsx
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import fs from "fs";
import path from "path";

type GiveawayData = {
  key: string;
  title: string;
  avatar: string;
  image: string;
};

type Offer = {
  network_icon?: string;
  name?: string;
  anchor?: string;
  url?: string;
};

type Props = {
  giveaway?: GiveawayData;
};

export default function ViewPage({ giveaway }: Props) {
  const router = useRouter();
  const { sub } = router.query as { sub?: string };

  const [offers, setOffers] = useState<Offer[]>([]);
  const [claimActive, setClaimActive] = useState(false);
  const [popupActive, setPopupActive] = useState(false);

  const FINAL_OFFER_URL = "https://contoh.link/offer-akhir";

  // COOKIE HELPER
  const setCookie = (name: string, value: string, minutes: number) => {
    const d = new Date();
    d.setTime(d.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  };
  const getCookie = (name: string) => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith(name + "=")) return c.substring(name.length + 1);
    }
    return null;
  };

  if (!giveaway) return <p>Giveaway not found.</p>;

  // Load offers via JSONP feed (pakai sub sebagai s1)
  useEffect(() => {
    const callbackName = "jsonpCallback_" + Date.now();
    (window as any)[callbackName] = (data: Offer[]) => {
      setOffers(data.slice(0, 8));
      delete (window as any)[callbackName];
    };

    const feedSub = sub || "default_sub"; // jika sub tidak ada, pakai default
    const script = document.createElement("script");
    script.src = `https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php?user_id=485302&api_key=1b68e4a31a7e98d11dcf741f5e5fce38&s1=${encodeURIComponent(
      feedSub
    )}&s2=&callback=${callbackName}`;
    script.onerror = () => setOffers([]);
    document.body.appendChild(script);
  }, [sub]);

  // Check cookie untuk claim
  useEffect(() => {
    if (getCookie("claim_active") === "1") setClaimActive(true);
    setTimeout(() => setPopupActive(true), 800);
  }, []);

  const handleClaim = () => window.open(FINAL_OFFER_URL, "_blank");

  return (
    <>
      <Head>
        <title>{giveaway.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={giveaway.title} />
        <meta property="og:image" content={giveaway.image} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={`Join ${giveaway.title} giveaway now!`} />
        <meta property="og:url" content={`https://giveawaywe.vercel.app${router.asPath}`} />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/costom.css" />
      </Head>

      {/* POPUP */}
      {popupActive && (
        <div className="popup-overlay active" id="popup">
          <div className="popup-box">
            <button className="close-btn" onClick={() => setPopupActive(false)}>
              &times;
            </button>
            <img src={giveaway.image} alt={giveaway.title} />
          </div>
        </div>
      )}

      <header>
        <img src={giveaway.avatar} alt={giveaway.title} className="avatar" />
        <h1>{giveaway.title}</h1>
      </header>

      <section className="steps">
        <h2>
          <span className="material-icons">flag</span> The Final Step You Must Take.
        </h2>
        <div className="step">
          <span className="material-icons">check_circle</span>
          Click on one of the offers below and complete the instructions until complete.
        </div>
        <div className="step">
          <span className="material-icons">hourglass_bottom</span>
          Wait for the system to verify your completion (usually within seconds).
        </div>
        <div className="step">
          <span className="material-icons">redeem</span>
          Once completed, the “Claim Prize” button will be active and you can claim your prize.
        </div>
      </section>

      <section className="offers">
        <h3>
          <span className="material-icons">extension</span> Choose your offer
        </h3>
        <div className="offer-grid">
          {offers.length === 0 && <p>⚠️ Data not available.</p>}
          {offers.map((o, i) => (
            <div className="offer" key={i}>
              <img
                src={o.network_icon || "/monks2.jpg"}
                alt={o.name}
                width={60}
                height={60}
                style={{ objectFit: "cover" }}
                onError={(e) => ((e.target as HTMLImageElement).src = "/monks2.jpg")}
              />
              <div className="offer-info">
                <h4>{o.name || "Anonymous offer"}</h4>
                <p>{o.anchor || "Complete this task to claim the reward!"}</p>
              </div>
              <button
                className="btn"
                onClick={() => {
                  window.open(o.url || "#", "_blank");
                  setClaimActive(true);
                  setCookie("claim_active", "1", 30);
                }}
              >
                FREE
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="claim">
        <button id="claimBtn" disabled={!claimActive} onClick={handleClaim}>
          CLAIM PRIZE NOW
        </button>
      </div>
    </>
  );
}

// getServerSideProps untuk meta tag OG
export async function getServerSideProps(context: any) {
  const { key } = context.query;
  const dataPath = path.join(process.cwd(), "public", "data.json");
  const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8")) as GiveawayData[];
  const giveaway = jsonData.find((g) => g.key === key) || null;

  if (!giveaway) {
    return { notFound: true }; // redirect ke 404
  }

  return {
    props: { giveaway },
  };
}
