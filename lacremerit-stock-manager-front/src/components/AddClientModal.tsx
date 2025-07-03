import { useState } from "react";
import { postClient } from "../api/clientApi";

interface AddClientModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddClientModal({ open, onClose, onSuccess }: AddClientModalProps) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form fields and error state
    const resetForm = () => {
        setName("");
        setAddress("");
        setEmail("");
        setPhone("");
        setError(null);
    };

    // Handle form submission to add a new client
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await postClient({
                name,
                address: address || undefined,
                email: email || undefined,
                phoneNumber: phone || undefined,
            });
            resetForm();
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setError("Erreur lors de l'ajout du·de la client·e.");
        } finally {
            setLoading(false);
        }
    };

    // Do not render the modal if it is not open
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto">
                {/* Modal title */}
                <h2 className="text-xl font-bold mb-4">Ajouter un·e client·e</h2>
                <form onSubmit={handleSubmit}>
                    {/* Client Name Input */}
                    <div className="mb-4">
                        <label className="block">Nom</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    {/* Client Address Input */}
                    <div className="mb-4">
                        <label className="block">Adresse</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {/* Client Email Input */}
                    <div className="mb-4">
                        <label className="block">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {/* Client Phone Input */}
                    <div className="mb-4">
                        <label className="block">Téléphone</label>
                        <input
                            type="tel"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {/* Display error message if any */}
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                    <div className="flex justify-end">
                        {/* Cancel button */}
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        {/* Submit button */}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            disabled={loading}
                        >
                            {loading ? "Chargement..." : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}