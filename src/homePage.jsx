import { useState } from "react";

export default function ShortLinkGenerator() {
  
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ original_url: originalUrl }),
      })


      if (!res.ok) throw new Error("Failed to create short link");

      const data = await res.json();
      // data.short_url misal berisi: http://domain.com/s/abc123
      setShortLink(data.short_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}>
      <h1>Generate Short Link</h1>
      <form onSubmit={handleGenerate}>
        <input
          type="url"
          placeholder="Masukkan URL asli"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
        />
        <br />
        <button type="submit" style={{ padding: "10px 20px" }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shortLink && (
        <p>
          Short link:{" "}
          <a href={shortLink} target="_blank" rel="noopener noreferrer">
            {shortLink}
          </a>
        </p>
      )}
    </div>
  );
}
