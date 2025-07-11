import { useState } from "react";
import { postProducer } from "../api/producerApi";

interface AddProducerModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddProducerModal({ open, onClose, onSuccess }: AddProducerModalProps) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset all form fields and clear error state
    const resetForm = () => {
        setName("");
        setAddress("");
        setEmail("");
        setPhoneNumber("");
        setError(null);
    };

    // Handle form submission to add a new producer
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await postProducer({
                name,
                address: address || undefined,
                email: email || undefined,
                phoneNumber: phoneNumber || undefined,
            });
            resetForm();
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setError("Erreur lors de l'ajout du/de la producteurice.");
        } finally {
            setLoading(false);
        }
    };

    // Do not render the modal if it's not open
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto">
                {/* Modal Title */}
                <h2 className="text-xl font-bold mb-4">Ajouter un·e producteurice</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name Input */}
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
                    {/* Address Input */}
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
                    {/* Email Input */}
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
                    {/* Phone Number Input */}
                    <div className="mb-4">
                        <label className="block">Téléphone</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {/* Display error message if exists */}
                    {error && <div className="text-red-600 mb-2">{error}</div>}
                    <div className="flex justify-center gap-2 mt-4">
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-green-600 text-white p-2 rounded"
                            disabled={loading}
                        >
                            Ajouter
                        </button>
                        {/* Close Button */}
                        <button
                            type="button"
                            className="bg-gray-300 text-black p-2 rounded"
                            onClick={() => {
                                onClose();
                                resetForm();
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