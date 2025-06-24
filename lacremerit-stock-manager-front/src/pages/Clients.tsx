import { useEffect, useState, useCallback } from "react";
import { getAllClients, Client } from "../api/clientApi";
import { getAllOrders, Order } from "../api/orderApi";
import { getAllProducts, Product } from "../api/productApi";
import AddClientModal from "../components/AddClientModal";
import EditClientModal from "../components/EditClientModal";
import AddOrderModal from "../components/AddOrderModal";
import EditOrderModal from "../components/EditOrderModal";
import { FiEdit2 } from "react-icons/fi";

function getStatusLabel(status: string) {
    switch (status) {
        case "PENDING":
            return "En attente";
        case "PREPARED":
            return "Préparée";
        case "CANCELLED":
            return "Annulée";
        default:
            return status;
    }
}

// Returns the Monday of the week for a given date
function getMonday(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - ((day + 6) % 7);
    return new Date(date.setDate(diff));
}

// Format for week input
function getWeekInputValue(date: Date) {
    const year = date.getFullYear();
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    const weekNo =
        1 +
        Math.round(
            ((tempDate.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
                7
        );
    return `${year}-W${String(weekNo).padStart(2, "0")}`;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [filtered, setFiltered] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddClient, setShowAddClient] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const [orders, setOrders] = useState<Order[]>([]);
    const [showAddOrder, setShowAddOrder] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [editOrder, setEditOrder] = useState<Order | null>(null);

    // State for the selected week (initialized to the Monday of the current week)
    const [selectedMonday, setSelectedMonday] = useState<Date>(() =>
        getMonday(new Date())
    );

    // Fetch clients, orders, and products
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [clientsRes, ordersRes, productsRes] = await Promise.all([
                getAllClients(),
                getAllOrders(),
                getAllProducts(),
            ]);
            const clientsData: Client[] = clientsRes?.data || [];
            clientsData.sort((a, b) =>
                a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
            );
            setClients(clientsData);
            setFiltered(clientsData);

            // Keep only orders associated with a professional client
            const ordersData: Order[] = (ordersRes?.data || []).filter(
                (o: Order) => o.clientId
            );
            setOrders(ordersData);
            setProducts(productsRes?.data || []);
        } catch (err) {
            setError("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Dynamically update the filtered list based on the search term
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFiltered(
            clients.filter((c) => c.name.toLowerCase().includes(term))
        );
    }, [searchTerm, clients]);

    // Calculate the boundaries of the current week
    const weekStart = new Date(selectedMonday);
    const weekEnd = new Date(selectedMonday);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Filter orders that fall within the selected week
    const ordersThisWeek = orders
        .filter((order) => {
            const orderDate = new Date(order.orderDate);
            orderDate.setHours(0, 0, 0, 0);
            const start = new Date(weekStart);
            start.setHours(0, 0, 0, 0);
            const end = new Date(weekEnd);
            end.setHours(0, 0, 0, 0);
            return orderDate >= start && orderDate <= end;
        })
        .sort(
            (a, b) =>
                new Date(a.orderDate).getTime() -
                new Date(b.orderDate).getTime()
        );

    // Handle week change via week input
    function handleWeekChange(e: React.ChangeEvent<HTMLInputElement>) {
        const [year, week] = e.target.value.split("-W");
        const simple = new Date(Number(year), 0, 1 + (Number(week) - 1) * 7);
        const monday = getMonday(simple);
        monday.setHours(0, 0, 0, 0);
        setSelectedMonday(monday);
    }

    if (loading) {
        return (
            <div className="p-6 w-full max-w-full mx-auto">
                <div className="text-lg mb-4">Chargement des client·es...</div>
                <div className="w-full h-4 bg-gray-200 rounded-md overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 w-full max-w-full mx-auto">
            <header className="bg-white shadow-md p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-1 md:px-3">
                    <h1 className="text-2xl font-bold flex-1 text-center md:text-left">
                        Client·es professionnel·les
                    </h1>
                    <div className="flex flex-col gap-2 md:flex-row md:gap-2">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm"
                            onClick={() => setShowAddClient(true)}
                        >
                            Ajouter un·e client·e
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 text-sm"
                            onClick={() => setShowAddOrder(true)}
                        >
                            Nouvelle commande
                        </button>
                    </div>
                </div>
            </header>
            <main className="p-4 md:p-6">
                {/* Week selector */}
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
                    <div className="flex items-center gap-2">
                        <label htmlFor="week-select" className="font-semibold">
                            Semaine :
                        </label>
                        <input
                            id="week-select"
                            type="week"
                            value={getWeekInputValue(selectedMonday)}
                            onChange={handleWeekChange}
                            className="border rounded px-2 py-1 text-sm"
                        />
                        <span className="text-xs md:text-base">
                            {weekStart.toLocaleDateString()} -{" "}
                            {weekEnd.toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Summary by product */}
                <div className="mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-2 md:p-6 shadow">
                        <h2 className="text-lg font-bold mb-4 text-center md:text-left">
                            Récapitulatif par produit
                        </h2>
                        {(() => {
                            // Grouping by product + unit
                            const recap: Record<
                                string,
                                { productName: string; quantity: number; unit: string }
                            > = {};
                            ordersThisWeek.forEach((order) => {
                                order.orderItems?.forEach((item) => {
                                    const key =
                                        (item.product?.name || "Produit inconnu") +
                                        " " +
                                        (item.unit || "");
                                    if (!recap[key]) {
                                        recap[key] = {
                                            productName: item.product?.name || "Produit inconnu",
                                            quantity: 0,
                                            unit: item.unit || "",
                                        };
                                    }
                                    recap[key].quantity += item.quantity;
                                });
                            });
                            const recapProducts = Object.values(recap).sort((a, b) =>
                                a.productName.localeCompare(b.productName)
                            );
                            if (recapProducts.length === 0) {
                                return (
                                    <div className="text-gray-400 text-center">
                                        Aucune commande cette semaine.
                                    </div>
                                );
                            }
                            return (
                                <ul className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    {recapProducts.map((prod) => (
                                        <li
                                            key={prod.productName + prod.unit}
                                            className="min-w-[160px]"
                                        >
                                            <span className="font-bold">{prod.quantity}</span>{" "}
                                            {prod.productName}{" "}
                                            <span className="text-gray-500">{prod.unit}</span>
                                        </li>
                                    ))}
                                </ul>
                            );
                        })()}
                    </div>
                </div>

                {/* Orders block */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold">Commandes</h2>
                    </div>
                    {ordersThisWeek.length === 0 ? (
                        <div className="text-gray-500 text-center bg-white rounded shadow p-4">
                            Aucune commande cette semaine.
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-2 md:p-6 overflow-x-auto mb-4">
                            <table className="min-w-full table-auto text-sm">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 text-center">N°</th>
                                        <th className="px-2 py-2 text-center">Client</th>
                                        <th className="px-2 py-2 text-center">Date</th>
                                        <th className="px-2 py-2 text-center">Statut</th>
                                        <th className="px-2 py-2 text-center">Montant</th>
                                        <th className="px-2 py-2 text-center">Produits</th>
                                        <th className="px-2 py-2 text-center"></th> 
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersThisWeek.map((order) => (
                                        <tr key={order.id} className="border-t">
                                            <td className="px-2 py-2 text-center">{order.id}</td>
                                            <td className="px-2 py-2 text-center">
                                                {order.client?.name || "-"}
                                            </td>
                                            <td className="px-2 py-2 text-center">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-2 py-2 text-center">
                                                {getStatusLabel(order.status)}
                                            </td>
                                            <td className="px-2 py-2 text-center">
                                                {order.totalAmount.toFixed(2)} €
                                            </td>
                                            <td className="px-2 py-2 text-center">
                                                <ul>
                                                    {order.orderItems?.map((item) => (
                                                        <li key={item.id}>
                                                            <span className="font-bold">
                                                                {item.quantity}
                                                            </span>{" "}
                                                            {item.product?.name} {item.unit} (
                                                            {item.unitPrice} €)
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-2 py-2 text-center">
                                                <button
                                                    type="button"
                                                    className="text-gray-500 hover:text-blue-600"
                                                    title="Modifier"
                                                    onClick={() => setEditOrder(order)}
                                                >
                                                    <FiEdit2 className="inline w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add order modal */}
                <AddOrderModal
                    open={showAddOrder}
                    onClose={() => setShowAddOrder(false)}
                    customers={[]} // no individuals
                    clients={clients}
                    products={products}
                    defaultProfessional={true}
                    onSuccess={() => {
                        setShowAddOrder(false);
                        fetchData();
                    }}
                />

                {/* Edit/delete order modal */}
                <EditOrderModal
                    open={!!editOrder}
                    onClose={() => setEditOrder(null)}
                    order={editOrder}
                    customers={[]}
                    clients={clients}
                    products={products}
                    onSuccess={() => {
                        setEditOrder(null);
                        fetchData();
                    }}
                />

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded shadow-sm">
                        Erreur : {error}
                    </div>
                )}

                {/* Client search/filter */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher un·e client·e..."
                        className="w-full p-2 border rounded mb-4 bg-white text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded shadow-sm">
                        Aucun client trouvé.
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-2 md:p-6 overflow-x-auto">
                        <table className="min-w-full table-auto text-sm">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">Nom</th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">Adresse</th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">Email</th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center">Téléphone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((client) => (
                                    <tr key={client.id} className="border-t">
                                        <td className="px-2 py-2 md:px-4 md:py-2 text-left">
                                            <button
                                                className="text-blue-600 underline"
                                                onClick={() => setSelectedClient(client)}
                                            >
                                                {client.name}
                                            </button>
                                        </td>
                                        <td className={`px-2 py-2 md:px-4 md:py-2 ${client.address ? "text-left" : "text-center"}`}>
                                            {client.address || "-"}
                                        </td>
                                        <td className={`px-2 py-2 md:px-4 md:py-2 ${client.email ? "text-left" : "text-center"}`}>
                                            {client.email || "-"}
                                        </td>
                                        <td className="px-2 py-2 md:px-4 md:py-2 text-center">
                                            {client.phoneNumber || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <AddClientModal
                    open={showAddClient}
                    onClose={() => setShowAddClient(false)}
                    onSuccess={() => {
                        setShowAddClient(false);
                        fetchData();
                    }}
                />

                <EditClientModal
                    client={selectedClient}
                    isOpen={!!selectedClient}
                    onClose={() => setSelectedClient(null)}
                    onSuccess={() => {
                        setSelectedClient(null);
                        fetchData();
                    }}
                />
            </main>
        </div>
    );
}