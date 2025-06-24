import { useState, useEffect } from 'react';
import { Product, getProduct, updateProduct, deleteProduct } from '../api/productApi';

interface ProductInfoModalProps {
  productId: number;
  onRefresh: () => void;
  onClose: () => void; 
}

export default function ProductInfoModal({ productId, onRefresh }: ProductInfoModalProps) {
  // State to manage whether the modal is open
  const [isOpen, setIsOpen] = useState(false);
  // State to store the product data
  const [product, setProduct] = useState<Product | null>(null);
  // State to manage loading status
  const [loading, setLoading] = useState(false);
  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the product details from the API
  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProduct(productId);
      setProduct(response?.data || null);
    } catch (err) {
      console.error('Error retrieving product:', err);
      setError('Impossible de charger les détails du produit.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch product details when the modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchProduct();
    }
  }, [isOpen]);

  // Handle updating the product
  const handleUpdate = async () => {
    if (!product) return;

    // Example update: append " (modifié)" to the product name
    const updatedProduct = { ...product, name: `${product.name} (modifié)` };
    try {
      await updateProduct(Number(product.id), updatedProduct);
      setProduct(updatedProduct); // Update local state with modified product
      onRefresh(); // Refresh the product list outside the modal
      alert('Produit mis à jour avec succès.');
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Erreur lors de la mise à jour du produit.');
    }
  };

  // Handle deleting the product
  const handleDelete = async () => {
    if (!product) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        await deleteProduct(Number(product.id));
        onRefresh(); // Refresh the product list after deletion
        setIsOpen(false); // Close the modal
        alert('Produit supprimé avec succès.');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Erreur lors de la suppression du produit.');
      }
    }
  };

  return (
    <>
      {/* Button to open the modal */}
      <button className="text-blue-500 underline" onClick={() => setIsOpen(true)}>
        Voir les détails
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {loading ? (
              // Loading indicator
              <div>Chargement...</div>
            ) : error ? (
              // Error message
              <div className="text-red-500">{error}</div>
            ) : product ? (
              <>
                {/* Modal title */}
                <h2 className="text-xl font-bold mb-4">Détails du Produit</h2>
                {/* Display product name */}
                <div className="mb-4">
                  <strong>Nom :</strong> {product.name}
                </div>
                {/* Display product description */}
                <div className="mb-4">
                  <strong>Description :</strong> {product.description || 'Non renseignée'}
                </div>
                {/* Display product category */}
                <div className="mb-4">
                  <strong>Catégorie :</strong> {product.category?.name || 'Non renseignée'}
                </div>
                {/* Display product subcategory */}
                <div className="mb-4">
                  <strong>Sous-catégorie :</strong> {product.subcategory?.name || 'Non renseignée'}
                </div>
                {/* Display product producer */}
                <div className="mb-4">
                  <strong>Producteur :</strong> {product.producer?.name || 'Non renseigné'}
                </div>
                {/* Display product unit */}
                <div className="mb-4">
                  <strong>Unité :</strong> {product.unit}
                </div>
                {/* Display product active status */}
                <div className="mb-4">
                  <strong>Statut :</strong>{' '}
                  {product.isActive ? (
                    <span className="text-green-500">Actif</span>
                  ) : (
                    <span className="text-red-500">Inactif</span>
                  )}
                </div>
                {/* Buttons to update and delete the product */}
                <div className="flex justify-between mt-4">
                  <button className="bg-yellow-500 text-white p-2 rounded" onClick={handleUpdate}>
                    Modifier
                  </button>
                  <button className="bg-red-500 text-white p-2 rounded" onClick={handleDelete}>
                    Supprimer
                  </button>
                </div>
              </>
            ) : (
              // Fallback message when no product details are available
              <div>Aucun détail disponible pour ce produit.</div>
            )}
            {/* Button to close the modal */}
            <button className="mt-4 bg-gray-300 text-black p-2 rounded" onClick={() => setIsOpen(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}