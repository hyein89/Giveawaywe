import { useEffect } from "react";
import Head from "next/head";

const FINAL_OFFER_URL = "https://contoh.link/offer-akhir"; // ganti link akhir

export default function ViewPage() {
  useEffect(() => {
    // ===== DETEKSI MOBILE =====
    function isMobile() {
      return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)
             || window.innerWidth <= 768;
    }

    // Redirect desktop sebelum konten mobile dimuat
    if (!isMobile()) {
      window.location.href = FINAL_OFFER_URL;
    }

    // ===== POPUP =====
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    if (popup && closePopup) {
      setTimeout(() => popup.classList.add("active"), 800);
      closePopup.addEventListener("click", () => popup.classList.remove("active"));
    }

    // ===== COOKIE HELPER =====
    function setCookie(name: string, value: string, minutes: number) {
      const d = new Date();
      d.setTime(d.getTime() + minutes * 60 * 1000);
      document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    }

    function getCookie(name: string) {
      const cookies = document.cookie.split(";").map(c => c.trim());
      for (const c of cookies) {
        if (c.startsWith(name + "=")) return c.substring(name.length + 1);
      }
      return null;
    }

    // ===== OFFER & CLAIM BUTTON =====
    const claimBtn = document.getElementById("claimBtn") as HTMLButtonElement;
    const offerContainer = document.getElementById("offerContainer");
    if (!offerContainer || !claimBtn) return;

    if (getCookie("claim_active") === "1") claimBtn.disabled = false;

    claimBtn.addEventListener("click", () => window.open(FINAL_OFFER_URL, "_blank"));

    function loadOffers() {
      const callbackName = "jsonpCallback_" + Date.now();

      (window as any)[callbackName] = function (data: any[]) {
        delete (window as any)[callbackName];

        if (!Array.isArray(data) || data.length === 0) {
          offerContainer.innerHTML = "<p>⚠️ Data not available.</p>";
          return;
        }

        offerContainer.innerHTML = "";
        data.slice(0, 8).forEach(o => {
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
  }, []);

  return (
    <>
      <Head>
        <title>Giveaway Step by Step</title>
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
          <img src="img giveaway" alt="Giveaway Image" />
        </div>
      </div>

      <header>
        <img src="img avatar" alt="Title" className="avatar" />
        <h1>Title</h1>
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
        <div className="offer-grid" id="offerContainer">
          <div className="offer">
            <img src="https://picsum.photos/60?random=1" alt="" />
            <div className="offer-info">
              <h4>Download Exciting Games</h4>
              <p>Play up to level 3 for verification.</p>
            </div>
            <button className="btn">FREE</button>
          </div>
        </div>
      </section>

      <div className="claim">
        <button id="claimBtn" disabled>
          CLAIM PRIZE NOW
        </button>
      </div>
    </>
  );
}
