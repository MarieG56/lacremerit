import { useEffect, useState } from "react";
import { Category } from "../api/categoryApi";
import { Producer } from "../api/producerApi";
import { deleteProduct, Product, updateProduct } from "../api/productApi";
import { Subcategory } from "../api/subcategoryApi";

export default function EditProductModal({
    product,
    categories,
    subcategories,
    producers,
    isOpen,
    onClose,
    onRefresh,
}: {
    product: Product | null;
    categories: Category[];
    subcategories: Subcategory[];
    producers: Producer[];
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
}) {
    const [form, setForm] = useState<Product | null>(product);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setForm(product);
        setError(null);
    }, [product, isOpen]);

    if (!isOpen || !form) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setForm((prev) => {
            if (!prev) return prev;

            if (name === "category") {
                const selectedCategory = categories.find(
                    (cat) => cat.id === Number(value)
                );
                return {
                    ...prev,
                    category: selectedCategory || undefined,
                    subcategory: undefined, // reset subcategory when category changes
                };
            }

            if (name === "subcategory") {
                const selectedSubcategory = subcategories.find(
                    (sc) => sc.id === Number(value)
                );
                return {
                    ...prev,
                    subcategory: selectedSubcategory || undefined,
                };
            }

            if (name === "producer") {
                const selectedProducer = producers.find(
                    (p) => Number(p.id) === Number(value)
                );
                return {
                    ...prev,
                    producer: selectedProducer
                        ? { id: Number(selectedProducer.id), name: selectedProducer.name }
                        : undefined,
                };
            }

            return {
                ...prev,
                [name]:
                    type === "checkbox"
                        ? (e.target as HTMLInputElement).checked
                        : value,
            };
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateProduct(Number(form.id), {
                name: form.name,
                unit: form.unit,
                description: form.description,
                categoryId:
                    typeof form.category === "object"
                        ? form.category.id
                        : Number(form.category),
                subcategoryId:
                    form.subcategory
                        ? typeof form.subcategory === "object"
                            ? form.subcategory.id
                            : Number(form.subcategory)
                        : undefined,
                producerId:
                    typeof form.producer === "object"
                        ? form.producer.id
                        : Number(form.producer),
                isActive: form.isActive,
            });
            setLoading(false);
            onRefresh();
            onClose();
        } catch (err) {
            setError("Erreur lors de la modification.");
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Supprimer ce produit ?")) return;

        setLoading(true);
        setError(null);
        try {
            if (!product) {
                setError("Produit introuvable.");
                setLoading(false);
                return;
            }
            await deleteProduct(product.id);
            console.log("Deleted product", product.id);
            setLoading(false);
            onRefresh();
            onClose();
        } catch (err) {
            setError("Erreur lors de la suppression.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Modifier le produit</h2>
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label className="block">Nom</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={form.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Catégorie</label>
                        <select
                            name="category"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={form.category?.id || ""}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block">Sous-catégorie</label>
                        <select
                            name="subcategory"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={form.subcategory?.id || ""}
                            onChange={handleChange}
                            disabled={loading || !form.category?.id}
                        >
                            <option value="">
                                Sélectionner une sous-catégorie
                            </option>
                            {subcategories
                                .filter((sc) => sc.categoryId === form.category?.id)
                                .map((sc) => (
                                    <option key={sc.id} value={sc.id}>
                                        {sc.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block">Producteur</label>
                        <select
                            name="producer"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={form.producer?.id || ""}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Sélectionner un producteur</option>
                            {producers.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                disabled={loading}
                                className="mr-2"
                            />
                            Actif
                        </label>
                    </div>
                    {error && <div className="text-red-600 mb-2">{error}</div>}
                    <div className="flex justify-between gap-2 mt-4">
                        <button
                            type="button"
                            className="bg-red-500 text-white p-2 rounded"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Supprimer
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="bg-gray-300 text-black p-2 rounded"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Fermer
                            </button>
                            <button
                                type="submit"
                                className="bg-green-600 text-white p-2 rounded"
                                disabled={loading}
                            >
                                {loading ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
