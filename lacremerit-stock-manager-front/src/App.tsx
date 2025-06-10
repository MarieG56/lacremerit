import "./App.css";
import HeaderMobile from "./components/HeaderMobile";
import HeaderDesktop from "./components/HeaderDesktop";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductsPage from "./pages/Products";
import ProducersPage from "./pages/Producers";

function App() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Header mobile visible uniquement sur petits écrans */}
            <div className="md:hidden">
                <HeaderMobile />
            </div>

            {/* Header desktop (sidebar) visible uniquement à partir de md */}
            <div className="hidden md:block w-50 fixed inset-y-0 left-0 z-40">
                <HeaderDesktop />
            </div>

            {/* Contenu principal avec les routes */}
            <main className="flex-1 p-4 pt-20 transition-all md:ml-52">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/producers" element={<ProducersPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
