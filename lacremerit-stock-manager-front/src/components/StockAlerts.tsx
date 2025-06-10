import { useEffect, useState } from "react";
import { fetchLowStockProducts, Product } from "../api/productApi";

export default function StockAlerts() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts().then((data) => {
      setLowStockProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading || lowStockProducts.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Alertes</h2>
      <div className="bg-red-100 p-4 rounded-lg shadow-md text-red-800">
        <p className="font-medium mb-2">🚨 Produits en rupture de stock :</p>
        <ul className="list-disc pl-5">
          {lowStockProducts.map((product) => (
            <li key={product.id}>
              {product.name} ({product.unit})
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
