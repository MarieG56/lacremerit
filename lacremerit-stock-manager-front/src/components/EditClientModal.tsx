import { useState, useEffect } from "react";
import { Client, updateClient, deleteClient } from "../api/clientApi";

export default function EditClientModal({
    client,
    isOpen,
    onClose,
    onSuccess,
}: {
    client: Client | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    // Local state for form data, loading status and errors
    const [form, setForm] = useState<Partial<Client>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form when client or modal open changes
    useEffect(() => {
        if (client) {
            setForm({
                name: client.name,
                address: client.address || "",
                email: client.email || "",
                phoneNumber: client.phoneNumber || "",
            });
            setError(null);
        }
    }, [client, isOpen]);

    // Do not render the modal if it is not open or client is null
    if (!isOpen || !client) return null;

    // Update form state on input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission for updating client information
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
            await updateClient(Number(client.id), body);
            setLoading(false);
            onSuccess();
            onClose();
        } catch (err) {
            setError("Erreur lors de la modification.");
            setLoading(false);
        }
    };

    // Handle deletion of the client after confirmation
    const handleDelete = async () => {
        if (!window.confirm("Supprimer ce·tte client·e ?")) return;
        setLoading(true);
        setError(null);
        try {
            await deleteClient(Number(client.id));
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
                {/* Modal Header */}
                <h2 className="text-xl font-bold mb-4">Modifier le·la client·e</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
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
                    {/* Address Field */}
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
                    {/* Email Field */}
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
                    {/* Phone Number Field */}
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
                    {/* Display error message if present */}
                    {error && <div className="text-red-600 mb-2">{error}</div>}
                    <div className="flex justify-between gap-2 mt-4">
                        {/* Delete Button */}
                        <button
                            type="button"
                            className="bg-red-500 text-white p-2 rounded"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Supprimer
                        </button>
                        <div className="flex gap-2">
                            {/* Close Button */}
                            <button
                                type="button"
                                className="bg-gray-300 text-black p-2 rounded"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Fermer
                            </button>
                            {/* Save Button */}
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