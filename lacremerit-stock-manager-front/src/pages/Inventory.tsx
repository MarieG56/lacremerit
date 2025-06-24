import { useEffect, useState, useCallback } from "react";
import { getAllProducts, Product } from "../api/productApi";
import {
    getAllProductsHistory,
    postProductHistory,
    updateProductHistory,
    ProductHistory,
} from "../api/productHistory";
import { getAllCategories, Category } from "../api/categoryApi";
import { getAllProducers, Producer } from "../api/producerApi";
import React from "react";

// Format the date in DD-MM-YYYY format
function formatLocalDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Returns the Monday of the current week
function getCurrentMonday(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
}

// Format for saving the weekStartDate
const formatWeekStartDate = (dateInput: string | Date) => {
    if (typeof dateInput === "string" && !dateInput.includes("T")) {
        return dateInput + "T00:00:00Z";
    }
    if (typeof dateInput === "string" && dateInput.includes("T")) {
        const dateOnly = dateInput.split("T")[0];
        return dateOnly + "T00:00:00Z";
    }
    if (dateInput instanceof Date) {
        const dateOnly = dateInput.toISOString().split("T")[0];
        return dateOnly + "T00:00:00Z";
    }
    const dateOnly = new Date().toISOString().split("T")[0];
    return dateOnly + "T00:00:00Z";
};

function getWeekInputValue(date: Date) {
    const year = date.getFullYear();
    // Calculate the ISO week number
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    const weekNo =
        1 +
        Math.round(
            ((tempDate.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
                7
        );
    return `${year}-W${String(weekNo).padStart(2, "0")}`;
}

// Calculate the Monday of a selected ISO week
function handleWeekChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setSelectedMonday: (d: Date) => void
) {
    const [yearStr, weekStr] = e.target.value.split("-W");
    const year = Number(yearStr);
    const week = Number(weekStr);
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const firstWeekMonday = new Date(jan4);
    firstWeekMonday.setDate(jan4.getDate() - jan4Day + 1);
    const monday = new Date(firstWeekMonday.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
    monday.setHours(0, 0, 0, 0);
    console.log("Sélection semaine:", monday);
    setSelectedMonday(monday);
}

export default function InventoryPage() {
    // Selected week (initialized to the Monday of the current week)
    const [selectedMonday, setSelectedMonday] = useState<Date>(getCurrentMonday());

    const [products, setProducts] = useState<Product[]>([]);
    const [history, setHistory] = useState<Record<number, ProductHistory>>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [producerFilter, setProducerFilter] = useState<string>("");
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<string>("");
    const [showSort, setShowSort] = useState(false);

    // Function to fetch inventory data
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [productsRes, categoriesRes, producersRes, historyRes] =
                await Promise.all([
                    getAllProducts(),
                    getAllCategories(),
                    getAllProducers(),
                    getAllProductsHistory(),
                ]);
            const allProducts: Product[] = productsRes?.data || [];
            const activeProducts = allProducts.filter((p) => p.isActive);

            setCategories(categoriesRes?.data || []);
            setProducers(producersRes?.data || []);

            const allHistory: ProductHistory[] = historyRes?.data || [];

            // Determine the desired week by applying an offset (e.g., +5 days)
            const desiredWeekStr = new Date(selectedMonday.getTime() + 5 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0];
            // Filter the history for the desired week
            const weekHistory = allHistory.filter((h) => {
                const hWeek =
                    typeof h.weekStartDate === "string"
                        ? h.weekStartDate.split("T")[0]
                        : h.weekStartDate instanceof Date
                        ? h.weekStartDate.toISOString().split("T")[0]
                        : "";
                return hWeek === desiredWeekStr;
            });

            // Build a history map for each active product
            const historyMap: Record<number, ProductHistory> = {};
            activeProducts.forEach((product) => {
                let defaultReceived = 0;
                const prodCatId = product.categoryId ?? product.category?.id;
                // For certain categories, the default received quantity comes from the previous week
                if (prodCatId !== undefined && [8, 10, 11].includes(prodCatId)) {
                    // The previous week (shift by -2 days)
                    const previousWeekDate = new Date(selectedMonday.getTime() - 2 * 24 * 60 * 60 * 1000);
                    const previousWeekStr = previousWeekDate.toISOString().split("T")[0];
                    const prevHistory = allHistory.find((h) => {
                        const hWeek =
                            typeof h.weekStartDate === "string"
                                ? h.weekStartDate.split("T")[0]
                                : h.weekStartDate instanceof Date
                                ? h.weekStartDate.toISOString().split("T")[0]
                                : "";
                        return h.productId === product.id && hWeek === previousWeekStr;
                    });
                    if (prevHistory) {
                        defaultReceived = prevHistory.unsoldQuantity;
                    }
                }
                const h = weekHistory.find((h) => h.productId === product.id);
                historyMap[product.id] = h || {
                    productId: product.id,
                    weekStartDate: formatWeekStartDate(selectedMonday),
                    receivedQuantity: defaultReceived,
                    soldQuantity: 0,
                    unsoldQuantity: 0,
                    price: undefined,
                    description: "",
                };
            });

            setProducts(activeProducts);
            setHistory(historyMap);
        } catch (err) {
            setError("Erreur lors du chargement de l'inventaire.");
        } finally {
            setLoading(false);
        }
    }, [selectedMonday]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Track modified products
    const [modifiedProducts, setModifiedProducts] = useState<Set<number>>(new Set());

    const handleChange = (
        productId: number,
        field: keyof ProductHistory,
        value: any
    ) => {
        setHistory((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]:
                    field === "receivedQuantity" ||
                    field === "soldQuantity" ||
                    field === "unsoldQuantity" ||
                    field === "price"
                        ? Number(value)
                        : value,
            },
        }));
        setModifiedProducts((prev) => new Set(prev).add(productId));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            for (const productId of modifiedProducts) {
                const h = history[productId];
                if (h && h.receivedQuantity && h.receivedQuantity !== 0) {
                    const payload = {
                        productId: h.productId,
                        weekStartDate:
                            typeof h.weekStartDate === "string"
                                ? (h.weekStartDate.includes("T")
                                      ? h.weekStartDate
                                      : new Date(h.weekStartDate + "T00:00:00.000Z").toISOString())
                                : h.weekStartDate instanceof Date
                                ? h.weekStartDate.toISOString()
                                : new Date().toISOString(),
                        receivedQuantity: Number(h.receivedQuantity) || 0,
                        soldQuantity: Number(h.soldQuantity) || 0,
                        unsoldQuantity: Number(h.unsoldQuantity) || 0,
                        price:
                            h.price !== undefined &&
                            (typeof h.price === "string"
                                ? h.price !== ""
                                : true)
                                ? Number(h.price)
                                : undefined,
                        description: h.description ?? "",
                    };

                    if (h.id && h.id !== 0) {
                        await updateProductHistory(h.id, payload);
                    } else {
                        await postProductHistory(payload);
                    }
                }
            }
            setModifiedProducts(new Set());
            await fetchData();
        } catch (err: any) {
            setError(
                err?.response?.data?.message || "Erreur lors de la sauvegarde."
            );
            console.error("API error details:", err?.response?.data);
        } finally {
            setSaving(false);
        }
    };

    // Filtering by category and producer
    const filteredProducts = products.filter((product) => {
        const matchCategory = categoryFilter
            ? String(product.category?.id) === categoryFilter
            : true;
        const matchProducer = producerFilter
            ? String(product.producer?.id) === producerFilter
            : true;
        return matchCategory && matchProducer;
    });

    // Calculate the end date of the week
    const weekEnd = new Date(selectedMonday);
    weekEnd.setDate(weekEnd.getDate() + 6);

    if (loading) {
        return (
            <div className="p-6 w-full max-w-full mx-auto">
                <div className="text-lg mb-4">Chargement de l'inventaire...</div>
                <div className="w-full h-4 bg-gray-200 rounded-md overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 w-full max-w-full mx-auto">
            <header className="bg-white shadow-md p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-1 md:px-3">
                    <h1 className="text-2xl font-bold flex-1 text-center md:text-left">
                        Inventaire de la semaine du {formatLocalDate(selectedMonday)}
                    </h1>
                    <div className="flex items-center gap-2">
                        <label htmlFor="week-select" className="font-semibold">
                            Semaine :
                        </label>
                        <input
                            id="week-select"
                            type="week"
                            value={getWeekInputValue(selectedMonday)}
                            onChange={(e) => handleWeekChange(e, setSelectedMonday)}
                            className="border rounded px-2 py-1 text-sm"
                        />
                        <span className="text-xs md:text-base">
                            {selectedMonday.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </header>
            <main className="p-4 md:p-6">
                {/* Filters and sorting */}
                <div className="flex flex-col gap-2 md:flex-row md:gap-4 mb-6">
                    {showFilters && (
                        <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:items-center">
                            <select
                                className="p-2 border rounded bg-white text-sm"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="p-2 border rounded bg-white text-sm"
                                value={producerFilter}
                                onChange={(e) => setProducerFilter(e.target.value)}
                            >
                                <option value="">Tous les producteurs</option>
                                {producers.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                                onClick={() => {
                                    setCategoryFilter("");
                                    setProducerFilter("");
                                    setShowFilters(false);
                                }}
                            >
                                Réinitialiser
                            </button>
                        </div>
                    )}
                    {showSort && (
                        <div className="flex flex-col gap-2 md:flex-row md:gap-2 md:items-center">
                            <select
                                className="p-2 border rounded bg-white text-sm"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="">Tous les produits</option>
                                <option value="category">Catégorie</option>
                                <option value="producer">Producteur</option>
                            </select>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                                onClick={() => {
                                    setSortBy("");
                                    setShowSort(false);
                                }}
                            >
                                Réinitialiser
                            </button>
                        </div>
                    )}
                </div>
                {error && <div className="mb-4 text-red-600">{error}</div>}
                <div className="bg-white rounded-lg shadow-md p-2 md:p-6 overflow-x-auto">
                    <table className="min-w-full table-auto text-sm">
                        <thead>
                            <tr>
                                <th className="px-2 py-2 md:px-4 md:py-2 text-center">Produit</th>
                                <th className="px-2 py-2 md:px-4 md:py-2 text-center">Quantité reçue</th>
                                <th className="px-2 py-2 md:px-4 md:py-2 text-center">Quantité vendue</th>
                                <th className="px-2 py-2 md:px-4 md:py-2 text-center">Quantité invendue</th>
                                <th className="px-2 py-2 md:px-4 md:py-2 text-center">Prix</th>
                                <th className="px-2 py-2 md:px-4 md:py-2 text-center">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                let groupBy = "category";
                                if (sortBy === "producer") groupBy = "producer";
                                else if (sortBy === "category") groupBy = "category";
                                else if (!sortBy && producerFilter) groupBy = "producer";
                                else groupBy = "category";

                                // Sort the filtered products
                                const sortedProducts = filteredProducts.sort((a, b) =>
                                    a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
                                );
                                let grouped: Record<string, Product[]> = {};
                                if (groupBy === "category") {
                                    grouped = sortedProducts.reduce((acc, product) => {
                                        const key = product.category?.name || "Sans catégorie";
                                        if (!acc[key]) acc[key] = [];
                                        acc[key].push(product);
                                        return acc;
                                    }, {} as Record<string, Product[]>);
                                } else if (groupBy === "producer") {
                                    grouped = sortedProducts.reduce((acc, product) => {
                                        const key = product.producer?.name || "Sans producteur";
                                        if (!acc[key]) acc[key] = [];
                                        acc[key].push(product);
                                        return acc;
                                    }, {} as Record<string, Product[]>);
                                } else {
                                    grouped = { "": sortedProducts };
                                }

                                return Object.entries(grouped).map(([groupName, products]) => (
                                    <React.Fragment key={groupName}>
                                        {groupName && (
                                            <tr>
                                                <td colSpan={6} className="bg-gray-200 font-semibold px-2 py-2 md:px-4 md:py-2 border-b">
                                                    {groupName}
                                                </td>
                                            </tr>
                                        )}
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-2 py-2 md:px-4 md:py-2 border-b text-left">
                                                    {product.name}
                                                </td>
                                                <td className="px-2 py-2 md:px-4 md:py-2 border-b text-left">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-1 border rounded"
                                                        value={
                                                            history[product.id]?.receivedQuantity !== undefined
                                                                ? history[product.id].receivedQuantity
                                                                : ""
                                                        }
                                                        min={0}
                                                        onChange={(e) =>
                                                            handleChange(product.id, "receivedQuantity", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td className="px-2 py-2 md:px-4 md:py-2 border-b text-left">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-1 border rounded"
                                                        value={
                                                            history[product.id]?.soldQuantity !== undefined
                                                                ? history[product.id].soldQuantity
                                                                : ""
                                                        }
                                                        min={0}
                                                        onChange={(e) =>
                                                            handleChange(product.id, "soldQuantity", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td className="px-2 py-2 md:px-4 md:py-2 border-b text-left">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-1 border rounded"
                                                        value={
                                                            history[product.id]?.unsoldQuantity !== undefined
                                                                ? history[product.id].unsoldQuantity
                                                                : ""
                                                        }
                                                        min={0}
                                                        onChange={(e) =>
                                                            handleChange(product.id, "unsoldQuantity", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td className="px-2 py-2 md:px-4 md:py-2 border-b text-left">
                                                    <input
                                                        type="number"
                                                        className="w-24 p-1 border rounded"
                                                        value={history[product.id]?.price ?? ""}
                                                        min={0}
                                                        step="0.01"
                                                        onChange={(e) =>
                                                            handleChange(product.id, "price", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td className="px-2 py-2 md:px-4 md:py-2 border-b text-left">
                                                    <input
                                                        type="text"
                                                        className="w-full p-1 border rounded"
                                                        value={history[product.id]?.description ?? ""}
                                                        onChange={(e) =>
                                                            handleChange(product.id, "description", e.target.value)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                        onClick={() => {
                            const prevMonday = new Date(selectedMonday);
                            prevMonday.setDate(selectedMonday.getDate() - 7);
                            setSelectedMonday(prevMonday);
                        }}
                    >
                        Semaine précédente
                    </button>
                </div>
            </main>
        </div>
    );
}