import { useEffect, useState } from "react";
import { getAllProducts, Product } from "../api/productApi";
import { Category, getAllCategories } from "../api/categoryApi";
import { getAllProducers, Producer } from "../api/producerApi";
import { getAllSubcategories, Subcategory } from "../api/subcategoryApi";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import AddCategoryModal from "../components/AddCategoryModal";
import AddSubcategoryModal from "../components/AddSubcategoryModal";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);

    const [filters, setFilters] = useState({
        categoryId: "",
        subcategoryId: "",
        producerId: "",
        isActive: "all",
        searchTerm: "",
    });

    const [tempFilters, setTempFilters] = useState(filters);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [productsRes, categoriesRes, producersRes, subcategoriesRes] =
                await Promise.all([
                    getAllProducts(),
                    getAllCategories(),
                    getAllProducers(),
                    getAllSubcategories(),
                ]);

            let productsData = productsRes?.data || [];
            productsData = productsData.sort((a: Product, b: Product) =>
                a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
            );
            const categoriesData = categoriesRes?.data || [];
            const subcategoriesData = subcategoriesRes?.data || [];
            const producersData = producersRes?.data || [];

            setProducts(productsData);
            setFiltered(productsData);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            setProducers(Array.isArray(producersData) ? producersData : []);
            setSubcategories(
                Array.isArray(subcategoriesData) ? subcategoriesData : []
            );
        } catch (err) {
            console.error("Erreur globale de chargement :", err);
            setError("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Appliquer les filtres uniquement quand on clique sur le bouton
    const applyFilters = () => {
        let result = [...products];

        if (tempFilters.categoryId) {
            result = result.filter(
                (p) => p.category?.id === Number(tempFilters.categoryId)
            );
        }

        if (tempFilters.subcategoryId) {
            result = result.filter(
                (p) => p.subcategory?.id === Number(tempFilters.subcategoryId)
            );
        }

        if (tempFilters.producerId) {
            result = result.filter(
                (p) => p.producer?.id === Number(tempFilters.producerId)
            );
        }

        if (tempFilters.isActive !== "all") {
            result = result.filter(
                (p) => p.isActive === (tempFilters.isActive === "true")
            );
        }

        setFiltered(result);
        setFilters(tempFilters);
    };

    // Dynamique : filtre la liste selon searchTerm à chaque frappe
    useEffect(() => {
        let result = [...products];

        // Applique les filtres déjà actifs (ceux du bouton)
        if (filters.categoryId) {
            result = result.filter(
                (p) => p.category?.id === Number(filters.categoryId)
            );
        }
        if (filters.subcategoryId) {
            result = result.filter(
                (p) => p.subcategory?.id === Number(filters.subcategoryId)
            );
        }
        if (filters.producerId) {
            result = result.filter(
                (p) => p.producer?.id === Number(filters.producerId)
            );
        }
        if (filters.isActive !== "all") {
            result = result.filter(
                (p) => p.isActive === (filters.isActive === "true")
            );
        }

        // Recherche dynamique
        if (tempFilters.searchTerm) {
            const term = tempFilters.searchTerm.toLowerCase();
            result = result.filter((p) =>
                p.name.toLowerCase().startsWith(term)
            );
        }

        // Trie la liste filtrée par nom
        result = result.sort((a, b) =>
            a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
        );

        setFiltered(result);
    }, [
        products,
        filters.categoryId,
        filters.subcategoryId,
        filters.producerId,
        filters.isActive,
        tempFilters.searchTerm,
    ]);

    const resetFilters = () => {
        setTempFilters({
            categoryId: "",
            subcategoryId: "",
            producerId: "",
            isActive: "all",
            searchTerm: "",
        });
        setFiltered(products);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-lg mb-4">Chargement des produits...</div>
                <div className="w-full h-4 bg-gray-200 rounded-md overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
            </div>
        );
    }

    // Ajoute ce handler pour l'ajout direct
    const handleProductAdded = (newProduct: Product) => {
        // Ajoute le produit, puis trie la liste
        const updatedProducts = [...products, newProduct].sort((a, b) =>
            a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
        );
        setProducts(updatedProducts);
        setFiltered(updatedProducts);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Produits</h1>
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                        onClick={() => setShowCategoryModal(true)}
                    >
                        Ajouter une catégorie
                    </button>
                    <button
                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                        onClick={() => setShowSubcategoryModal(true)}
                    >
                        Ajouter une sous-catégorie
                    </button>
                    {/* Passe le handler à la modale */}
                    <AddProductModal onSuccess={handleProductAdded} />
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Actualiser
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded shadow-sm">
                    Erreur : {error}
                </div>
            )}

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="w-full p-2 border rounded mb-4"
                    value={tempFilters.searchTerm}
                    onChange={(e) =>
                        setTempFilters({
                            ...tempFilters,
                            searchTerm: e.target.value,
                        })
                    }
                />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                    <select
                        className="p-2 border rounded"
                        value={tempFilters.categoryId}
                        onChange={(e) =>
                            setTempFilters({
                                ...tempFilters,
                                categoryId: e.target.value,
                            })
                        }
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="p-2 border rounded"
                        value={tempFilters.subcategoryId}
                        onChange={(e) =>
                            setTempFilters({
                                ...tempFilters,
                                subcategoryId: e.target.value,
                            })
                        }
                    >
                        <option value="">Toutes les sous-catégories</option>
                        {subcategories.map((sc) => (
                            <option key={sc.id} value={sc.id}>
                                {sc.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="p-2 border rounded"
                        value={tempFilters.producerId}
                        onChange={(e) =>
                            setTempFilters({
                                ...tempFilters,
                                producerId: e.target.value,
                            })
                        }
                    >
                        <option value="">Tous les producteurs</option>
                        {producers.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="p-2 border rounded"
                        value={tempFilters.isActive}
                        onChange={(e) =>
                            setTempFilters({
                                ...tempFilters,
                                isActive: e.target.value,
                            })
                        }
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="true">Actifs</option>
                        <option value="false">Inactifs</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={applyFilters}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Appliquer les filtres
                    </button>
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded shadow-sm">
                    Aucun produit trouvé.
                </div>
            ) : (
                <table className="min-w-full table-auto bg-white shadow-md rounded-md">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-4 py-2 border-b">Nom</th>
                            <th className="px-4 py-2 border-b">Catégorie</th>
                            <th className="px-4 py-2 border-b">
                                Sous-catégorie
                            </th>
                            <th className="px-4 py-2 border-b">Producteur</th>
                            <th className="px-4 py-2 border-b">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((product) => (
                            <tr key={product.id}>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        className="text-blue-500 underline"
                                        onClick={() =>
                                            setSelectedProduct(product)
                                        }
                                    >
                                        {product.name}
                                    </button>
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {product.category?.name || "Non renseignée"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {product.subcategory?.name ||
                                        "Non renseignée"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {product.producer?.name || "Non renseigné"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    <span
                                        className={`inline-block px-2 py-1 rounded ${
                                            product.isActive
                                                ? "bg-green-100 text-green-500"
                                                : "bg-red-100 text-red-500"
                                        }`}
                                    >
                                        {product.isActive ? "Actif" : "Inactif"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <EditProductModal
                product={selectedProduct}
                categories={categories}
                subcategories={subcategories}
                producers={producers}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onRefresh={fetchData}
            />

            <AddCategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onSuccess={fetchData}
            />
            <AddSubcategoryModal
                isOpen={showSubcategoryModal}
                onClose={() => setShowSubcategoryModal(false)}
                onSuccess={fetchData}
            />
        </div>
    );
}
