import { useEffect, useState, useCallback } from "react";
import { getAllProducts, Product } from "../api/productApi";
import { getAllProductsHistory, ProductHistory } from "../api/productHistory";

// Format a date in French
function formatDateLongFr(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function HistoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [history, setHistory] = useState<ProductHistory[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch products on load
    useEffect(() => {
        getAllProducts()
            .then((res) =>
                setProducts(res && res.data ? res.data : [])
            )
            .catch(() => setProducts([]));
    }, []);

    // Function to select a product and load its history
    const handleSelectProduct = useCallback(async (product: Product) => {
        setSelectedProduct(product);
        setLoading(true);
        try {
            const res = await getAllProductsHistory();
            const allHistory: ProductHistory[] = res && res.data ? res.data : [];
            const productHistory = allHistory
                .filter(h => h.productId === product.id)
                .sort((a, b) => {
                    const aDate =
                        typeof a.weekStartDate === "string"
                            ? a.weekStartDate
                            : a.weekStartDate instanceof Date
                            ? a.weekStartDate.toISOString()
                            : "";
                    const bDate =
                        typeof b.weekStartDate === "string"
                            ? b.weekStartDate
                            : b.weekStartDate instanceof Date
                            ? b.weekStartDate.toISOString()
                            : "";
                    // Descending order (most recent first)
                    return bDate.localeCompare(aDate);
                });
            setHistory(productHistory);
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter products based on the search term
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 w-full max-w-full mx-auto">
            <div className="p-4 md:p-8">
                <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
                    Historique des produits
                </h1>
                <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:items-center mb-4">
                    <input
                        type="text"
                        className="p-2 border rounded w-full md:w-64 text-sm"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        className="p-2 border rounded w-full md:w-64 text-sm"
                        value={selectedProduct?.id || ""}
                        onChange={e => {
                            const prod = products.find(p => String(p.id) === e.target.value);
                            if (prod) {
                                handleSelectProduct(prod);
                            }
                        }}
                    >
                        <option value="">Sélectionner un produit</option>
                        {filteredProducts.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedProduct && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-center md:text-left">
                            {selectedProduct.name}
                        </h2>
                        {loading ? (
                            <div>Chargement...</div>
                        ) : history.length === 0 ? (
                            <div className="bg-white rounded shadow p-4 text-center text-gray-500">
                                Aucun historique trouvé.
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-2 md:p-6 overflow-x-auto">
                                <table className="min-w-full table-auto text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-2 py-2 md:px-4 md:py-2 border-b text-center">Semaine</th>
                                            <th className="px-2 py-2 md:px-4 md:py-2 border-b text-center">Reçue</th>
                                            <th className="px-2 py-2 md:px-4 md:py-2 border-b text-center">Vendue</th>
                                            <th className="px-2 py-2 md:px-4 md:py-2 border-b text-center">Invendue</th>
                                            <th className="px-2 py-2 md:px-4 md:py-2 border-b text-center">Prix</th>
                                            <th className="px-2 py-2 md:px-4 md:py-2 border-b text-center">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map(h => {
                                            // Convert weekStartDate to a date string (YYYY-MM-DD)
                                            const week =
                                                typeof h.weekStartDate === "string"
                                                    ? h.weekStartDate.split("T")[0]
                                                    : h.weekStartDate instanceof Date
                                                    ? h.weekStartDate.toISOString().split("T")[0]
                                                    : "";
                                            return (
                                                <tr key={h.id || week}>
                                                    <td className="px-2 py-2 md:px-4 md:py-2 border-b">
                                                        {formatDateLongFr(week)}
                                                    </td>
                                                    <td className="px-2 py-2 md:px-4 md:py-2 border-b text-center">
                                                        {h.receivedQuantity}
                                                    </td>
                                                    <td className="px-2 py-2 md:px-4 md:py-2 border-b text-center">
                                                        {h.soldQuantity}
                                                    </td>
                                                    <td className="px-2 py-2 md:px-4 md:py-2 border-b text-center">
                                                        {h.unsoldQuantity}
                                                    </td>
                                                    <td className="px-2 py-2 md:px-4 md:py-2 border-b text-center">
                                                        {h.price ?? ""}
                                                    </td>
                                                    <td className="px-2 py-2 md:px-4 md:py-2 border-b text-center">
                                                        {h.description ?? ""}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}