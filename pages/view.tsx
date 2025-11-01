// pages/view.tsx
import { useEffect, useState } from "react";
import data from "../data.json"; // pastikan path sesuai

interface GiveawayData {
  key: string;
  title: string;
  avatar: string;
  image: string;
}

interface Offer {
  network_icon?: string;
  name?: string;
  anchor?: string;
  url?: string;
}

const FINAL_OFFER_URL = "https://contoh.link/offer-akhir";

export default function ViewPage({ keyParam }: { keyParam: string }) {
  const [popupActive, setPopupActive] = useState(false);
  const [claimActive, setClaimActive] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [giveaway, setGiveaway] = useState<GiveawayData | null>(null);

  // Ambil data dari JSON
  useEffect(() => {
    const found = data.find((d) => d.key === keyParam) || null;
    setGiveaway(found);
  }, [keyParam]);

  // Mobile redirect & cookie check
  useEffect(() => {
    const isMobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
      window.innerWidth <= 768;

    if (!isMobile) {
      window.location.href = FINAL_OFFER_URL;
    }

    // Popup muncul
    setTimeout(() => setPopupActive(true), 800);

    // Cookie check
    const cookieClaim = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("claim_active="));
    if (cookieClaim?.split("=")[1] === "1") setClaimActive(true);

    // Load offers via JSONP
    const callbackName = "jsonpCallback_" + Date.now();
    (window as any)[callbackName] = (data: Offer[]) => {
      setOffers(data.slice(0, 8));
      delete (window as any)[callbackName];
    };
    const script = document.createElement("script");
    script.src = `https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php?user_id=485302&api_key=1b68e4a31a7e98d11dcf741f5e5fce38&s1=&s2=&callback=${callbackName}`;
    script.onerror = () => console.error("Failed to load offer data");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      delete (window as any)[callbackName];
    };
  }, []);

  const handleClaimClick = () => {
    setClaimActive(true);
    document.cookie = `claim_active=1;path=/;max-age=${30 * 60}`;
    window.open(FINAL_OFFER_URL, "_blank");
  };

  if (!giveaway) return <p>⚠️ Giveaway not found</p>;

  return (
    <div>
      {/* POPUP */}
      {popupActive && (
        <div className="popup-overlay active" id="popup">
          <div className="popup-box">
            <button
              className="close-btn"
              id="closePopup"
              onClick={() => setPopupActive(false)}
            >
              &times;
            </button>
            <img src={giveaway.image} alt="Giveaway Image" />
          </div>
        </div>
      )}

      {/* HEADER */}
      <header>
        <img src={giveaway.avatar} alt={giveaway.title} className="avatar" />
        <h1>{giveaway.title}</h1>
      </header>

      {/* STEPS */}
      <section className="steps">
        <h2>
          <span className="material-icons">flag</span> Langkah-langkah Mengikuti
          Giveaway
        </h2>
        <div className="step">
          <span className="material-icons">check_circle</span>
          Click on one of the offers below and complete the instructions until
          complete.
        </div>
        <div className="step">
          <span className="material-icons">hourglass_bottom</span>
          Wait for the system to verify your completion (usually within seconds).
        </div>
        <div className="step">
          <span className="material-icons">redeem</span>
          Once completed, the “Claim Prize” button will be active and you can
          claim your prize.
        </div>
      </section>

      {/* OFFERS */}
      <section className="offers">
        <h3>
          <span className="material-icons">extension</span> Pilih Offer Anda
        </h3>
        <div className="offer-grid">
          {offers.length === 0 && <p>Loading offers...</p>}
          {offers.map((o, i) => (
            <div className="offer" key={i}>
              <img
                src={o.network_icon?.trim() || "/monks2.jpg"}
                alt={o.name || "Anonymous offer"}
                width={60}
                height={60}
                style={{ objectFit: "cover" }}
                onError={(e: any) => (e.target.src = "/monks2.jpg")}
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
                  document.cookie = `claim_active=1;path=/;max-age=${30 * 60}`;
                }}
              >
                FREE
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CLAIM BUTTON */}
      <div className="claim">
        <button
          id="claimBtn"
          disabled={!claimActive}
          onClick={handleClaimClick}
        >
          CLAIM PRIZE NOW
        </button>
      </div>
    </div>
  );
}
