import { useState, useEffect } from "react";
import { Producer, updateProducer, deleteProducer } from "../api/producerApi";

interface EditProducerModalProps {
    producer: Producer | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditProducerModal({
    producer,
    isOpen,
    onClose,
    onSuccess,
}: EditProducerModalProps) {
    const [form, setForm] = useState<Partial<Producer>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (producer) {
            setForm({
                name: producer.name,
                address: producer.address || "",
                email: producer.email || "",
                phoneNumber: producer.phoneNumber || "",
            });
            setError(null);
        }
    }, [producer, isOpen]);

    if (!isOpen || !producer) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const body = {
                name: form.name?.trim() || "",
                address: form.address?.trim() || undefined,
                email: form.email?.trim() || undefined,
                phoneNumber: form.phoneNumber?.trim() || undefined,
            };
            if (!body.name) {
                setError("Le nom est obligatoire.");
                setLoading(false);
                return;
            }
            await updateProducer(Number(producer.id), body);
            setLoading(false);
            onSuccess();
            onClose();
        } catch (err) {
            setError("Erreur lors de la modification.");
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Supprimer ce producteur ?")) return;
        setLoading(true);
        setError(null);
        try {
            await deleteProducer(Number(producer.id));
            setLoading(false);
            onSuccess();
            onClose();
        } catch (err) {
            setError("Erreur lors de la suppression.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto">
                <h2 className="text-xl font-bold mb-4">Modifier le producteurice</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block">Nom</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={form.name || ""}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Adresse</label>
                        <input
                            type="text"
                            name="address"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={form.address || ""}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={form.email || ""}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Téléphone</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={form.phoneNumber || ""}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    {error && (
                        <div className="text-red-600 mb-2">{error}</div>
                    )}
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