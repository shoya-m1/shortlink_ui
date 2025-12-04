// import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// --- Komponen Ikon (SVG) ---
// Ikon untuk 'like'
const HeartIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

// Ikon untuk 'bookmark'
const BookmarkIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

// --- Komponen Header ---
const BlogHeader = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-800">Blog Saya</div>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-blue-500">Home</a>
                    <a href="#" className="text-gray-600 hover:text-blue-500">Artikel</a>
                    <a href="#" className="text-gray-600 hover:text-blue-500">Tentang</a>
                    <a href="#" className="text-gray-600 hover:text-blue-500">Kontak</a>
                </div>
            </nav>
        </header>
    );
};


// --- Komponen Detail Postingan Blog ---
const BlogPost = () => {

    // const { code } = useParams();
    const [countdown, setCountdown] = useState(7);
    const [canContinue, setCanContinue] = useState(false);
    const [shortId, setShortId] = useState(null);
    const [token, setToken] = useState(null);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pw, setPw] = useState("");
    const [pwHendlers, setPwHendlers] = useState(false);
    const [requiresPassword, setRequiresPassword] = useState(false);



    // useEffect(() => {
    //     if (code) {
    //         // Simpan shortlink ke sessionStorage
    //         sessionStorage.setItem("shortlink", code);

    //         // Ubah URL di address bar tanpa reload
    //         const cleanUrl = window.location.origin + "/blog";
    //         window.history.replaceState({}, "", cleanUrl);
    //     }
    // }, [code]);

    useEffect(() => {
        const id = sessionStorage.getItem("shortlink");
        setShortId(id);

        // 🔥 GET STORED TOKEN 🔥
        const storedToken = sessionStorage.getItem("link_token");
        const pwRequired = sessionStorage.getItem("link_pw_required");

        if (storedToken) {
            setToken(storedToken);
            if (pwRequired) setRequiresPassword(true);
        } else {
            // Fallback if user skipped blog1 (optional: redirect back)
            console.warn("No token found, redirecting...");
            // window.location.href = "/"; 
        }
    }, []);

    // Removed fetchLinkData since we use stored token

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


    useEffect(() => {
        console.log("State token berubah:", token);
    }, [token]);



    function handleContinue() {
        // Navigate to Final Page
        window.location.href = "/go";
    }

    function handleContinuePw() {
        // Navigate to Final Page (Password will be handled there)
        window.location.href = "/go";
    }


    async function handleContinuePw(passwordInput = null) {
        try {
            const currentToken = token;
            // console.log(result.requires_password)

            if (!token) {
                console.warn("Token belum tersedia, tunggu sebentar...");
                return; // atau tampilkan alert/error
            }

            const res = await fetch(`http://127.0.0.1:8000/api/links/${shortId}/continue`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: currentToken,
                    ...(passwordInput && { password: passwordInput }),
                }),
            });

            // Tangani error HTTP
            if (!res.ok) {
                const errText = await res.text();
                console.error("Fetch error:", errText);
                throw new Error(`Request failed: ${res.status}`);
            }

            const result = await res.json();
            console.log("Continue result:", result);

            // ✅ Ganti 'data' dengan 'result'

            // Redirect ke original_url (kalau ada)
            if (result.original_url) {
                window.open(result.original_url, "_blank");
            }

            // Buka tab iklan (kalau ada)
            if (result.ad_url) {
                window.location.assign(result.ad_url);
            }

        } catch (error) {
            console.error("handleContinue error:", error);
        }
    }



    // 🔹 Fungsi untuk validasi link
    // const handleContinue = async (passwordInput = null) => {
    //     setLoading(true);
    //     setError("");

    //     try {
    //         const res = await fetch(`http://127.0.0.1:8000/api/links/${code}/continue`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 token: token,
    //                 ...(passwordInput && { password: passwordInput }),
    //             }),
    //         });

    //         const data = await res.json();
    //         console.log(data)

    //         if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

    //         if (data.requires_password) {
    //             setRequiresPassword(true);
    //             return;
    //         }

    //         if (data.original_url) {
    //             setRedirectUrl(data.original_url);
    //             window.location.href = data.original_url;
    //             return;
    //         }

    //         setError("Respons tidak valid dari server");
    //     } catch (err) {
    //         setError(err.message || "Gagal memproses permintaan");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        // if (!token) return setError("Token tidak ditemukan");
        console.log(e.password)
        await handleContinuePw(pw);
    };

    return (
        <article>
            {/* Judul dan Kategori */}
            <div className="mb-4">
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">TEKNOLOGI</span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                    Menguasai React dalam 30 Hari: Panduan untuk Pemula
                </h1>
            </div>

            {/* Info Penulis */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
                <img
                    src="https://placehold.co/40x40/E2E8F0/4A5568?text=A"
                    alt="Avatar Penulis"
                    className="w-10 h-10 rounded-full mr-3"
                />
                <span>
                    Oleh <a href="#" className="font-semibold text-gray-700 hover:underline">Andi Pratama</a>
                </span>
                <span className="mx-2">•</span>
                <span>3 Oktober 2025</span>
                <span className="mx-2">•</span>
                <span>8 menit baca</span>
            </div>
            {shortId && (
                <div className="py-4 my-3 flex items-center justify-center">
                    <div className="ring-2 ring-gray-500 rounded-lg px-7 py-2">
                        {!canContinue ? (
                            <p className="text-gray-600">Tunggu {countdown} detik...</p>
                        ) : (
                            <button
                                className="text-gray-600"
                                onClick={handleContinue}
                            >
                                Continue
                            </button>
                        )}
                    </div>

                </div>
            )
            }


            {/* Gambar Utama */}
            <img
                src="https://placehold.co/1200x600/3B82F6/FFFFFF?text=ReactJS+Code"
                alt="Gambar Artikel Blog"
                className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8"
            />



            {/* Konten Artikel */}
            <div className="prose max-w-none text-gray-700 text-lg leading-relaxed">
                <p>
                    Selamat datang di panduan "Menguasai React dalam 30 Hari". Jika Anda seorang pengembang web yang ingin meningkatkan keterampilan atau pemula yang baru memulai perjalanan di dunia frontend, React adalah library JavaScript yang wajib Anda pelajari.
                </p>
                <p>
                    React, yang dikembangkan oleh Facebook, memungkinkan kita membangun antarmuka pengguna (UI) yang interaktif dan dapat digunakan kembali dengan mudah. Konsep utamanya adalah komponen, yang seperti balok LEGO untuk membangun aplikasi web modern.
                </p>
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">
                    "Kunci untuk belajar React adalah memahami alur data satu arah dan bagaimana state dan props bekerja bersama."
                </blockquote>
                <p>
                    Dalam seri ini, kita akan membahas semua konsep fundamental, mulai dari JSX, komponen, state, props, hingga konsep yang lebih lanjut seperti Hooks (useState, useEffect), Context API untuk manajemen state, dan React Router untuk navigasi.
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Apa itu JSX?</h3>
                <p>
                    JSX (JavaScript XML) adalah ekstensi sintaks untuk JavaScript yang terlihat sangat mirip dengan HTML. Ini memungkinkan Anda menulis struktur UI langsung di dalam kode JavaScript Anda, membuatnya lebih intuitif dan mudah dibaca.
                </p>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>
                        {`const element = <h1>Halo, dunia!</h1>;`}
                    </code>
                </pre>
                <p>
                    Meskipun terlihat seperti HTML, kode di atas sebenarnya adalah JavaScript. Browser tidak memahaminya secara langsung, jadi kita memerlukan transpiler seperti Babel untuk mengubahnya menjadi kode JavaScript biasa.
                </p>
            </div>

            {/* Tombol Interaksi */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t">
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-200">
                        <HeartIcon className="w-6 h-6" />
                        <span className="font-semibold">125 Suka</span>
                    </button>
                </div>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                    <BookmarkIcon className="w-6 h-6" />
                    <span className="font-semibold">Simpan</span>
                </button>
            </div>

        </article>
    );
};

// --- Komponen Bagian Komentar ---
const CommentSection = () => {
    // Data komentar dummy
    const initialComments = [
        { id: 1, user: 'Kimak', avatar: 'https://placehold.co/40x40/CBD5E0/4A5568?text=B', text: 'Artikel yang sangat membantu! Terima kasih sudah berbagi.', time: '2 jam yang lalu' },
        { id: 2, user: 'Njayy', avatar: 'https://placehold.co/40x40/FBBF24/4A5568?text=C', text: 'Penjelasannya mudah dipahami, terutama bagian JSX. Ditunggu kelanjutannya!', time: '1 jam yang lalu' },
    ];

    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            const newCommentObj = {
                id: comments.length + 1,
                user: 'Anda',
                avatar: 'https://placehold.co/40x40/9AE6B4/4A5568?text=Y',
                text: newComment,
                time: 'Baru saja'
            };
            setComments([...comments, newCommentObj]);
            setNewComment('');
        }
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {comments.length} Komentar
            </h2>

            {/* Form Tambah Komentar */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex items-start space-x-4">
                    <img
                        src="https://placehold.co/40x40/9AE6B4/4A5568?text=Y"
                        alt="Your Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                            rows="3"
                            placeholder="Tulis komentar Anda..."
                        ></textarea>
                        <button
                            type="submit"
                            className="mt-3 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Kirim Komentar
                        </button>
                    </div>
                </div>
            </form>

            {/* Daftar Komentar */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-4">
                        <img src={comment.avatar} alt={`Avatar ${comment.user}`} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-gray-800">{comment.user}</span>
                                    <span className="text-xs text-gray-500">{comment.time}</span>
                                </div>
                                <p className="text-gray-700">{comment.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Komponen Footer ---
const BlogFooter = () => {
    return (
        <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto px-6 py-8 text-center">
                <p>&copy; {new Date().getFullYear()} Blog Saya. Dibuat dengan menggunakan React & Tailwind CSS.</p>
            </div>
        </footer>
    );
}

// --- Komponen Utama Aplikasi ---
export default function BLogSection() {
    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <BlogHeader />
            <main className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                    <BlogPost />
                    <CommentSection />
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}

