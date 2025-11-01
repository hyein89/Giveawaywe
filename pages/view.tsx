// pages/view.tsx
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

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

export default function ViewPage() {
  const router = useRouter();
  const { key } = router.query as { key?: string };

  const [data, setData] = useState<GiveawayData | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimActive, setClaimActive] = useState(false);
  const [popupActive, setPopupActive] = useState(false);

  const FINAL_OFFER_URL = "https://contoh.link/offer-akhir";

  const isMobile = () =>
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;

  // Load giveaway data
  useEffect(() => {
    if (!router.isReady) return;

    if (!isMobile()) {
      window.location.href = FINAL_OFFER_URL;
      return;
    }

    fetch("/data.json")
      .then((res) => res.json())
      .then((json: GiveawayData[]) => {
        const found = json.find((g) => g.key === key);
        if (!found) {
          router.replace("/404");
          return;
        }
        setData(found);
        setLoading(false);

        setTimeout(() => setPopupActive(true), 800);

        if (document.cookie.includes("claim_active=1")) setClaimActive(true);
      })
      .catch(() => router.replace("/404"));
  }, [router.isReady, key, router]);

  // Load offers via JSONP feed
  useEffect(() => {
    const callbackName = "jsonpCallback_" + Date.now();
    (window as any)[callbackName] = (data: Offer[]) => {
      setOffers(data.slice(0, 8));
      delete (window as any)[callbackName];
    };

    const script = document.createElement("script");
    script.src = `https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php?user_id=485302&api_key=1b68e4a31a7e98d11dcf741f5e5fce38&s1=&s2=&callback=${callbackName}`;
    script.onerror = () => setOffers([]);
    document.body.appendChild(script);
  }, []);

  const setCookie = (name: string, value: string, minutes: number) => {
    const d = new Date();
    d.setTime(d.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  };

  const handleClaim = () => window.open(FINAL_OFFER_URL, "_blank");

  if (loading || !data) return null;

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={data.title} />
        <meta property="og:image" content={data.image} />
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
            <img src={data.image} alt={data.title} />
          </div>
        </div>
      )}

      <header>
        <img src={data.avatar} alt={data.title} className="avatar" />
        <h1>{data.title}</h1>
      </header>

      <section className="steps">
        <h2>
          <span className="material-icons">flag</span> Langkah-langkah Mengikuti Giveaway
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
          <span className="material-icons">extension</span> Pilih Offer Anda
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
