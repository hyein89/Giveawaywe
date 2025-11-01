import { GetServerSideProps } from "next";
import Head from "next/head";
import data from "../data.json";

interface PageProps {
  title?: string;
  avatar?: string;
  image?: string;
  notFound?: boolean;
}

export default function View({ title, avatar, image, notFound }: PageProps) {
  if (notFound) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Key tidak cocok atau tidak ada.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:image" content={image} />
        <meta property="og:description" content={`Giveaway ${title}`} />
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

      <body>
        {/* POPUP */}
        <div className="popup-overlay" id="popup">
          <div className="popup-box">
            <button className="close-btn" id="closePopup">&times;</button>
            <img src={image} alt="Giveaway Image" />
          </div>
        </div>

        {/* HEADER */}
        <header>
          <img src={avatar} alt="Avatar" className="avatar" />
          <h1>{title}</h1>
        </header>

        {/* LANGKAH-LANGKAH */}
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

        {/* OFFERS */}
        <section className="offers">
          <h3>
            <span className="material-icons">extension</span> Pilih Offer Anda
          </h3>
          <div className="offer-grid" id="offerContainer">
            <div className="offer">
              <img src="https://picsum.photos/60?random=1" alt="Offer Placeholder" />
              <div className="offer-info">
                <h4>Download Exciting Games</h4>
                <p>Play up to level 3 for verification.</p>
              </div>
              <button className="btn">FREE</button>
            </div>
          </div>
        </section>

        {/* CLAIM */}
        <div className="claim">
          <button id="claimBtn" disabled>CLAIM PRIZE NOW</button>
        </div>

        {/* SCRIPT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
const FINAL_OFFER_URL = "https://contoh.link/offer-akhir";

// DETEKSI MOBILE
function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) || window.innerWidth <= 768;
}
if (!isMobile()) window.location.href = FINAL_OFFER_URL;

window.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');
  if (popup && closePopup) {
    setTimeout(() => popup.classList.add('active'), 800);
    closePopup.addEventListener('click', () => popup.classList.remove('active'));
  }

  function setCookie(name,value,minutes){const d=new Date();d.setTime(d.getTime()+minutes*60*1000);document.cookie=name+'='+value+';expires='+d.toUTCString()+';path=/';}
  function getCookie(name){const cookies=document.cookie.split(";").map(c=>c.trim());for(const c of cookies){if(c.startsWith(name+'=')) return c.substring(name.length+1);}return null;}

  const claimBtn=document.getElementById("claimBtn");
  const offerContainer=document.getElementById("offerContainer");
  if(getCookie("claim_active")==="1") claimBtn.disabled=false;

  claimBtn.addEventListener("click",()=>window.open(FINAL_OFFER_URL,"_blank"));

  function loadOffers(){
    const callbackName="jsonpCallback_"+Date.now();
    window[callbackName]=function(data){
      delete window[callbackName];
      if(!Array.isArray(data)||data.length===0){offerContainer.innerHTML="<p>⚠️ Data not available.</p>";return;}
      offerContainer.innerHTML="";
      data.slice(0,8).forEach(o=>{
        const imgSrc=o.network_icon&&o.network_icon.trim()!==""?o.network_icon:"/monks2.jpg";
        const name=o.name||"Anonymous offer";
        const anchor=o.anchor||"Complete this task to claim the reward!";
        const url=o.url||"#";
        const div=document.createElement("div");div.className="offer";
        const img=document.createElement("img");img.src=imgSrc;img.alt=name;img.width=60;img.height=60;img.style.objectFit="cover";img.onerror=()=>img.src="/monks2.jpg";
        const info=document.createElement("div");info.className="offer-info";info.innerHTML="<h4>"+name+"</h4><p>"+anchor+"</p>";
        const btn=document.createElement("button");btn.className="btn";btn.textContent="FREE";btn.addEventListener("click",()=>{
          window.open(url,"_blank");claimBtn.disabled=false;setCookie("claim_active","1",30);
        });
        div.appendChild(img);div.appendChild(info);div.appendChild(btn);
        offerContainer.appendChild(div);
      });
    };
    const script=document.createElement("script");
    script.src="https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php?user_id=485302&api_key=1b68e4a31a7e98d11dcf741f5e5fce38&s1=&s2=&callback="+callbackName;
    script.onerror=()=>offerContainer.innerHTML="<p><center>⚠️Failed to load offer data</center></p>";
    document.body.appendChild(script);
  }
  loadOffers();
});
            `,
          }}
        />
      </body>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { key } = context.query;

  if (!key) return { notFound: true };

  const entry = data.find((d) => d.key === key);

  if (!entry) return { notFound: true };

  return {
    props: {
      title: entry.title,
      avatar: entry.avatar,
      image: entry.image,
    },
  };
};
