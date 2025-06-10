import { useState } from "react";
import { getAllCategories, postCategory } from "../api/categoryApi";

export default function AddCategoryModal({
    isOpen,
    onClose,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; 
}) {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await getAllCategories();
            const exists = res?.data?.some(
                (cat: { name: string }) =>
                    cat.name.trim().toLowerCase() === name.trim().toLowerCase()
            );
            if (exists) {
                setError("Cette catégorie existe déjà.");
                setLoading(false);
                return;
            }

            await postCategory({ name: name.trim() });
            setName("");
            setLoading(false);
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setError("Erreur lors de l'ajout de la catégorie.");
            setLoading(false);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto">
                <h2 className="text-xl font-bold mb-4">
                    Ajouter une catégorie
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block">Nom</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Nom de la catégorie"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                        {error && (
                            <div className="text-red-600 mt-2 text-sm">{error}</div>
                        )}
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            type="submit"
                            className="bg-green-600 text-white p-2 rounded"
                            disabled={loading}
                        >
                            {loading ? "Ajout..." : "Ajouter"}
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 text-black p-2 rounded"
                            onClick={() => {
                                setName("");
                                setError(null);
                                onClose();
                            }}
                            disabled={loading}
                        >
                            Fermer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
