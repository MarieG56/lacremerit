import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { getAllProducers } from "../api/producerApi";
import { getAllClients } from "../api/clientApi";
import { getAllCustomers } from "../api/customerApi";
import AddProductModal from "../components/AddProductModal";
import AddProducerModal from "../components/AddProducerModal";
import AddClientModal from "../components/AddClientModal";
import AddCustomerModal from "../components/AddCustomerModal";
import EditCustomerModal from "../components/EditCustomerModal";
import { Link } from "react-router-dom";
import GetLowStockProducts from "../components/GetLowStockProducts";
import { useLowStockCount } from "../hooks/useLowStockCount";

export default function Home() {
    const [stats, setStats] = useState({
        products: 0,
        producers: 0,
        customers: 0,
        totalStock: 0
    });

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showAddProducer, setShowAddProducer] = useState(false);
    const [showAddClient, setShowAddClient] = useState(false);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showLowStockModal, setShowLowStockModal] = useState(false);
    const [showCustomers, setShowCustomers] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const lowStockCount = useLowStockCount();
    const [error, setError] = useState<string | null>(null);

    // Fetch statistics
    useEffect(() => {
        async function fetchStats() {
            try {
                const [productsRes, producersRes, clientsRes, customersRes] =
                    await Promise.all([
                        getAllProducts(),
                        getAllProducers(),
                        getAllClients(),
                        getAllCustomers()
                    ]);
                const products = productsRes?.data || [];
                const producers = producersRes?.data || [];
                const clients = clientsRes?.data || [];
                const customersData = customersRes?.data || [];
                setStats({
                    products: products.length,
                    producers: producers.length,
                    customers: clients.length + customersData.length,
                    totalStock: 0 
                });
            } catch (err) {
                setError("Erreur lors du chargement des statistiques.");
            }
        }
        fetchStats();
    }, []);

    // Dynamic fetching of store customers
    useEffect(() => {
        if (showCustomers) {
            getAllCustomers()
                .then((res) => {
                    setCustomers(res?.data ?? []);
                })
                .catch(() => {
                    setError("Erreur lors du chargement des client·es magasin.");
                });
        }
    }, [showCustomers]);

    const handleProductAdded = () => setShowAddProduct(false);
    const handleProducerAdded = () => setShowAddProducer(false);
    const handleClientAdded = () => setShowAddClient(false);
    const handleCustomerAdded = () => setShowAddCustomer(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md p-4">
                <h1 className="text-xl font-semibold text-center">
                    Bienvenue sur La Crème Rit
                </h1>
            </header>

            <main className="container mx-auto p-6">
                {/* Key statistics */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-medium">Produits</h2>
                        <p className="text-2xl font-bold">{stats.products}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-medium">Producteurices</h2>
                        <p className="text-2xl font-bold">{stats.producers}</p>
                    </div>
                    <div
                        className="bg-white p-4 rounded-lg shadow-md text-center cursor-pointer hover:bg-red-50 transition"
                        onClick={() => setShowLowStockModal(true)}
                        title="Voir les produits bientôt en rupture"
                    >
                        <h2 className="text-lg font-medium">
                            Produits bientôt en rupture
                        </h2>
                        <p className="text-2xl font-bold">{lowStockCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-medium">Client·es</h2>
                        <p className="text-2xl font-bold">{stats.customers}</p>
                    </div>
                </section>

                {/* Shortcuts */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Accès Rapide</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <button
                            className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                            onClick={() => setShowAddProduct(true)}
                        >
                            Ajouter un produit
                        </button>
                        <button
                            className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                            onClick={() => setShowAddProducer(true)}
                        >
                            Ajouter un·e producteurice
                        </button>
                        <button
                            className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                            onClick={() => setShowAddClient(true)}
                        >
                            Ajouter un·e client·e professionnel·le
                        </button>
                        <button
                            className="bg-violet-600 text-white p-4 rounded-lg shadow-md hover:bg-violet-700 transition-colors"
                            onClick={() => setShowAddCustomer(true)}
                        >
                            Ajouter un·e client·e magasin
                        </button>
                        <button
                            className="bg-violet-600 text-white p-4 rounded-lg shadow-md hover:bg-violet-700 transition-colors"
                            onClick={() => setShowCustomers(true)}
                        >
                            Voir les client·es magasin
                        </button>
                        <Link
                            to="/inventory"
                            className="bg-green-600 text-white p-4 rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                            Voir l'inventaire
                        </Link>
                    </div>
                </section>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded shadow-sm">
                        Erreur : {error}
                    </div>
                )}
            </main>

            {/* Modals */}
            <AddProductModal
                open={showAddProduct}
                onClose={() => setShowAddProduct(false)}
                onSuccess={handleProductAdded}
            />
            <AddProducerModal
                open={showAddProducer}
                onClose={() => setShowAddProducer(false)}
                onSuccess={handleProducerAdded}
            />
            <AddClientModal
                open={showAddClient}
                onClose={() => setShowAddClient(false)}
                onSuccess={handleClientAdded}
            />
            <AddCustomerModal
                open={showAddCustomer}
                onClose={() => setShowAddCustomer(false)}
                onSuccess={handleCustomerAdded}
            />
            <EditCustomerModal
                open={showCustomers}
                customers={customers}
                onClose={() => setShowCustomers(false)}
                onRefresh={() => {
                    getAllCustomers().then((res) =>
                        setCustomers(res?.data ?? [])
                    );
                }}
            />
            {showLowStockModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            onClick={() => setShowLowStockModal(false)}
                            aria-label="Fermer"
                        >
                            ✕
                        </button>
                        <GetLowStockProducts />
                    </div>
                </div>
            )}
        </div>
    );
}
