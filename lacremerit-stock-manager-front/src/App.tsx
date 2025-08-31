import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HeaderMobile from "./components/HeaderMobile";
import HeaderDesktop from "./components/HeaderDesktop";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/Products";
import ProducersPage from "./pages/Producers";
import InventoryPage from "./pages/Inventory";
import HistoryPage from "./pages/History";
import OrdersPage from "./pages/Orders";
import ClientsPage from "./pages/Clients";
import LoginModal from "./components/LoginModal";
import { User, getUser, logoutUser } from "./api/userApi";
import { setAccessToken } from "./hooks/useApi";
import axios from "axios";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshError, setRefreshError] = useState(false);
  // State to control the temporary display of the welcome message
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  // State to control navbar visibility
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (res.data?.access_token) {
          setAccessToken(res.data.access_token);
          let userData = res.data.user;
          if (!userData && res.data.userId) {
            const userRes = await getUser(res.data.userId);
            userData = userRes?.data;
          }
          setUser(userData || null);
          setShowLoginModal(false);
          setRefreshError(false);
        } else {
          // No valid token - user needs to login
          setUser(null);
          setShowLoginModal(false);
          setRefreshError(false);
        }
      } catch (err: any) {
        // Only show error for non-401 errors (network issues, server errors, etc.)
        if (err?.response?.status && err.response.status !== 401) {
          setRefreshError(true);
        } else {
          // 401 or no response - just clear user state
          setUser(null);
          setRefreshError(false);
        }
        setShowLoginModal(false);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    setShowLoginModal(false);
    // Display the welcome message temporarily
    setShowWelcomeMessage(true);
    // Hide the message after 5 seconds (5000 ms)
    setTimeout(() => setShowWelcomeMessage(false), 5000);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setShowLoginModal(true);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleShowLogin = () => {
    setShowNavbar(false);
    setShowLoginModal(true);
  };

  const handleBackToLanding = () => {
    setShowLoginModal(false);
    setShowNavbar(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Chargement...</span>
      </div>
    );
  }

  return (
    <>
      {showLoginModal && <LoginModal onSubmit={handleLogin} onBack={handleBackToLanding} />}
      {/* Error message if needed */}
      {refreshError && !showLoginModal && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 text-yellow-700 text-center py-2 z-50">
          Session expirée. Veuillez vous reconnecter.
        </div>
      )}
      
      {user ? (
        // Authenticated user - show dashboard
        <div className="flex flex-col md:flex-row min-h-screen">
          <div className="md:hidden">
            <HeaderMobile />
          </div>
          <div className="hidden md:block w-50 inset-y-0 left-0 z-40">
            <HeaderDesktop />
          </div>
          <main className="flex-1 p-4 pt-5 md:pt-20">
            {/* Header with user info and logout */}
            <div className="flex justify-between items-center mb-6">
              <div>
                {showWelcomeMessage && (
                  <div className="p-2 bg-green-100 text-green-700 rounded">
                    Bienvenue, {user.name} !
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/producers" element={<ProducersPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Routes>
          </main>
        </div>
      ) : (
        // Non-authenticated user - show landing page
        <Routes>
          <Route path="/" element={<LandingPage onShowLogin={handleShowLogin} showNavbar={showNavbar} />} />
          <Route path="/home" element={<LandingPage onShowLogin={handleShowLogin} showNavbar={showNavbar} />} />
          <Route path="/products" element={<LandingPage onShowLogin={handleShowLogin} showNavbar={showNavbar} />} />
          <Route path="/clients" element={<LandingPage onShowLogin={handleShowLogin} showNavbar={showNavbar} />} />
          <Route path="/producers" element={<LandingPage onShowLogin={handleShowLogin} showNavbar={showNavbar} />} />
          <Route path="/inventory" element={<LandingPage onShowLogin={handleShowLogin} showNavbar={showNavbar} />} />
          <Route path="/history" element={<LandingPage onShowLogin={handleShowLogin} showNavbar={showNavbar} />} />
          <Route path="/orders" element={<LandingPage onShowLogin={handleShowLogin} showNavbar={showNavbar} />} />
        </Routes>
      )}
    </>
  );
}

export default App;
