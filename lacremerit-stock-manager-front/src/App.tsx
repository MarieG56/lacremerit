import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HeaderMobile from "./components/HeaderMobile";
import HeaderDesktop from "./components/HeaderDesktop";
import Home from "./pages/Home";
import ProductsPage from "./pages/Products";
import ProducersPage from "./pages/Producers";
import InventoryPage from "./pages/Inventory";
import HistoryPage from "./pages/History";
import OrdersPage from "./pages/Orders";
import ClientsPage from "./pages/Clients";
import LoginModal from "./components/LoginModal";
import { User, getUser } from "./api/userApi";
import { setAccessToken } from "./hooks/useApi";
import axios from "axios";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshError, setRefreshError] = useState(false);

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
          setShowLoginModal(true);
          setRefreshError(true);
        }
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          setRefreshError(true);
        }
        setShowLoginModal(true);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    setShowLoginModal(false);
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
      {showLoginModal && <LoginModal onSubmit={handleLogin} />}
      {/* Affiche un message d'erreur si besoin */}
      {refreshError && !showLoginModal && (
        <div className="fixed top-0 left-0 right-0 bg-red-100 text-red-700 text-center py-2 z-50">
          Une erreur inattendue est survenue lors du rafraîchissement de la session.
        </div>
      )}
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="md:hidden">
          <HeaderMobile />
        </div>
        <div className="hidden md:block w-50 inset-y-0 left-0 z-40">
          <HeaderDesktop />
        </div>
        <main className="flex-1 p-4 pt-5 md:pt-20">
          {/* Welcome */}
          {user && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
              Bienvenue, {user.name} !
            </div>
          )}
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
    </>
  );
}

export default App;
