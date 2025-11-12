import { useState } from 'react';
import Barcode from 'react-barcode';

// Komponen untuk ikon, agar lebih mudah dibaca
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

const UserIcon = () => <Icon path="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
const LinkIcon = () => <Icon path="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />;
const MoneyIcon = () => <Icon path="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c2.14-.46 3.5-1.78 3.5-3.97 0-2.34-1.92-3.48-4.5-4.18z" />;
const CopyIcon = () => <Icon className="w-5 h-5" path="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />;
const CheckIcon = () => <Icon className="w-5 h-5 text-green-500" path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />;
const QrCodeIcon = () => <Icon className="w-5 h-5" path="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-6 8h8v8h-8v-8zm6 6h-4v-4h4v4z" />;
const MenuIcon = () => <Icon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />;

// Komponen Header/Navbar
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = ['Home', 'Features', 'FAQ', 'Contact'];

  return (
    <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-full mr-3"></div>
          <span className="text-xl font-bold text-gray-800">LOGO</span>
        </div>

        {/* Menu untuk Desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map(link => (
            <a key={link} href="#" className="font-semibold text-indigo-600 hover:text-indigo-800">{link}</a>
          ))}
        </div>

        {/* Tombol untuk Desktop */}
        <div className="hidden font-semibold lg:flex items-center space-x-4">
          <a href="#" className="text-white lg:text-white hover:text-indigo-600 ">Login</a>
          <a href="#" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors">Register</a>
        </div>

        {/* Tombol Hamburger untuk Mobile */}
        <div className="lg:hidden">
          <button className='text-indigo-600' onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open Menu">
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Menu Dropdown untuk Mobile */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-white rounded-lg shadow-lg p-5">
          <div className="flex flex-col space-y-4">
            {navLinks.map(link => (
              <a key={link} href="#" className="text-gray-600 hover:text-indigo-600 block">{link}</a>
            ))}
            <hr />
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium pt-2">Login</a>
            <a href="#" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-center hover:bg-indigo-700 transition-colors">Register</a>
          </div>
        </div>
      )}
    </header>
  );
}

// Komponen utama aplikasi
export default function App() {

  const [originalUrl, setOriginalUrl] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gBarcode, setGBarcode] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = sessionStorage.getItem('auth_token');

    console.log(token)

    // if (!token) {
    //   console.warn('Tidak ada token — user belum login.');
    //   return null; // atau bisa return false, tergantung kebutuhan
    // }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': `Bearer ${token}`,
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
    <div className="relative min-h-screen w-screen bg-white font-sans overflow-hidden">
      {/* Latar belakang ungu diagonal */}
      <div className="absolute lg:opacity-100 opacity-0 top-0 right-0 h-full w-full lg:w-1/2 -z-0">
        <div className="absolute top-0 left-52 w-full h-full bg-indigo-800 transform -skew-x-16 origin-top-right"></div>
      </div>

      <div className="relative overflow-hidden">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Konten Kiri: Link Shortener */}
            <div className="text-center lg:text-left">
              <span className="inline-block bg-indigo-600 text-white text-sm font-semibold px-5 py-1 rounded-full mb-4">
                Shortlink
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 leading-tight mb-4">
                Easiest and most trusted link shortener
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Turn long, messy URLs into short, clean links you can share anywhere.
              </p>

              {/* Form Input */}
              <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="text"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  required
                  placeholder="Paste your url here..."
                  className="flex-grow text-indigo-900 w-full px-5 py-3 border border-gray-400 shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                />
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap">
                  {loading ? "Loading" : "Generate"}
                </button>
              </form>

              {error && <p style={{ color: "red" }}>{error}</p>}

              {/* Hasil Link */}

              {shortLink && (
                <>
                  <div className="bg-gray-50 border border-gray-400 shadow-md rounded-2xl p-2 flex items-center justify-between">
                    <div className="flex text-indigo-900 items-center gap-5 ms-3">
                      <CopyIcon />
                      <div>
                        {/* <span className="text-gray-500">Your Link</span> */}
                        <a href={shortLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-600/80">
                          {shortLink}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <div className="w-px h-6 bg-gray-500"></div>
                      <button className="p-2 text-gray-600 ">
                        <QrCodeIcon />
                      </button>
                    </div>
                  </div>
                  {gBarcode && (
                    <div>
                      <Barcode value={shortLink} />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Konten Kanan: Kartu "Make Money" */}
            <div className="w-full shadow-xl/20 max-w-md mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <span className="inline-block bg-indigo-600 text-white text-sm font-medium px-5 py-1 rounded-full mb-4">
                  Join Now
                </span>
                <h2 className="text-3xl font-bold text-indigo-800 mb-2">
                  Make money from the links you create
                </h2>
                <p className="text-gray-500 mb-8">
                  No hidden fees, just real earnings from your links
                </p>

                {/* Fitur Ikon */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex ring-1 ring-gray-400/30 py-2 flex-col items-center">
                    <div className="w-14 shadow-lg h-14 mb-3 bg-indigo-50 flex items-center justify-center rounded-full text-indigo-600">
                      <UserIcon />
                    </div>
                    <p className="font-medium text-sm text-gray-700">Create Account</p>
                  </div>
                  <div className="flex ring-1 py-2 ring-gray-400/30 flex-col items-center">
                    <div className="w-14 shadow-lg h-14 mb-3 bg-indigo-50 flex items-center justify-center rounded-full text-indigo-600">
                      <LinkIcon />
                    </div>
                    <p className="font-medium text-sm text-gray-700">Shorten Links</p>
                  </div>
                  <div className="flex flex-col ring-1 ring-gray-400/30 py-2 rounded items-center">
                    <div className="w-14 h-14 shadow-lg mb-3 bg-indigo-50 flex items-center justify-center rounded-full text-indigo-600">
                      <MoneyIcon />
                    </div>
                    <p className="font-medium text-sm text-gray-700">Earn Money</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

