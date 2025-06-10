import { useState, useEffect } from 'react';
import { Product, getProduct, updateProduct, deleteProduct } from '../api/productApi';

interface ProductInfoModalProps {
  productId: number;
  onRefresh: () => void;
  onClose: () => void; 
}

export default function ProductInfoModal({ productId, onRefresh }: ProductInfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProduct(productId);
      setProduct(response?.data || null);
    } catch (err) {
      console.error('Erreur lors de la récupération du produit :', err);
      setError('Impossible de charger les détails du produit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProduct();
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!product) return;

    const updatedProduct = { ...product, name: `${product.name} (modifié)` }; // Example update
    try {
      await updateProduct(Number(product.id), updatedProduct);
      setProduct(updatedProduct); // Update the local state
      onRefresh(); // Refresh the product list
      alert('Produit mis à jour avec succès.');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du produit :', err);
      alert('Erreur lors de la mise à jour du produit.');
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        await deleteProduct(Number(product.id));
        onRefresh(); // Refresh the product list
        setIsOpen(false); // Close the modal
        alert('Produit supprimé avec succès.');
      } catch (err) {
        console.error('Erreur lors de la suppression du produit :', err);
        alert('Erreur lors de la suppression du produit.');
      }
    }
  };

  return (
    <>
      <button
        className="text-blue-500 underline"
        onClick={() => setIsOpen(true)}
      >
        Voir les détails
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {loading ? (
              <div>Chargement...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : product ? (
              <>
                <h2 className="text-xl font-bold mb-4">Détails du Produit</h2>
                <div className="mb-4">
                  <strong>Nom :</strong> {product.name}
                </div>
                <div className="mb-4">
                  <strong>Description :</strong> {product.description || 'Non renseignée'}
                </div>
                <div className="mb-4">
                  <strong>Catégorie :</strong> {product.category?.name || 'Non renseignée'}
                </div>
                <div className="mb-4">
                  <strong>Sous-catégorie :</strong> {product.subcategory?.name || 'Non renseignée'}
                </div>
                <div className="mb-4">
                  <strong>Producteur :</strong> {product.producer?.name || 'Non renseigné'}
                </div>
                <div className="mb-4">
                  <strong>Unité :</strong> {product.unit}
                </div>
                <div className="mb-4">
                  <strong>Statut :</strong>{' '}
                  {product.isActive ? (
                    <span className="text-green-500">Actif</span>
                  ) : (
                    <span className="text-red-500">Inactif</span>
                  )}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-yellow-500 text-white p-2 rounded"
                    onClick={handleUpdate}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={handleDelete}
                  >
                    Supprimer
                  </button>
                </div>
              </>
            ) : (
              <div>Aucun détail disponible pour ce produit.</div>
            )}
            <button
              className="mt-4 bg-gray-300 text-black p-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}