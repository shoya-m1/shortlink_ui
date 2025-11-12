import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Interstitial() {
  const { code } = useParams();
  const [countdown, setCountdown] = useState(10); 
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanContinue(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  async function handleContinue() {
    const res = await fetch(`http://127.0.0.1:8000/api/links/${code}/continue`, {
      method: "POST",
    });
    const result = await res.json();

    // Buka tab iklan dulu
    if (result.ad_url) {
      window.open(result.ad_url, "_blank");
    }

    // Redirect tab saat ini ke original_url
    if (result.original_url) {
      window.location.assign(result.original_url); // safer than href
    }
  }


  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>Halaman Iklan</h1>
      <p>Anda akan diarahkan ke link tujuan setelah iklan ini.</p>

      {!canContinue ? (
        <p>Tunggu {countdown} detik...</p>
      ) : (
        <button onClick={handleContinue} style={{ padding: "10px 20px" }}>
          Continue
        </button>
      )}
    </div>
  );
}
