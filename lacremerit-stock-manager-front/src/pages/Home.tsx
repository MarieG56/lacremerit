import StockAlerts from "../components/StockAlerts";

export default function Home() {
    const stats = {
        products: 120,
        producers: 30,
        totalStock: 8000,
        lowStock: 5,
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md p-4">
                <h1 className="text-xl font-semibold text-center">
                    Bienvenue sur La Crème Rit
                </h1>
            </header>

            <main className="container mx-auto p-6">
                {/* Statistiques clés */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-medium">Produits</h2>
                        <p className="text-2xl font-bold">{stats.products}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-medium">Producteurs</h2>
                        <p className="text-2xl font-bold">{stats.producers}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-medium">Stock Total</h2>
                        <p className="text-2xl font-bold">
                            {stats.totalStock} KG
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-medium">
                            Produits en Rupture
                        </h2>
                        <p className="text-2xl font-bold">{stats.lowStock}</p>
                    </div>
                </section>

                {/* Alertes dynamiques */}
                <StockAlerts />

                {/* Graphique (optionnel) */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Historique des Ventes
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-500">Graphique à venir...</p>
                    </div>
                </section>

                {/* Raccourcis */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Accès Rapide</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <button className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700">
                            Ajouter un Produit
                        </button>
                        <button className="bg-green-600 text-white p-4 rounded-lg shadow-md hover:bg-green-700">
                            Voir l'Inventaire
                        </button>
                        <button className="bg-yellow-600 text-white p-4 rounded-lg shadow-md hover:bg-yellow-700">
                            Ajouter un Producteur
                        </button>
                    </div>
                </section>

                {/* À venir */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">À Venir</h2>
                    <ul className="list-disc pl-5">
                        <li>
                            Intégration de la fonctionnalité de gestion des prix
                        </li>
                        <li>
                            Tableau de bord personnalisé pour les producteurs
                        </li>
                        <li>Optimisation des rapports de vente</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
