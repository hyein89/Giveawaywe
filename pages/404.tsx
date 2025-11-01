// pages/404.tsx
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Oops! The page you are looking for does not exist." />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
          body, html { height: 100%; }
          .container { 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            text-align: center; 
            height: 100vh; 
            background: linear-gradient(135deg, #667eea, #764ba2); 
            color: #fff;
            overflow: hidden;
            position: relative;
          }
          h1 {
            font-size: 8rem;
            animation: float 3s ease-in-out infinite;
          }
          h2 {
            font-size: 1.5rem;
            margin: 20px 0;
            animation: fadeIn 2s ease forwards;
          }
          .btn-home {
            margin-top: 30px;
            padding: 12px 30px;
            background: #fff;
            color: #764ba2;
            font-weight: 600;
            border-radius: 30px;
            text-decoration: none;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .btn-home:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.3);
          }

          /* Animations */
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          /* Responsive */
          @media (max-width: 768px) {
            h1 { font-size: 6rem; }
            h2 { font-size: 1.2rem; margin: 15px 0; }
            .btn-home { padding: 10px 25px; font-size: 0.9rem; }
          }

          /* Floating circles */
          .circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            animation: drift 10s infinite linear;
          }
          @keyframes drift {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-50px) translateX(50px); }
            100% { transform: translateY(0) translateX(0); }
          }
        `}</style>
      </Head>

      <div className="container">
        {/* Floating circles */}
        <div className="circle" style={{width: 100, height: 100, top: '10%', left: '15%'}}></div>
        <div className="circle" style={{width: 60, height: 60, top: '70%', left: '70%'}}></div>
        <div className="circle" style={{width: 80, height: 80, top: '50%', left: '40%'}}></div>

        <h1>404</h1>
        <h2>Oops! The page you are looking for does not exist.</h2>
        <Link href="/" className="btn-home">Go Back Home</Link>
      </div>
    </>
  );
}
