import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VenueAuth from './pages/VenueAuth';
import VenueDashboard from './pages/VenueDashboard';
import UserClaim from './pages/UserClaim';
import ClaimConfirmation from './pages/ClaimConfirmation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/venue-auth" element={<VenueAuth />} />
              <Route path="/venue-dashboard" element={<VenueDashboard />} />
              <Route path="/claim" element={<UserClaim />} />
              <Route path="/claim-confirmation/:trackingNumber" element={<ClaimConfirmation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;