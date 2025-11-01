// pages/view.tsx
import { useEffect, useState } from "react";
import Head from "next/head";

type Offer = {
  network_icon?: string;
  name?: string;
  anchor?: string;
  url?: string;
};

type GiveawayData = {
  key: string;
  title: string;
  avatar: string;
  image: string;
};

export default function ViewPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [claimActive, setClaimActive] = useState(false);
  const [popupActive, setPopupActive] = useState(false);
  const [giveaway, setGiveaway] = useState<GiveawayData | null>(null);

  const FINAL_OFFER_URL = "https://contoh.link/offer-akhir";

  const isMobile = () => {
    if (typeof window === "undefined") return true;
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)
      || window.innerWidth <= 768;
  };

  const setCookie = (name: string, value: string, minutes: number) => {
    const d = new Date();
    d.setTime(d.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  };

  const getCookie = (name: string) => {
    const cookies = document.cookie.split(";").map(c => c.trim());
    for (const c of cookies) {
      if (c.startsWith(name + "=")) return c.substring(name.length + 1);
    }
    return null;
  };

  // Ambil data giveaway dari data.json
  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then((data: GiveawayData[]) => setGiveaway(data[0] || null))
      .catch(err => console.error("Failed to load data.json", err));
  }, []);

  // Popup, claim button & mobile redirect
  useEffect(() => {
    if (!isMobile()) {
      window.location.href = FINAL_OFFER_URL;
      return;
    }

    // Aktifkan tombol claim dari cookie
    if (getCookie("claim_active") === "1") setClaimActive(true);

    // Popup delay 800ms
    const popupTimer = setTimeout(() => setPopupActive(true), 800);

    // Load JSONP offers
    const callbackName = "jsonpCallback_" + Date.now();
    (window as any)[callbackName] = function(data: Offer[]) {
      delete (window as any)[callbackName];
      if (!Array.isArray(data) || data.length === 0) return;
      setOffers(data.slice(0, 8));
    };

    const script = document.createElement("script");
    script.src = `https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php?user_id=485302&api_key=1b68e4a31a7e98d11dcf741f5e5fce38&s1=&s2=&callback=${callbackName}`;
    script.onerror = () => console.log("⚠️Failed to load offer data");
    document.body.appendChild(script);

    return () => clearTimeout(popupTimer);
  }, []);

  const handleClaim = () => window.open(FINAL_OFFER_URL, "_blank");
  const handleOfferClick = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank");
    setClaimActive(true);
    setCookie("claim_active", "1", 30);
  };

  if (!giveaway) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>{giveaway.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={giveaway.title} />
        <meta property="og:image" content={giveaway.image} />
        <meta property="og:description" content="Ikuti langkah-langkah untuk klaim hadiah." />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" href="/costom.css" />
      </Head>

      {/* POPUP */}
      {popupActive && (
        <div className="popup-overlay active">
          <div className="popup-box">
            <button className="close-btn" onClick={() => setPopupActive(false)}>
              &times;
            </button>
            <img src={giveaway.image} alt="Giveaway Image" />
          </div>
        </div>
      )}

      {/* HEADER */}
      <header>
        <img src={giveaway.avatar} alt="Avatar" className="avatar" />
        <h1>{giveaway.title}</h1>
      </header>

      {/* STEPS */}
      <section className="steps">
        <h2><span className="material-icons">flag</span> Langkah-langkah Mengikuti Giveaway</h2>
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

      {/* OFFERS */}
      <section className="offers">
        <h3><span className="material-icons">extension</span> Pilih Offer Anda</h3>
        <div className="offer-grid">
          {offers.length === 0 && <p>⚠️ Data not available.</p>}
          {offers.map((o, i) => (
            <div className="offer" key={i}>
              <img
                src={o.network_icon?.trim() ? o.network_icon : "/monks2.jpg"}
                alt={o.name || "Anonymous offer"}
                width={60}
                height={60}
                style={{ objectFit: "cover" }}
                onError={(e) => ((e.target as HTMLImageElement).src = "/monks2.jpg")}
              />
              <div className="offer-info">
                <h4>{o.name || "Anonymous offer"}</h4>
                <p>{o.anchor || "Complete this task to claim the reward!"}</p>
              </div>
              <button className="btn" onClick={() => handleOfferClick(o.url)}>FREE</button>
            </div>
          ))}
        </div>
      </section>

      {/* CLAIM BUTTON */}
      <div className="claim">
        <button id="claimBtn" disabled={!claimActive} onClick={handleClaim}>
          CLAIM PRIZE NOW
        </button>
      </div>
    </>
  );
}
