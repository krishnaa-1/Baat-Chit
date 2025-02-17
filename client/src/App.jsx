import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import AuthPage from './AuthPage';
import { Auth0Provider } from '@auth0/auth0-react';
import ProfileSetup from './ProfileSetup';
import '@fontsource/urbanist'; // Defaults to all weights/styles


const App = () => (
  <Auth0Provider
    domain="dev-vxpc43l67ox3t6ln.us.auth0.com"
    clientId="bo9M3JEnDrq7iuA6c9tLyKGoph2ps98I"
    authorizationParams={{
        redirect_uri: `${window.location.origin}/login`,
    }}
  >
      <Routes>
        {/* Redirect from / to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/profile/:username/:userId" element={<ProfileSetup />} />
        <Route path="/home/:username/:userId" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  </Auth0Provider>
);

export default App;
