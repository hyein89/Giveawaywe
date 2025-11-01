// pages/view.tsx
import { useEffect, useState } from "react";
import Head from "next/head";

type Offer = {
  network_icon?: string;
  name?: string;
  anchor?: string;
  url?: string;
};

export default function ViewPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [claimActive, setClaimActive] = useState(false);

  const FINAL_OFFER_URL = "https://contoh.link/offer-akhir";

  // ===== DETEKSI MOBILE =====
  const isMobile = () => {
    if (typeof window === "undefined") return true;
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)
      || window.innerWidth <= 768;
  };

  // ===== COOKIE HELPERS =====
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

  useEffect(() => {
    // Redirect desktop
    if (!isMobile()) {
      window.location.href = FINAL_OFFER_URL;
    }

    // Popup
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    if (popup && closePopup) {
      setTimeout(() => popup.classList.add("active"), 800);
      closePopup.addEventListener("click", () => popup.classList.remove("active"));
    }

    // Claim button aktifkan jika cookie
    if (getCookie("claim_active") === "1") setClaimActive(true);

    // Load JSONP offers
    const callbackName = "jsonpCallback_" + Date.now();
    (window as any)[callbackName] = function (data: Offer[]) {
      delete (window as any)[callbackName];
      if (!Array.isArray(data) || data.length === 0) return;
      setOffers(data.slice(0, 8));
    };

    const script = document.createElement("script");
    script.src = `https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php?user_id=485302&api_key=1b68e4a31a7e98d11dcf741f5e5fce38&s1=&s2=&callback=${callbackName}`;
    script.onerror = () => console.log("⚠️Failed to load offer data");
    document.body.appendChild(script);
  }, []);

  const handleClaim = () => {
    window.open(FINAL_OFFER_URL, "_blank");
  };

  const handleOfferClick = (url?: string) => {
    window.open(url, "_blank");
    setClaimActive(true);
    setCookie("claim_active", "1", 30);
  };

  return (
    <>
      <Head>
        <title>Giveaway Step by Step</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Contoh meta untuk preview social media */}
        <meta property="og:title" content="Giveaway Step by Step" />
        <meta property="og:image" content="/giveaway.jpg" />
        <meta property="og:description" content="Ikuti langkah-langkah untuk klaim hadiah." />
      </Head>

      <div className="popup-overlay" id="popup">
        <div className="popup-box">
          <button className="close-btn" id="closePopup">&times;</button>
          <img src="/giveaway.jpg" alt="Giveaway Image" />
        </div>
      </div>

      <header>
        <img src="/avatar.jpg" alt="Title" className="avatar" />
        <h1>Title</h1>
      </header>

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

      <section className="offers">
        <h3><span className="material-icons">extension</span> Pilih Offer Anda</h3>
        <div className="offer-grid">
          {offers.length === 0 && (
            <p>⚠️ Data not available.</p>
          )}
          {offers.map((o, i) => (
            <div className="offer" key={i}>
              <img
                src={o.network_icon && o.network_icon.trim() !== "" ? o.network_icon : "/monks2.jpg"}
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

      <div className="claim">
        <button id="claimBtn" disabled={!claimActive} onClick={handleClaim}>
          CLAIM PRIZE NOW
        </button>
      </div>
    </>
  );
}
