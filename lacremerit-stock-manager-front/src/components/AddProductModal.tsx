import { useState, useEffect } from "react";
import { postProduct, Product } from "../api/productApi"; 
import { getAllCategories } from "../api/categoryApi"; 
import { getAllProducers } from "../api/producerApi"; 
import { getAllSubcategories } from "../api/subcategoryApi"; 

interface AddProductModalProps {
    onSuccess: (newProduct: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState(""); 
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [producerId, setProducerId] = useState("");
    const [unit, setUnit] = useState("KG");
    const [isActive, setIsActive] = useState(true);
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);
    const [subcategories, setSubcategories] = useState<
        { id: number; name: string; categoryId: number }[]
    >([]);
    const [producers, setProducers] = useState<{ id: number; name: string }[]>(
        []
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, subcategoriesRes, producersRes] =
                    await Promise.all([
                        getAllCategories(),
                        getAllSubcategories(),
                        getAllProducers(),
                    ]);
                // Trie les catégories et producteurs par ordre alphabétique
                const sortedCategories = (categoriesRes?.data || []).sort((a: { name: string }, b: { name: string }) =>
                    a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
                );
                const sortedProducers = (producersRes?.data || []).sort((a: { name: string }, b: { name: string }) =>
                    a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
                );
                setCategories(sortedCategories);
                setSubcategories(subcategoriesRes?.data || []);
                setProducers(sortedProducers);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des catégories, sous-catégories et producteurs",
                    error
                );
            }
        };

        fetchData();
    }, []);

    const resetForm = () => {
        setProductName("");
        setDescription("");
        setCategoryId("");
        setSubcategoryId("");
        setProducerId("");
        setUnit("KG");
        setIsActive(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: productName,
            description: description || undefined, 
            categoryId: Number(categoryId), 
            subcategoryId: subcategoryId ? Number(subcategoryId) : undefined, 
            producerId: Number(producerId), 
            unit,
            isActive,
        };

        try {
            const newProduct = await postProduct(payload);
            if (newProduct && newProduct.data) {
                onSuccess(newProduct.data); 
                resetForm(); 
                setIsOpen(false); 
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    "Erreur lors de l'ajout du produit",
                    (error as any)?.response?.data || error.message
                );
            } else {
                console.error("Erreur lors de l'ajout du produit", error);
            }
        }
    };

    if (!isOpen) {
        return (
            <button
                className="bg-blue-600 text-white p-2 rounded"
                onClick={() => setIsOpen(true)}
            >
                Ajouter un produit
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto">
                <h2 className="text-xl font-bold mb-4">
                    Ajouter un Produit
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block">Nom du produit</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={productName}
                            onChange={(e) =>
                                setProductName(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block">Description</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block">Catégorie</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(e.target.value)
                            }
                            required
                        >
                            <option value="">
                                Sélectionner une catégorie
                            </option>
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block">Sous-catégorie</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={subcategoryId}
                            onChange={(e) => setSubcategoryId(e.target.value)}
                            required
                            disabled={!categoryId}
                        >
                            <option value="">
                                Sélectionner une sous-catégorie
                            </option>
                            {subcategories
                                .filter((subcategory) => String(subcategory.categoryId) === categoryId)
                                .map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block">Producteur</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={producerId}
                            onChange={(e) =>
                                setProducerId(e.target.value)
                            }
                            required
                        >
                            <option value="">
                                Sélectionner un producteur
                            </option>
                            {producers.map((producer) => (
                                <option
                                    key={producer.id}
                                    value={producer.id}
                                >
                                    {producer.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block">Unité</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            required
                        >
                            <option value="KG">KG</option>
                            <option value="L">L</option>
                            <option value="UN">UN</option>
                        </select>
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                        <label className="block mb-0">Actif</label>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) =>
                                setIsActive(e.target.checked)
                            }
                        />
                    </div>

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
                            onClick={() => setIsOpen(false)}
                        >
                            Fermer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;
