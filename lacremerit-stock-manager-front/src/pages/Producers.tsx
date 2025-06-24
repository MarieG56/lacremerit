import { useEffect, useState, useCallback } from "react";
import { getAllProducers, Producer } from "../api/producerApi";
import AddProducerModal from "../components/AddProducerModal";
import EditProducerModal from "../components/EditProducerModal";

export default function ProducersPage() {
    const [producers, setProducers] = useState<Producer[]>([]);
    const [filtered, setFiltered] = useState<Producer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
    const [showAddProducer, setShowAddProducer] = useState(false);

    // Fetch producers
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllProducers();
            const data: Producer[] = res?.data || [];
            data.sort((a, b) =>
                a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
            );
            setProducers(data);
            setFiltered(data);
        } catch (err) {
            setError("Erreur lors du chargement des producteurs.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Dynamic filter
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFiltered(
            producers.filter((p) => p.name.toLowerCase().includes(term))
        );
    }, [searchTerm, producers]);

    if (loading) {
        return (
            <div className="p-6 w-full max-w-full mx-auto">
                <div className="text-lg mb-4">Chargement des producteurices...</div>
                <div className="w-full h-4 bg-gray-200 rounded-md overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 w-full max-w-full mx-auto">
            <header className="bg-white shadow-md p-4">
                <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center px-1 md:px-3">
                    <h1 className="text-2xl font-bold flex-1 text-center md:text-left">
                        Producteurices
                    </h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm"
                        onClick={() => setShowAddProducer(true)}
                    >
                        Ajouter un·e producteurice
                    </button>
                </div>
            </header>

            <main className="p-4 md:p-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded shadow-sm">
                        Erreur : {error}
                    </div>
                )}

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher un·e producteurice..."
                        className="w-full p-2 border rounded mb-4 bg-white text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded shadow-sm">
                        Aucun·e producteurice trouvé·e.
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-2 md:p-6 overflow-x-auto">
                        <table className="min-w-full table-auto text-sm">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Nom
                                    </th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Adresse
                                    </th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Email
                                    </th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">
                                        Téléphone
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((producer) => (
                                    <tr key={producer.id} className="border-t">
                                        <td className="px-2 py-2 md:px-4 md:py-2 text-left">
                                            <button
                                                className="text-blue-600 underline"
                                                onClick={() => setSelectedProducer(producer)}
                                            >
                                                {producer.name}
                                            </button>
                                        </td>
                                        <td className={`px-2 py-2 md:px-4 md:py-2 ${producer.address ? "text-left" : "text-center"}`}>
                                            {producer.address || "-"}
                                        </td>
                                        <td className={`px-2 py-2 md:px-4 md:py-2 ${producer.email ? "text-left" : "text-center"}`}>
                                            {producer.email || "-"}
                                        </td>
                                        <td className="px-2 py-2 md:px-4 md:py-2 text-center">
                                            {producer.phoneNumber || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <EditProducerModal
                    producer={selectedProducer}
                    isOpen={!!selectedProducer}
                    onClose={() => setSelectedProducer(null)}
                    onSuccess={() => {
                        setSelectedProducer(null);
                        fetchData();
                    }}
                />

                <AddProducerModal
                    open={showAddProducer}
                    onClose={() => setShowAddProducer(false)}
                    onSuccess={() => {
                        setShowAddProducer(false);
                        fetchData();
                    }}
                />
            </main>
        </div>
    );
}