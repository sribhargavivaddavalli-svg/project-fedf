import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CitizenDashboard from './pages/CitizenDashboard';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="citizen">
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute role="citizen">
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;