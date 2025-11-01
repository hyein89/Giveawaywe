import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import data from "../data.json"; // JSON adalah array sekarang

type GiveawayData = {
  key: string;
  title: string;
  avatar: string;
  image: string;
};

const FINAL_OFFER_URL = "https://contoh.link/offer-akhir";

export default function ViewPage() {
  const router = useRouter();
  const { key } = router.query;
  const [giveaway, setGiveaway] = useState<GiveawayData | null>(null);

  useEffect(() => {
    if (!key) return;

    // Cari item di array sesuai key
    const d = (data as GiveawayData[]).find((item) => item.key === key);
    if (!d) {
      router.replace("/404");
      return;
    }
    setGiveaway(d);

    // ===== DETEKSI MOBILE =====
    function isMobile() {
      return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
    }

    if (!isMobile()) {
      window.location.href = FINAL_OFFER_URL;
    }

    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    if (popup && closePopup) {
      setTimeout(() => popup.classList.add("active"), 800);
      closePopup.addEventListener("click", () => popup.classList.remove("active"));
    }

    const claimBtn = document.getElementById("claimBtn") as HTMLButtonElement;
    const offerContainer = document.getElementById("offerContainer");
    if (!offerContainer || !claimBtn) return;

    function setCookie(name: string, value: string, minutes: number) {
      const d = new Date();
      d.setTime(d.getTime() + minutes * 60 * 1000);
      document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    }
    function getCookie(name: string) {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      for (const c of cookies) {
        if (c.startsWith(name + "=")) return c.substring(name.length + 1);
      }
      return null;
    }

    if (getCookie("claim_active") === "1") claimBtn.disabled = false;
    claimBtn.addEventListener("click", () => window.open(FINAL_OFFER_URL, "_blank"));

    // ===== LOAD OFFER FEED =====
    function loadOffers() {
      const callbackName = "jsonpCallback_" + Date.now();
      (window as any)[callbackName] = function (data: any[]) {
        delete (window as any)[callbackName];
        if (!Array.isArray(data) || data.length === 0) {
          offerContainer.innerHTML = "<p>⚠️ Data not available.</p>";
          return;
        }

        offerContainer.innerHTML = "";
        data.slice(0, 8).forEach((o) => {
          const imgSrc = o.network_icon?.trim() || "/monks2.jpg";
          const name = o.name || "Anonymous offer";
          const anchor = o.anchor || "Complete this task to claim the reward!";
          const url = o.url || "#";

          const div = document.createElement("div");
          div.className = "offer";

          const img = document.createElement("img");
          img.src = imgSrc;
          img.alt = name;
          img.width = 60;
          img.height = 60;
          img.style.objectFit = "cover";
          img.onerror = () => (img.src = "/monks2.jpg");

          const info = document.createElement("div");
          info.className = "offer-info";
          info.innerHTML = `<h4>${name}</h4><p>${anchor}</p>`;

          const btn = document.createElement("button");
          btn.className = "btn";
          btn.textContent = "FREE";
          btn.addEventListener("click", () => {
            window.open(url, "_blank");
            claimBtn.disabled = false;
            setCookie("claim_active", "1", 30);
          });

          div.appendChild(img);
          div.appendChild(info);
          div.appendChild(btn);
          offerContainer.appendChild(div);
        });
      };

      const script = document.createElement("script");
      script.src = `https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php?user_id=485302&api_key=1b68e4a31a7e98d11dcf741f5e5fce38&s1=&s2=&callback=${callbackName}`;
      script.onerror = () =>
        (offerContainer.innerHTML = "<p><center>⚠️Failed to load offer data</center></p>");
      document.body.appendChild(script);
    }

    loadOffers();
  }, [key, router]);

  if (!giveaway) return null;

  return (
    <>
      <Head>
        <title>{giveaway.title}</title>
        <meta property="og:title" content={giveaway.title} />
        <meta property="og:image" content={giveaway.image} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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

      <div className="popup-overlay" id="popup">
        <div className="popup-box">
          <button className="close-btn" id="closePopup">
            &times;
          </button>
          <img src={giveaway.image} alt="Giveaway Image" />
        </div>
      </div>

      <header>
        <img src={giveaway.avatar} alt="Avatar" className="avatar" />
        <h1>{giveaway.title}</h1>
      </header>

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

      <section className="offers">
        <h3>
          <span className="material-icons">extension</span> Pilih Offer Anda
        </h3>
        <div className="offer-grid" id="offerContainer"></div>
      </section>

      <div className="claim">
        <button id="claimBtn" disabled>
          CLAIM PRIZE NOW
        </button>
      </div>
    </>
  );
}
