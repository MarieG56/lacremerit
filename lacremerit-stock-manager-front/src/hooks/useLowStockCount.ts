import { useEffect, useState } from "react";
import { getAllProducts, Product } from "../api/productApi";
import { getAllProductsHistory, ProductHistory } from "../api/productHistory";

const CATEGORIES_IDS = [8, 10, 11];

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

function getISOWeek(date: Date) {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return {
        year: d.getUTCFullYear(),
        week: Math.ceil(
            ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
        ),
    };
}

export function useLowStockCount() {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        async function fetchCount() {
            const [productsRes, historiesRes] = await Promise.all([
                getAllProducts(),
                getAllProductsHistory(),
            ]);
            const products = productsRes?.data || [];
            const histories = historiesRes?.data || [];

            console.log("Produits récupérés:", products);
            console.log("Historiques récupérés:", histories);

            const filteredProducts = products.filter((p: Product) => {
                const catId = p.categoryId ?? p.category?.id;
                return catId !== undefined && CATEGORIES_IDS.includes(catId);
            });
            console.log("Produits filtrés:", filteredProducts);

            const monday = getMondayOfLastWeek();
            const prevWeek = getISOWeek(monday);

            const lowStockProducts = filteredProducts.filter((product: any) => {
                const history: ProductHistory | undefined = histories.find(
                    (h: ProductHistory) => {
                        if (h.productId !== product.id) return false;
                        const histWeek = getISOWeek(new Date(h.weekStartDate));
                        return (
                            histWeek.year === prevWeek.year &&
                            histWeek.week === prevWeek.week
                        );
                    }
                );
                return history && history.unsoldQuantity <= 5;
            });

            console.log("Produits avec stock faible:", lowStockProducts);
            console.log("Nombre calculé:", lowStockProducts.length);

            setCount(lowStockProducts.length);
        }
        fetchCount();
    }, []);

    return count;
}
