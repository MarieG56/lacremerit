import { useEffect, useState, useMemo } from "react";
import { getAllProducts, Product } from "../api/productApi";
import { getAllProductsHistory, ProductHistory } from "../api/productHistory";

const CATEGORIES_IDS = [8, 10, 11];

// Returns the Monday of last week (time set to 00:00:00)
function getMondayOfLastWeek() {
    const now = new Date();
    const day = now.getDay();
    const mondayThisWeek = new Date(now);
    mondayThisWeek.setDate(now.getDate() - ((day + 6) % 7));
    const mondayLastWeek = new Date(mondayThisWeek);
    mondayLastWeek.setDate(mondayThisWeek.getDate() - 7);
    mondayLastWeek.setHours(0, 0, 0, 0);
    return mondayLastWeek;
}

// Returns an object with the ISO year and week number for a given date
function getISOWeek(date: Date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return {
        year: d.getUTCFullYear(),
        week: Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    };
}

export default function GetLowStockProducts() {
    // State for loading indicator, product histories and low-stock products
    const [loading, setLoading] = useState(true);
    const [histories, setHistories] = useState<ProductHistory[]>([]);
    const [lowStock, setLowStock] = useState<Product[]>([]);

    // Compute Monday of last week and its ISO week details only once
    const { prevWeek } = useMemo(() => {
        const monday = getMondayOfLastWeek();
        return { prevWeek: getISOWeek(monday) };
    }, []);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // Fetch products and histories concurrently
            const [productsRes, historiesRes] = await Promise.all([
                getAllProducts(),
                getAllProductsHistory(),
            ]);
            const products: Product[] = productsRes?.data || [];
            const histories: ProductHistory[] = historiesRes?.data || [];

            // Filter products that belong to the allowed categories
            const filteredProducts = products.filter((p) => {
                const catId = p.categoryId ?? p.category?.id;
                return catId !== undefined && CATEGORIES_IDS.includes(catId);
            });

            // Filter those products which have a history for last week with unsoldQuantity <= 5
            const lowStockProducts = filteredProducts.filter((product) => {
                const history = histories.find((h) => {
                    if (h.productId !== product.id) return false;
                    const histWeek = getISOWeek(new Date(h.weekStartDate));
                    return histWeek.year === prevWeek.year && histWeek.week === prevWeek.week;
                });
                return history ? history.unsoldQuantity <= 5 : false;
            });

            setHistories(histories);
            setLowStock(lowStockProducts);
            setLoading(false);
        }
        fetchData();
    }, [prevWeek]);

    // Display loading indicator while data is being fetched
    if (loading) {
        return (
            <div className="p-4 text-center text-gray-500">
                Chargement des produits à faible stock...
            </div>
        );
    }

    return (
        <div className="bg-white rounded shadow p-4 mb-6">
            {/* Title */}
            <h2 className="text-lg font-bold mb-4">Produits bientôt en rupture</h2>
            {/* Display number of low-stock products */}
            <div className="mb-2 text-blue-700 font-semibold">
                Nombre de produits : {lowStock.length}
            </div>
            {lowStock.length === 0 ? (
                <div className="text-gray-400 text-center">
                    Aucun produit concerné.
                </div>
            ) : (
                <table className="min-w-full table-auto text-sm">
                    <thead>
                        <tr>
                            <th className="px-2 py-2 text-left">Produit</th>
                            <th className="px-2 py-2 text-left">Catégorie</th>
                            <th className="px-2 py-2 text-center">Stock semaine précédente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStock.map((product) => {
                            // Find the history for the product in the previous week
                            const history = histories.find((h) =>
                                h.productId === product.id &&
                                (() => {
                                    const histWeek = getISOWeek(new Date(h.weekStartDate));
                                    return (
                                        histWeek.year === prevWeek.year &&
                                        histWeek.week === prevWeek.week
                                    );
                                })()
                            );
                            return (
                                <tr key={product.id} className="border-t">
                                    <td className="px-2 py-2">{product.name}</td>
                                    <td className="px-2 py-2">{product.category?.name || "-"}</td>
                                    <td className="px-2 py-2 text-center">
                                        {history?.unsoldQuantity ?? "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}