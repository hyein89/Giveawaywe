import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Histats async script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
var _Hasync= _Hasync|| [];
_Hasync.push(['Histats.start', '1,4828760,4,0,0,0,00010000']);
_Hasync.push(['Histats.fasi', '1']);
_Hasync.push(['Histats.track_hits', '']);
(function() {
  var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
  hs.src = ('//s10.histats.com/js15_as.js');
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
})();
    `;
    document.head.appendChild(script);
  }, []);

  return (
    <>
      <Head>
        {/* Histats noscript fallback */}
        <noscript>
          <a href="/" target="_blank">
            <img
              src="//sstatic1.histats.com/0.gif?4828760&101"
              alt=""
              border={0}
            />
          </a>
        </noscript>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
