import { useState } from "react";
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
import { User } from "./api/userApi";
function App() {
  // State to control the display of the login modal on first load
  const [showLoginModal, setShowLoginModal] = useState(true);

  // Updated handleLogin: now receives a User object from LoginModal on successful login
  const handleLogin = (user: User) => {
    // For example, log the user and hide the modal
    console.log("Authenticated user:", user);
    setShowLoginModal(false);
  };

  return (
    <>
      {/* Display the login modal if not yet dismissed */}
      {showLoginModal && <LoginModal onSubmit={handleLogin} />}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Mobile header visible only on small screens */}
        <div className="md:hidden">
          <HeaderMobile />
        </div>

        {/* Desktop header (sidebar) visible on md screens and up */}
        <div className="hidden md:block w-50 inset-y-0 left-0 z-40">
          <HeaderDesktop />
        </div>

        {/* Main content with routes */}
        <main className="flex-1 p-4 pt-5 md:pt-20">
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
