import { useState } from "react";
import { postProducer } from "../api/producerApi";

export default function AddProducerModal({ onSuccess }: { onSuccess?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setName("");
        setAddress("");
        setEmail("");
        setPhoneNumber("");
        setError(null);
    };

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
            setIsOpen(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("Erreur lors de l'ajout du/de la producteurice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="bg-blue-600 text-white p-2 rounded"
                onClick={() => setIsOpen(true)}
            >
                Ajouter un producteur
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Ajouter un·e producteurice</h2>
                        <form onSubmit={handleSubmit}>
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
                            {error && (
                                <div className="text-red-600 mb-2">{error}</div>
                            )}
                            <div className="flex justify-center gap-2 mt-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white p-2 rounded"
                                    disabled={loading}
                                >
                                    Ajouter
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 text-black p-2 rounded"
                                    onClick={() => {
                                        setIsOpen(false);
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
            )}
        </>
    );
}