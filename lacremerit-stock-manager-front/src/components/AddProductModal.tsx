import { useState, useEffect } from "react";
import { postProduct, Product, Unit } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";
import { getAllProducers } from "../api/producerApi";
import { getAllSubcategories } from "../api/subcategoryApi";

interface AddProductModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (newProduct: Product) => void;
}

export default function AddProductModal({ open, onClose, onSuccess }: AddProductModalProps) {
    // Local state for form fields and fetched data
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [producerId, setProducerId] = useState("");
    const [unit, setUnit] = useState<Unit>("KG");
    const [isActive, setIsActive] = useState(true);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [subcategories, setSubcategories] = useState<{ id: number; name: string; categoryId: number }[]>([]);
    const [producers, setProducers] = useState<{ id: number; name: string }[]>([]);

    // Fetch categories, subcategories and producers on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, subcategoriesRes, producersRes] =
                    await Promise.all([
                        getAllCategories(),
                        getAllSubcategories(),
                        getAllProducers(),
                    ]);
                // Sort categories alphabetically
                const sortedCategories = (categoriesRes?.data || []).sort((a: { name: string }, b: { name: string }) =>
                    a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
                );
                // Sort producers alphabetically
                const sortedProducers = (producersRes?.data || []).sort((a: { name: string }, b: { name: string }) =>
                    a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
                );
                setCategories(sortedCategories);
                setSubcategories(subcategoriesRes?.data || []);
                setProducers(sortedProducers);
            } catch (error) {
                // Log error if fetching fails
                console.error(
                    "Error loading categories, subcategories and producers",
                    error
                );
            }
        };
        fetchData();
    }, []);

    // Reset the form fields to their initial values
    const resetForm = () => {
        setProductName("");
        setDescription("");
        setCategoryId("");
        setSubcategoryId("");
        setProducerId("");
        setUnit("KG");
        setIsActive(true);
    };

    // Submit handler to post a new product
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: productName,
            description: description || undefined,
            categoryId: Number(categoryId),
            subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
            producerId: Number(producerId),
            unit: unit as Unit,
            isActive,
        };
        try {
            const newProduct = await postProduct(payload);
            if (newProduct && newProduct.data) {
                // Call onSuccess with the newly added product
                onSuccess(newProduct.data);
                resetForm();
                onClose();
            }
        } catch (error) {
            // Log error details if posting fails
            if (error instanceof Error) {
                console.error(
                    "Error adding product",
                    (error as any)?.response?.data || error.message
                );
            } else {
                console.error("Error adding product", error);
            }
        }
    };

    // Do not render the modal if it is not open
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto">
                {/* Modal Header */}
                <h2 className="text-xl font-bold mb-4">Ajouter un Produit</h2>
                <form onSubmit={handleSubmit}>
                    {/* Product Name Field */}
                    <div className="mb-4">
                        <label className="block">Nom du produit</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />
                    </div>
                    {/* Description Field */}
                    <div className="mb-4">
                        <label className="block">Description</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    {/* Category Field */}
                    <div className="mb-4">
                        <label className="block">Catégorie</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Subcategory Field */}
                    <div className="mb-4">
                        <label className="block">Sous-catégorie</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={subcategoryId}
                            onChange={(e) => setSubcategoryId(e.target.value)}
                            required
                            disabled={!categoryId}
                        >
                            <option value="">Sélectionner une sous-catégorie</option>
                            {subcategories
                                .filter((subcategory) => String(subcategory.categoryId) === categoryId)
                                .map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    {/* Producer Field */}
                    <div className="mb-4">
                        <label className="block">Producteur</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={producerId}
                            onChange={(e) => setProducerId(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner un producteur</option>
                            {producers.map((producer) => (
                                <option key={producer.id} value={producer.id}>
                                    {producer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Unit Field */}
                    <div className="mb-4">
                        <label className="block">Unité</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value as Unit)}
                            required
                        >
                            <option value="KG">KG</option>
                            <option value="L">L</option>
                            <option value="UN">UN</option>
                        </select>
                    </div>
                    {/* Active Checkbox */}
                    <div className="mb-4 flex items-center gap-2">
                        <label className="block mb-0">Actif</label>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </div>
                    {/* Modal Action Buttons */}
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            type="submit"
                            className="bg-green-600 text-white p-2 rounded"
                        >
                            Ajouter
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 text-black p-2 rounded"
                            onClick={onClose}
                        >
                            Fermer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
