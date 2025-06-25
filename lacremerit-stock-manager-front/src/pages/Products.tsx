import { useEffect, useState } from "react";
import { getAllProducts, Product } from "../api/productApi";
import { Category, getAllCategories } from "../api/categoryApi";
import { getAllProducers, Producer } from "../api/producerApi";
import { getAllSubcategories, Subcategory } from "../api/subcategoryApi";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import AddCategoryModal from "../components/AddCategoryModal";
import AddSubcategoryModal from "../components/AddSubcategoryModal";
import React from "react";

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
    const [showAddProduct, setShowAddProduct] = useState(false);

    const [filters, setFilters] = useState({
        categoryId: "",
        subcategoryId: "",
        producerId: "",
        isActive: "true",
        searchTerm: "",
    });

    const [tempFilters, setTempFilters] = useState(filters);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                productsRes,
                categoriesRes,
                producersRes,
                subcategoriesRes,
            ] = await Promise.all([
                getAllProducts(),
                getAllCategories(),
                getAllProducers(),
                getAllSubcategories(),
            ]);
            let productsData: Product[] = productsRes?.data || [];
            productsData = productsData.sort((a, b) =>
                a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
            );
            const categoriesData = Array.isArray(categoriesRes?.data)
                ? categoriesRes.data
                : [];
            const producersData = Array.isArray(producersRes?.data)
                ? producersRes.data
                : [];
            const subcategoriesData = Array.isArray(subcategoriesRes?.data)
                ? subcategoriesRes.data
                : [];

            setProducts(productsData);
            setFiltered(productsData);
            setCategories(categoriesData);
            setProducers(producersData);
            setSubcategories(subcategoriesData);
        } catch (err) {
            setError("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Apply filters when the button is clicked
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
        if (tempFilters.searchTerm) {
            const term = tempFilters.searchTerm
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            result = result.filter((p) =>
                p.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .startsWith(term)
            );
        }
        setFiltered(result);
        setFilters(tempFilters);
    };

    // Dynamic filtering during input
    useEffect(() => {
        let result = [...products];
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
        if (tempFilters.searchTerm) {
            const term = tempFilters.searchTerm
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            result = result.filter((p) =>
                p.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .startsWith(term)
            );
        }
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

    const handleProductAdded = (newProduct: Product) => {
        const updatedProducts = [...products, newProduct].sort((a, b) =>
            a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
        );
        setProducts(updatedProducts);
        setFiltered(updatedProducts);
    };

    if (loading) {
        return (
            <div className="p-6 w-full max-w-full mx-auto">
                <div className="text-lg mb-4">Chargement des produits...</div>
                <div className="w-full h-4 bg-gray-200 rounded-md overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
            </div>
        );
    }

    const filteredSubcategories = subcategories
        .filter((sc) => {
            if (!tempFilters.categoryId) return true;
            return String(sc.categoryId) === tempFilters.categoryId;
        })
        .sort((a, b) =>
            a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
        );

    // Grouping and sorting by category for display
    const sortedProducts = [...filtered].sort((a, b) => {
        const catA = a.category?.name || "";
        const catB = b.category?.name || "";
        if (catA !== catB) {
            return catA.localeCompare(catB, "fr", { sensitivity: "base" });
        }
        return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
    });

    let lastCategory = "";

    return (
        <div className="min-h-screen bg-gray-100 w-full max-w-full mx-auto">
            <header className="bg-white shadow-md p-4">
                <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center px-1 md:px-3">
                    <h1 className="text-2xl font-bold flex-1 text-center md:text-left">
                        Produits
                    </h1>
                    <div className="flex flex-col gap-2 md:flex-row md:gap-2">
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                            onClick={() => setShowAddProduct(true)}
                        >
                            Ajouter un produit
                        </button>
                        <button
                            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
                            onClick={() => setShowCategoryModal(true)}
                        >
                            Ajouter une catégorie
                        </button>
                        <button
                            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm"
                            onClick={() => setShowSubcategoryModal(true)}
                        >
                            Ajouter une sous-catégorie
                        </button>
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        >
                            Actualiser
                        </button>
                    </div>
                </div>
            </header>
            <main className="p-4 md:p-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded shadow-sm">
                        Erreur : {error}
                    </div>
                )}

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="w-full p-2 border rounded mb-4 bg-white text-sm"
                        value={tempFilters.searchTerm}
                        onChange={(e) =>
                            setTempFilters({
                                ...tempFilters,
                                searchTerm: e.target.value,
                            })
                        }
                    />

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-4 mb-4">
                        <select
                            className="p-2 border rounded bg-white text-sm"
                            value={tempFilters.categoryId}
                            onChange={(e) =>
                                setTempFilters({
                                    ...tempFilters,
                                    categoryId: e.target.value,
                                })
                            }
                        >
                            <option value="">Toutes les catégories</option>
                            {[...categories]
                                .sort((a, b) =>
                                    a.name.localeCompare(b.name, "fr", {
                                        sensitivity: "base",
                                    })
                                )
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>

                        <select
                            className="p-2 border rounded bg-white text-sm"
                            value={tempFilters.subcategoryId}
                            onChange={(e) =>
                                setTempFilters({
                                    ...tempFilters,
                                    subcategoryId: e.target.value,
                                })
                            }
                        >
                            <option value="">Toutes les sous-catégories</option>
                            {filteredSubcategories.map((sc) => (
                                <option key={sc.id} value={sc.id}>
                                    {sc.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="p-2 border rounded bg-white text-sm"
                            value={tempFilters.producerId}
                            onChange={(e) =>
                                setTempFilters({
                                    ...tempFilters,
                                    producerId: e.target.value,
                                })
                            }
                        >
                            <option value="">Toustes les producteurices</option>
                            {[...producers]
                                .sort((a, b) =>
                                    a.name.localeCompare(b.name, "fr", {
                                        sensitivity: "base",
                                    })
                                )
                                .map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                        </select>

                        <select
                            className="p-2 border rounded bg-white text-sm"
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

                    <div className="flex flex-col gap-2 md:flex-row md:gap-2">
                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        >
                            Appliquer les filtres
                        </button>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
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
                    <div className="bg-white rounded-lg shadow-md p-2 md:p-6 overflow-x-auto">
                        <table className="min-w-full table-auto text-sm">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Nom
                                    </th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Unité
                                    </th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Catégorie
                                    </th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Sous-catégorie
                                    </th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Producteur
                                    </th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Statut
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedProducts.map((product) => {
                                    const currentCategory =
                                        product.category?.name || "Sans catégorie";
                                    const showCategoryRow = currentCategory !== lastCategory;
                                    lastCategory = currentCategory;
                                    return (
                                        <React.Fragment key={product.id}>
                                            {showCategoryRow && (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="bg-gray-100 font-bold text-left px-4 py-2 border-t border-b border-gray-300"
                                                    >
                                                        {currentCategory}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className="border-t">
                                                <td className="px-2 py-2 md:px-4 md:py-2 text-left">
                                                    <button
                                                        className="text-blue-500 underline"
                                                        onClick={() =>
                                                            setSelectedProduct(product)
                                                        }
                                                    >
                                                        {product.name}
                                                    </button>
                                                </td>
                                                <td className="px-2 py-2 md:px-4 md:py-2 text-center">
                                                    {product.unit || "-"}
                                                </td>
                                                <td
                                                    className={`px-2 py-2 md:px-4 md:py-2 ${
                                                        product.category?.name
                                                            ? "text-left"
                                                            : "text-center"
                                                    }`}
                                                >
                                                    {product.category?.name || "-"}
                                                </td>
                                                <td
                                                    className={`px-2 py-2 md:px-4 md:py-2 ${
                                                        product.subcategory?.name
                                                            ? "text-left"
                                                            : "text-center"
                                                    }`}
                                                >
                                                    {product.subcategory?.name || "-"}
                                                </td>
                                                <td
                                                    className={`px-2 py-2 md:px-4 md:py-2 ${
                                                        product.producer?.name
                                                            ? "text-left"
                                                            : "text-center"
                                                    }`}
                                                >
                                                    {product.producer?.name || "-"}
                                                </td>
                                                <td className="px-2 py-2 md:px-4 md:py-2 text-center">
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
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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

                <AddProductModal
                    open={showAddProduct}
                    onClose={() => setShowAddProduct(false)}
                    onSuccess={(newProduct) => {
                        handleProductAdded(newProduct);
                        setShowAddProduct(false);
                    }}
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
            </main>
        </div>
    );
}
