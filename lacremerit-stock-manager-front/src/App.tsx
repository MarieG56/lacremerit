import "./App.css";
import HeaderMobile from "./components/HeaderMobile";
import HeaderDesktop from "./components/HeaderDesktop";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductsPage from "./pages/Products";
import ProducersPage from "./pages/Producers";
import InventoryPage from "./pages/Inventory";
import HistoryPage from "./pages/History";
import OrdersPage from "./pages/Orders";
import ClientsPage from "./pages/Clients";

function App() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Header mobile visible uniquement sur petits écrans */}
            <div className="md:hidden">
                <HeaderMobile />
            </div>

            {/* Header desktop (sidebar) visible uniquement à partir de md */}
            <div className="hidden md:block w-50 inset-y-0 left-0 z-40">
                <HeaderDesktop />
            </div>

            {/* Contenu principal avec les routes */}
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
    );
}

export default App;
