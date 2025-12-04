import { useEffect, useState } from 'react';

// Ganti dengan URL API Laravel Anda
const API_BASE_URL = 'http://localhost:8000/api';
// Ganti dengan Client ID Google Anda dari file .env React
// Pastikan file .env Anda memiliki REACT_APP_GOOGLE_CLIENT_ID=...
const GOOGLE_CLIENT_ID = "661627307988-2544sphig1chf2eqbbc9tdctes1822bm.apps.googleusercontent.com";

// Asumsikan Anda punya 'useAuth' hook atau Context untuk menyimpan token
// import { useAuth } from './authContext'; 

const GoogleLoginButton = () => {
    // const { login } = useAuth(); // Ganti dengan fungsi 'login' dari Context Anda
    const [gsiClient, setGsiClient] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    /**
     * Menangani callback ke API backend setelah mendapatkan 'access_token' dari Google.
     */
    const handleApiCallback = async (accessToken) => {
        try {
            // REVISI: Mengirim 'access_token' ke rute /auth/google/login
            const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ access_token: accessToken }),
            });

            const data = await response.json();

            if (response.ok) {
                // SUKSES!
                console.log('Login success:', data);
                // Simpan token dan user, lalu redirect
                // Ganti ini dengan logika state management Anda:
                sessionStorage.setItem('auth_token', data.token);
                sessionStorage.setItem('id', JSON.stringify(data.user.id));
                window.location.href = '/dashboardtest'; // Redirect ke dashboard
                
                // Jika pakai Context:
                // login(data.user, data.token); 
            } else {
                // Tangani error dari backend
                console.error('Backend login failed:', data.message);
                alert('Login Google gagal: ' + (data.message || 'Error tidak diketahui'));
            }
        } catch (error) {
            console.error('API call error:', error);
            alert('Terjadi kesalahan saat menghubungi server.');
        }
    };

    /**
     * Menangani error dari popup Google.
     */
    const handleGoogleError = (error) => {
        console.error('Google Login Error:', error);
        alert('Login dengan Google gagal. ' + (error?.message || ''));
    };
    
    // 1. Muat Google GSI Script secara dinamis
    useEffect(() => {
        // Cek apakah script sudah ada
        if (window.google) {
             setIsScriptLoaded(true);
             return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            setIsScriptLoaded(true);
        };
        script.onerror = () => {
            console.error('Failed to load Google GSI script.');
            alert('Gagal memuat script Google. Silakan segarkan halaman.');
        }
        document.body.appendChild(script);
        
        return () => {
             // Cleanup script jika component unmounts
             if (document.body.contains(script)) {
                 document.body.removeChild(script);
             }
        }
    }, []);

    // 2. Inisialisasi Google Auth Client setelah script dimuat
    useEffect(() => {
        if (isScriptLoaded && window.google && window.google.accounts) {
            try {
                // REVISI: Menggunakan initTokenClient untuk mendapatkan 'access_token'
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: 'email profile openid',
                    // Callback ini dipanggil setelah user login di popup
                    callback: (tokenResponse) => {
                        if (tokenResponse && tokenResponse.access_token) {
                            handleApiCallback(tokenResponse.access_token);
                        } else {
                            handleGoogleError({ message: 'Token response tidak valid.' });
                        }
                    },
                    error_callback: (error) => {
                        handleGoogleError(error);
                    }
                });
                setGsiClient(client);
            } catch (error) {
                 console.error("Failed to initialize GSI client:", error);
            }
        }
    }, [isScriptLoaded]); // Jangan tambahkan GOOGLE_CLIENT_ID di sini jika tidak berubah

    // 3. Fungsi untuk memicu login saat tombol diklik
    const handleLoginClick = () => {
        if (gsiClient) {
            // REVISI: Memanggil requestAccessToken() untuk alur token
            gsiClient.requestAccessToken();
        } else {
            alert('Layanan Google belum siap. Silakan coba lagi sesaat.');
        }
    };

    return (
        <button
            type="button"
            onClick={handleLoginClick} // Panggil fungsi wrapper
            disabled={!gsiClient} // Nonaktifkan tombol jika client belum siap
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ring-1 ring-gray-300 disabled:bg-gray-200"
        >
            {/* SVG Ikon Google */}
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 48 48">
                 <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#fbc02d"></path><path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#e53935"></path><path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4caf50"></path><path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.987,36.69,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1565c0"></path>
            </svg>
            Masuk dengan Google
        </button>
    );
};

export default GoogleLoginButton;