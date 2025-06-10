import { useEffect, useState } from "react";
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

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllProducers();
            const data = res?.data || [];
            data.sort((a: Producer, b: Producer) =>
                a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
            );
            setProducers(data);
            setFiltered(data);
        } catch (err) {
            setError("Erreur lors du chargement des producteurs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFiltered(
            producers
                .filter((p) => p.name.toLowerCase().includes(term))
        );
    }, [searchTerm, producers]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-lg mb-4">Chargement des producteurices...</div>
                <div className="w-full h-4 bg-gray-200 rounded-md overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Producteurices</h1>
                <AddProducerModal onSuccess={fetchData} />
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded shadow-sm">
                    Erreur : {error}
                </div>
            )}

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Rechercher un producteur..."
                    className="w-full p-2 border rounded mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded shadow-sm">
                    Aucun·e producteurice trouvé·e.
                </div>
            ) : (
                <table className="min-w-full table-auto bg-white shadow-md rounded-md">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-4 py-2 border-b">Nom</th>
                            <th className="px-4 py-2 border-b">Adresse</th>
                            <th className="px-4 py-2 border-b">Email</th>
                            <th className="px-4 py-2 border-b">Téléphone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((producer) => (
                            <tr key={producer.id}>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        className="text-blue-600 underline"
                                        onClick={() => setSelectedProducer(producer)}
                                    >
                                        {producer.name}
                                    </button>
                                </td>
                                <td className="px-4 py-2 border-b">{producer.address || "-"}</td>
                                <td className="px-4 py-2 border-b">{producer.email || "-"}</td>
                                <td className="px-4 py-2 border-b">{producer.phoneNumber || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        </div>
    );
}