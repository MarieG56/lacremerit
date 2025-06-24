import { useState, useEffect } from "react";
import { getAllCategories } from "../api/categoryApi";
import { postSubcategory } from "../api/subcategoryApi";

export default function AddSubcategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  // State for form fields, categories, error and loading status
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories when modal is open
  useEffect(() => {
    if (isOpen) {
      getAllCategories().then(res => setCategories(res?.data || []));
    }
  }, [isOpen]);

  // Submit handler for adding a subcategory
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate that the name is not empty
      if (!name.trim()) {
        setError("Le nom est requis.");
        setLoading(false);
        return;
      }
      // Validate that a category is selected
      if (!categoryId) {
        setError("Veuillez sélectionner une catégorie.");
        setLoading(false);
        return;
      }
      // Post the subcategory data
      await postSubcategory({
        name: name.trim(),
        categoryId: Number(categoryId),
      });
      // Reset form fields and close modal on success
      setName("");
      setCategoryId("");
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError("Erreur lors de l'ajout de la sous-catégorie.");
      setLoading(false);
    }
  };

  // Do not render modal if it's not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto">
        {/* Modal Title */}
        <h2 className="text-xl font-bold mb-4">Ajouter une sous-catégorie</h2>
        <form onSubmit={handleSubmit}>
          {/* Subcategory Name Field */}
          <div className="mb-4">
            <label className="block">Nom</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nom de la sous-catégorie"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {/* Category Select Field */}
          <div className="mb-4">
            <label className="block">Catégorie</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {/* Display error message if any */}
          {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
          {/* Modal Action Buttons */}
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
                // Reset form fields and close modal
                setName("");
                setCategoryId("");
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