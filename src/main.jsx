import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={"661627307988-2544sphig1chf2eqbbc9tdctes1822bm.apps.googleusercontent.com"}
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
