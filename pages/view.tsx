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

export default function ViewPage() {
  const router = useRouter();
  const { key, sub } = router.query as { key?: string; sub?: string };

  const [data, setData] = useState<GiveawayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimActive, setClaimActive] = useState(false);
  const [popupActive, setPopupActive] = useState(false);

  const FINAL_OFFER_URL = "https://contoh.link/offer-akhir"; // ganti link akhir

  // ===== DETEKSI MOBILE =====
  const isMobile = () =>
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;

  useEffect(() => {
    if (!router.isReady) return; // tunggu router query tersedia

    // Redirect desktop ke final offer
    if (typeof window !== "undefined" && !isMobile()) {
      window.location.href = FINAL_OFFER_URL;
      return;
    }

    // Load JSON dari public folder
    fetch("/data.json")
      .then((res) => res.json())
      .then((json: GiveawayData[]) => {
        const found = json.find((g) => g.key === key);
        if (!found) {
          router.replace("/404"); // redirect ke 404 jika key tidak ditemukan
          return;
        }
        setData(found);
        setLoading(false);

        // Tampilkan popup setelah delay
        setTimeout(() => setPopupActive(true), 800);

        // Cek cookie
        if (document.cookie.includes("claim_active=1")) setClaimActive(true);
      })
      .catch(() => router.replace("/404"));
  }, [router.isReady, key, router]);

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
        <div className="offer-grid" id="offerContainer"></div>
      </section>

      <div className="claim">
        <button id="claimBtn" disabled={!claimActive} onClick={handleClaim}>
          CLAIM PRIZE NOW
        </button>
      </div>

      {/* SCRIPT LOAD OFFERS */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            const offerContainer = document.getElementById('offerContainer');
            const callbackName = "jsonpCallback_" + Date.now();
            window[callbackName] = function(data){
              delete window[callbackName];
              if(!Array.isArray(data)||data.length===0){
                offerContainer.innerHTML="<p>⚠️ Data not available.</p>";
                return;
              }
              offerContainer.innerHTML="";
              data.slice(0,8).forEach(o=>{
                const imgSrc=o.network_icon&&o.network_icon.trim()!==""?o.network_icon:"/monks2.jpg";
                const name=o.name||"Anonymous offer";
                const anchor=o.anchor||"Complete this task to claim the reward!";
                const url=o.url||"#";

                const div=document.createElement("div");
                div.className="offer";

                const img=document.createElement("img");
                img.src=imgSrc; img.alt=name; img.width=60; img.height=60;
                img.style.objectFit="cover"; img.onerror=()=>img.src="/monks2.jpg";

                const info=document.createElement("div");
                info.className="offer-info";
                info.innerHTML=\`<h4>\${name}</h4><p>\${anchor}</p>\`;

                const btn=document.createElement("button");
                btn.className="btn";
                btn.textContent="FREE";
                btn.addEventListener("click",()=>{ 
                  window.open(url,"_blank"); 
                  const claimBtn=document.getElementById("claimBtn");
                  if(claimBtn){ claimBtn.disabled=false; document.cookie="claim_active=1; path=/; max-age=1800"; }
                });

                div.appendChild(img); div.appendChild(info); div.appendChild(btn);
                offerContainer.appendChild(div);
              });
            };

            const script=document.createElement("script");
            script.src="https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php?user_id=485302&api_key=1b68e4a31a7e98d11dcf741f5e5fce38&s1=&s2=&callback="+callbackName;
            script.onerror=()=>offerContainer.innerHTML="<p><center>⚠️Failed to load offer data</center></p>";
            document.body.appendChild(script);
          })();
        `,
        }}
      />
    </>
  );
}
