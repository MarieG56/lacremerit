import { useEffect, useState } from "react";
import AddCustomerModal from "../components/AddCustomerModal";
import AddOrderModal from "../components/AddOrderModal";
import { Order, getAllOrders, updateOrder, deleteOrder } from "../api/orderApi";
import { getAllProducts, Product } from "../api/productApi";
import { getAllCustomers } from "../api/customerApi";
import { FiEdit2, FiX, FiCheck, FiXCircle } from "react-icons/fi";
import { updateOrderItem, deleteOrderItem, postOrderItem } from "../api/orderItemApi";
import { getAllClients } from "../api/clientApi";

// Returns the Monday for the given date
function getMonday(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - ((day + 6) % 7);
    return new Date(date.setDate(diff));
}

export default function OrdersPage() {
    // State variables
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showAddOrder, setShowAddOrder] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [clients, setClients] = useState<any[]>([]); // Clients added
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<{
        status: string;
        customerId: number | "";
        orderItems: {
            id: number;
            productId: number | "";
            quantity: number;
            unit: string;
            unitPrice: number;
        }[];
    } | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletedOrderItemIds, setDeletedOrderItemIds] = useState<number[]>([]);
    const [selectedMonday, setSelectedMonday] = useState<Date>(() => getMonday(new Date()));

    // Fetch orders when the component mounts
    useEffect(() => {
        getAllOrders()
            .then((res) => setOrders(res?.data ?? []))
            .finally(() => setLoading(false));
    }, []);

    // Fetch customers, products, and clients for the modals
    useEffect(() => {
        getAllCustomers().then((res) => setCustomers(res?.data ?? []));
        getAllProducts().then((res) => setProducts(res?.data ?? []));
        getAllClients().then((res) => setClients(res?.data ?? []));
    }, []);

    // Calculate the start and end dates of the selected week
    const weekStart = new Date(selectedMonday);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(0, 0, 0, 0);

    // Filter orders to include only those with a customerId that fall within the selected week
    const ordersThisWeek = orders
        .filter((order) => order.customerId)
        .filter((order) => {
            const orderDate = new Date(order.orderDate);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate >= weekStart && orderDate <= weekEnd;
        })
        .sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());

    // Returns the label for the order status
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

    // Start editing a selected order
    function startEdit(order: Order) {
        setEditingOrderId(order.id);
        setEditValues({
            status: order.status,
            customerId:
                order.customer && typeof order.customer === "object" && "id" in order.customer
                    ? (order.customer as any).id
                    : "",
            orderItems: (order.orderItems ?? []).map((item) => ({
                id: item.id,
                productId:
                    item.product && typeof item.product === "object" && "id" in item.product
                        ? (item.product as any).id
                        : "",
                quantity: item.quantity,
                unit: item.unit,
                unitPrice: item.unitPrice,
            })),
        });
        setDeletedOrderItemIds([]);
    }

    // Save the modifications made to an order
    async function saveEdit(order: Order) {
        setSaving(true);
        try {
            // Calculate the total amount from the edited order items
            const totalAmount =
                editValues?.orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) ?? 0;

            // PATCH the order (update status, customer, and total amount)
            await updateOrder(order.id, {
                status: editValues?.status,
                customerId:
                    typeof editValues?.customerId === "number" ? editValues.customerId : undefined,
                totalAmount, // Added here
            });

            // Separate new items (without a valid id) from existing ones
            const newItems =
                editValues?.orderItems?.filter((item) => !item.id || typeof item.id !== "number" || item.id < 0) ?? [];
            const existingItems =
                editValues?.orderItems?.filter(
                    (item) =>
                        item.id && typeof item.id === "number" && item.id > 0 && !deletedOrderItemIds.includes(item.id)
                ) ?? [];

            // PATCH existing order items
            const updatePromises = existingItems.map((item) =>
                updateOrderItem(item.id, {
                    productId: typeof item.productId === "number" ? item.productId : undefined,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                })
            );

            // POST new order items
            const postPromises = newItems.map((item) =>
                postOrderItem({
                    orderId: order.id,
                    productId: typeof item.productId === "number" ? item.productId : undefined,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                })
            );

            // DELETE removed order items
            const deletePromises = deletedOrderItemIds
                .filter((id) => id > 0)
                .map((id) => deleteOrderItem(id));

            await Promise.all([...updatePromises, ...postPromises, ...deletePromises]);

            setEditingOrderId(null);
            setEditValues(null);
            setDeletedOrderItemIds([]);
            setSaving(false);
            setLoading(true);
            getAllOrders()
                .then((res) => setOrders(res?.data ?? []))
                .finally(() => setLoading(false));
        } catch (err) {
            console.error("Erreur dans saveEdit :", err);
            setSaving(false);
        }
    }

    // Cancel edit mode and reset edit state
    function cancelEdit() {
        setEditingOrderId(null);
        setEditValues(null);
        setDeletedOrderItemIds([]);
    }

    // Handle change in week input
    function handleWeekChange(e: React.ChangeEvent<HTMLInputElement>) {
        const [year, week] = e.target.value.split("-W");
        const firstJan = new Date(Number(year), 0, 1);
        const days = (Number(week) - 1) * 7;
        const monday = new Date(firstJan.setDate(firstJan.getDate() - firstJan.getDay() + 1 + days));
        monday.setHours(0, 0, 0, 0);
        setSelectedMonday(monday);
    }

    // Format the week input value (e.g., "2025-W24")
    function getWeekInputValue(date: Date) {
        const year = date.getFullYear();
        const tempDate = new Date(date.getTime());
        tempDate.setHours(0, 0, 0, 0);
        tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
        const week1 = new Date(tempDate.getFullYear(), 0, 4);
        const weekNo =
            1 +
            Math.round(
                ((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
            );
        return `${year}-W${String(weekNo).padStart(2, "0")}`;
    }

    return (
        <div className="min-h-screen bg-gray-100 w-full max-w-full mx-auto">
            <header className="bg-white shadow-md p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-1 md:px-3">
                    <h1 className="text-2xl font-bold flex-1 text-center md:text-left">
                        Commandes
                    </h1>
                    <div className="flex flex-col gap-2 md:flex-row md:gap-2">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm"
                            onClick={() => setShowAddOrder(true)}
                        >
                            Nouvelle commande
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 text-sm"
                            onClick={() => setShowAddCustomer(true)}
                        >
                            Ajouter un·e client·e
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
                            {selectedMonday.toLocaleDateString()} -{" "}
                            {new Date(selectedMonday.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Summary by producer */}
                <div className="mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-2 md:p-6 shadow flex flex-col md:flex-row gap-4 md:gap-8">
                        <div className="w-full">
                            <h2 className="text-lg font-bold mb-4 text-center md:text-left">
                                Récapitulatif par producteurice
                            </h2>
                            {(() => {
                                // Group products by producer and product
                                const recap: Record<
                                    string,
                                    Record<
                                        string,
                                        {
                                            productName: string;
                                            quantity: number;
                                            unit: string;
                                        }
                                    >
                                > = {};
                                ordersThisWeek.forEach((order) => {
                                    order.orderItems?.forEach((item) => {
                                        const product = item.product as Product | undefined;
                                        const producer = product?.producer?.name || "Inconnu";
                                        const productKey = (product?.name || "Produit inconnu") + " " + item.unit;
                                        if (!recap[producer]) recap[producer] = {};
                                        if (!recap[producer][productKey]) {
                                            recap[producer][productKey] = {
                                                productName: product?.name || "Produit inconnu",
                                                quantity: 0,
                                                unit: item.unit,
                                            };
                                        }
                                        recap[producer][productKey].quantity += item.quantity;
                                    });
                                });
                                const producers = Object.keys(recap).sort();
                                if (producers.length === 0) {
                                    return (
                                        <div className="text-gray-400 text-center">
                                            Aucune commande cette semaine.
                                        </div>
                                    );
                                }
                                return (
                                    <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
                                        {producers.map((producer) => (
                                            <div key={producer} className="mb-4 min-w-[180px]">
                                                <div className="font-semibold mb-2">
                                                    {producer}
                                                </div>
                                                <ul className="list-none pl-0">
                                                    {Object.values(recap[producer])
                                                        .sort((a, b) =>
                                                            a.productName.localeCompare(b.productName)
                                                        )
                                                        .map((prod) => (
                                                            <li key={prod.productName}>
                                                                <span className="font-bold">
                                                                    {prod.quantity}
                                                                </span>{" "}
                                                                {prod.productName}{" "}
                                                                <span className="text-gray-500">
                                                                    {prod.unit}
                                                                </span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Chargement...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-2 md:p-6 overflow-x-auto">
                        <table className="min-w-full table-auto text-sm">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center align-top">N°</th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center align-top">Client·e</th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center align-top">Date</th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center align-top">Statut</th>
                                    <th className="px-2 py-2 md:px-4 md:py-2 text-center align-top">Montant</th>
                                    <th className="px-2 py-2">Produits</th>
                                    <th className="px-2 py-2 text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersThisWeek.map((order) => (
                                    <>
                                        <tr key={order.id} className="border-t group hover:bg-gray-50">
                                            <td className="px-2 py-2 md:px-4 md:py-2 text-center align-top">{order.id}</td>
                                            <td className="px-2 py-2 md:px-4 md:py-2 text-center align-top">
                                                {editingOrderId === order.id ? (
                                                    <select
                                                        className="border rounded px-2 py-1 text-sm"
                                                        value={editValues?.customerId || ""}
                                                        onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev!,
                                                                customerId: Number(e.target.value),
                                                            }))
                                                        }
                                                        disabled={saving}
                                                    >
                                                        <option value="">Sélectionner un client</option>
                                                        {customers.map((c) => (
                                                            <option key={c.id} value={c.id}>
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    order.customer?.name
                                                )}
                                            </td>
                                            <td className="px-2 py-2 md:px-4 md:py-2 text-center align-top">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-2 py-2 md:px-4 md:py-2 text-center align-top">
                                                {editingOrderId === order.id ? (
                                                    <select
                                                        className="border rounded px-2 py-1 text-sm"
                                                        value={editValues?.status || ""}
                                                        onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev!,
                                                                status: e.target.value,
                                                            }))
                                                        }
                                                        disabled={saving}
                                                    >
                                                        <option value="PENDING">En attente</option>
                                                        <option value="PREPARED">Préparée</option>
                                                        <option value="CANCELLED">Annulée</option>
                                                    </select>
                                                ) : (
                                                    getStatusLabel(order.status)
                                                )}
                                            </td>
                                            <td className="px-2 py-2 md:px-4 md:py-2 text-center align-top">
                                                {editingOrderId === order.id ? null : order.totalAmount.toFixed(2) + " €"}
                                            </td>
                                            <td className="px-2 py-2 align-top">
                                                {editingOrderId === order.id ? null : (
                                                    <ul>
                                                        {order.orderItems?.map((item) => (
                                                            <li key={item.id}>
                                                                <span className="font-bold">{item.quantity}</span>{" "}
                                                                {item.product?.name} {item.unit} ({item.unitPrice} €)
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </td>
                                            <td className="px-2 py-2 text-center whitespace-nowrap align-top">
                                                {editingOrderId === order.id ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="text-green-600 hover:text-green-800 mr-2"
                                                            title="Valider"
                                                            onClick={() => saveEdit(order)}
                                                            disabled={saving}
                                                        >
                                                            <FiCheck className="inline w-5 h-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-gray-400 hover:text-red-600"
                                                            title="Annuler"
                                                            onClick={cancelEdit}
                                                            disabled={saving}
                                                        >
                                                            <FiXCircle className="inline w-5 h-5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="text-gray-500 hover:text-blue-600 mr-2"
                                                            title="Modifier"
                                                            onClick={() => startEdit(order)}
                                                        >
                                                            <FiEdit2 className="inline w-5 h-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-gray-400 hover:text-red-600"
                                                            title="Supprimer"
                                                            onClick={async () => {
                                                                if (window.confirm("Supprimer cette commande ?")) {
                                                                    setLoading(true);
                                                                    await deleteOrder(order.id);
                                                                    getAllOrders()
                                                                        .then((res) => setOrders(res?.data ?? []))
                                                                        .finally(() => setLoading(false));
                                                                }
                                                            }}
                                                            disabled={loading}
                                                        >
                                                            <FiX className="inline w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                        {/* Mobile-first edit row */}
                                        {editingOrderId === order.id && (
                                            <>
                                                {/* One row per product */}
                                                {editValues?.orderItems.map((item, idx) => (
                                                    <tr key={item.id} className="bg-gray-50">
                                                        <td colSpan={7} className="px-2 py-2">
                                                            <div className="flex flex-row flex-wrap gap-2 items-end">
                                                                <div className="flex flex-col w-20">
                                                                    <label className="text-xs text-gray-500 mb-1">Quantité</label>
                                                                    <input
                                                                        type="number"
                                                                        className="border rounded px-2 py-1 w-full text-sm"
                                                                        min={1}
                                                                        value={item.quantity}
                                                                        onChange={(e) => {
                                                                            const newItems = [...editValues.orderItems];
                                                                            newItems[idx].quantity = Number(e.target.value);
                                                                            setEditValues(ev => ev ? { ...ev, orderItems: newItems } : ev);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col w-32">
                                                                    <label className="text-xs text-gray-500 mb-1">Produit</label>
                                                                    <select
                                                                        className="border rounded px-2 py-1 w-full text-sm"
                                                                        value={item.productId}
                                                                        onChange={(e) => {
                                                                            const newItems = [...editValues.orderItems];
                                                                            newItems[idx].productId = Number(e.target.value);
                                                                            setEditValues(ev => ev ? { ...ev, orderItems: newItems } : ev);
                                                                        }}
                                                                    >
                                                                        <option value="">Produit</option>
                                                                        {products.map(p => (
                                                                            <option key={p.id} value={p.id}>
                                                                                {p.name}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="flex flex-col w-20">
                                                                    <label className="text-xs text-gray-500 mb-1">Unité</label>
                                                                    <select
                                                                        className="border rounded px-2 py-1 w-full text-sm"
                                                                        value={item.unit}
                                                                        onChange={(e) => {
                                                                            const newItems = [...editValues.orderItems];
                                                                            newItems[idx].unit = e.target.value;
                                                                            setEditValues(ev => ev ? { ...ev, orderItems: newItems } : ev);
                                                                        }}
                                                                    >
                                                                        <option value="KG">KG</option>
                                                                        <option value="L">L</option>
                                                                        <option value="UN">UN</option>
                                                                    </select>
                                                                </div>
                                                                <div className="flex flex-col w-24">
                                                                    <label className="text-xs text-gray-500 mb-1">Prix unitaire</label>
                                                                    <input
                                                                        type="number"
                                                                        className="border rounded px-2 py-1 w-full text-sm"
                                                                        min={0}
                                                                        step={0.01}
                                                                        value={item.unitPrice}
                                                                        onChange={(e) => {
                                                                            const newItems = [...editValues.orderItems];
                                                                            newItems[idx].unitPrice = Number(e.target.value);
                                                                            setEditValues(ev => ev ? { ...ev, orderItems: newItems } : ev);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col justify-end">
                                                                    <button
                                                                        type="button"
                                                                        className="text-red-600 hover:text-red-800"
                                                                        title="Supprimer ce produit"
                                                                        onClick={() => {
                                                                            setDeletedOrderItemIds(ids => [...ids, item.id]);
                                                                            setEditValues(ev =>
                                                                                ev ? { ...ev, orderItems: ev.orderItems.filter(oi => oi.id !== item.id) } : ev
                                                                            );
                                                                        }}
                                                                    >
                                                                        <FiX />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {/* Row for the "add product" button */}
                                                <tr className="bg-gray-50">
                                                    <td colSpan={7} className="px-2 py-2">
                                                        <button
                                                            type="button"
                                                            className="w-full md:w-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                                            onClick={() => {
                                                                setEditValues(ev =>
                                                                    ev ? {
                                                                        ...ev,
                                                                        orderItems: [
                                                                            ...ev.orderItems,
                                                                            {
                                                                                id: -Date.now(),
                                                                                productId: "",
                                                                                quantity: 1,
                                                                                unit: "KG",
                                                                                unitPrice: 0,
                                                                            },
                                                                        ],
                                                                    } : ev
                                                                );
                                                            }}
                                                            disabled={saving}
                                                        >
                                                            + Ajouter un produit
                                                        </button>
                                                    </td>
                                                </tr>
                                                {/* Row for displaying total amount */}
                                                <tr className="bg-gray-50">
                                                    <td colSpan={7} className="px-2 py-2">
                                                        <label className="text-xs text-gray-500 mb-1 block">
                                                            Montant total
                                                        </label>
                                                        <span className="block text-base font-semibold">
                                                            {(
                                                                editValues?.orderItems.reduce(
                                                                    (
                                                                        sum,
                                                                        item
                                                                    ) =>
                                                                        sum +
                                                                        item.quantity *
                                                                            item.unitPrice,
                                                                    0
                                                                ) ?? 0
                                                            ).toFixed(2)}{" "}
                                                            €
                                                        </span>
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </>
                                ))}
                                {ordersThisWeek.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center py-4 text-gray-400"
                                        >
                                            Aucune commande trouvée.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            <AddCustomerModal
                open={showAddCustomer}
                onClose={() => setShowAddCustomer(false)}
                onSuccess={() => {
                    getAllCustomers().then((res) =>
                        setCustomers(res?.data ?? [])
                    );
                }}
            />
            <AddOrderModal
                open={showAddOrder}
                onClose={() => setShowAddOrder(false)}
                customers={customers}
                clients={clients} // <-- Ajouté
                products={products}
                onSuccess={() => {
                    setShowAddOrder(false);
                    setLoading(true);
                    getAllOrders()
                        .then((res) => setOrders(res?.data ?? []))
                        .finally(() => setLoading(false));
                }}
            />
        </div>
    );
}
