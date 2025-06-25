import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateOrder, deleteOrder, Order } from "../api/orderApi";
import { useState, useEffect } from "react";
import { updateOrderItem } from "../api/orderItemApi";
import { Product } from "../api/productApi";

type EditOrderModalProps = {
    open: boolean;
    onClose: () => void;
    order: Order | null;
    customers: { id: number; name: string }[];
    clients: { id: number; name: string }[];
    products: Product[];
    onSuccess: () => void;
};

const validationSchema = Yup.object()
    .shape({
        customerId: Yup.string(),
        clientId: Yup.string(),
        status: Yup.string().required("Statut requis"),
        orderItems: Yup.array()
            .of(
                Yup.object({
                    productId: Yup.string().required("Produit requis"),
                    quantity: Yup.number()
                        .min(0.01, "Min 0.01")
                        .required("Quantité requise"),
                    unitPrice: Yup.number()
                        .min(0, "Prix requis")
                        .required("Prix requis"),
                    unit: Yup.string().required("Unité requise"),
                })
            )
            .min(1, "Au moins un produit"),
    })
    .test(
        "one-of-customer-or-client",
        "Sélectionnez un client particulier ou professionnel",
        (values) => !!(values.customerId || values.clientId)
    );

export default function EditOrderModal({
    open,
    onClose,
    order,
    customers,
    clients,
    products,
    onSuccess,
}: EditOrderModalProps) {
    // State to manage product search inputs for each order item
    const [searches, setSearches] = useState<string[]>([]);
    // State to determine if the order is for a professional client
    const [isProfessional, setIsProfessional] = useState(true);
    // State to manage deletion status
    const [deleting, setDeleting] = useState(false);

    const activeSortedProducts = products
        .filter((p) => p.isActive)
        .sort((a, b) =>
            a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
        );

    // When the modal opens, default to professional mode
    useEffect(() => {
        if (open) setIsProfessional(true);
    }, [open]);

    // Do not render the modal if it is closed or order is null
    if (!open || !order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                {/* Modal Title */}
                <h2 className="text-lg font-semibold mb-4">
                    Modifier la commande
                </h2>
                <Formik
                    initialValues={{
                        customerId: order.customerId
                            ? String(order.customerId)
                            : "",
                        clientId: order.clientId ? String(order.clientId) : "",
                        status: order.status,
                        orderItems:
                            order.orderItems?.map((item) => ({
                                id: item.id,
                                productId: String(item.productId),
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                unit: item.unit,
                            })) || [],
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                        setStatus(null);
                        try {
                            const totalAmount = values.orderItems.reduce(
                                (sum, item) =>
                                    sum +
                                    parseFloat(
                                        String(item.quantity).replace(",", ".")
                                    ) *
                                        parseFloat(String(item.unitPrice)),
                                0
                            );

                            await updateOrder(order.id, {
                                ...(isProfessional
                                    ? { clientId: Number(values.clientId) }
                                    : {
                                          customerId: Number(values.customerId),
                                      }),
                                status: values.status,
                                totalAmount,
                            });

                            const updatePromises = values.orderItems
                                .filter((item) => item.id)
                                .map((item) =>
                                    updateOrderItem(item.id, {
                                        productId: Number(item.productId),
                                        quantity: parseFloat(
                                            String(item.quantity).replace(
                                                ",",
                                                "."
                                            )
                                        ), // conversion ici
                                        unitPrice: parseFloat(
                                            String(item.unitPrice)
                                        ),
                                    })
                                );
                            await Promise.all(updatePromises);

                            onSuccess();
                            onClose();
                        } catch (err) {
                            setStatus(
                                "Erreur lors de la modification de la commande."
                            );
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, isSubmitting, setFieldValue, status }) => (
                        <Form className="space-y-4">
                            {/* Customer selection based on professional status */}
                            <div>
                                <label className="block mb-1 font-semibold">
                                    {isProfessional
                                        ? "Client professionnel"
                                        : "Client particulier"}
                                </label>
                                <Field
                                    as="select"
                                    name={
                                        isProfessional
                                            ? "clientId"
                                            : "customerId"
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    required
                                    value={
                                        isProfessional
                                            ? values.clientId
                                            : values.customerId
                                    }
                                    onChange={(
                                        e: React.ChangeEvent<HTMLSelectElement>
                                    ) => {
                                        setFieldValue(
                                            isProfessional
                                                ? "clientId"
                                                : "customerId",
                                            e.target.value
                                        );
                                    }}
                                >
                                    <option value="">
                                        {isProfessional
                                            ? "Sélectionner un professionnel"
                                            : "Sélectionner un client"}
                                    </option>
                                    {(isProfessional ? clients : customers)
                                        .sort((a, b) =>
                                            a.name.localeCompare(b.name, "fr", {
                                                sensitivity: "base",
                                            })
                                        )
                                        .map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                </Field>
                                <ErrorMessage
                                    name={
                                        isProfessional
                                            ? "clientId"
                                            : "customerId"
                                    }
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>
                            {/* Order status selection */}
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Statut
                                </label>
                                <Field
                                    as="select"
                                    name="status"
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="PENDING">En attente</option>
                                    <option value="PREPARED">Préparée</option>
                                    <option value="CANCELLED">Annulée</option>
                                </Field>
                                <ErrorMessage
                                    name="status"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>
                            {/* Order items field array */}
                            <FieldArray name="orderItems">
                                {({ push, remove }) => (
                                    <div>
                                        <label className="block mb-1 font-semibold">
                                            Produits
                                        </label>
                                        {values.orderItems.map(
                                            (item, index) => {
                                                const searchValue =
                                                    searches[index] || "";
                                                const filteredProducts =
                                                    activeSortedProducts.filter(
                                                        (p) =>
                                                            p.name
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchValue.toLowerCase()
                                                                )
                                                    );
                                                const selectedProduct =
                                                    activeSortedProducts.find(
                                                        (p) =>
                                                            p.id ===
                                                            Number(
                                                                item.productId
                                                            )
                                                    );
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex gap-2 mb-2 items-end"
                                                    >
                                                        {/* Product search input */}
                                                        <div className="flex-1 relative">
                                                            <input
                                                                type="text"
                                                                placeholder="Rechercher un produit..."
                                                                className="border rounded px-2 py-1 w-full"
                                                                value={
                                                                    selectedProduct
                                                                        ? selectedProduct.name
                                                                        : searchValue
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newSearches =
                                                                        [
                                                                            ...searches,
                                                                        ];
                                                                    newSearches[
                                                                        index
                                                                    ] =
                                                                        e.target.value;
                                                                    setSearches(
                                                                        newSearches
                                                                    );
                                                                    setFieldValue(
                                                                        `orderItems.${index}.productId`,
                                                                        ""
                                                                    );
                                                                }}
                                                                autoComplete="off"
                                                            />
                                                            {/* Dropdown for product suggestions */}
                                                            {searchValue &&
                                                                !selectedProduct && (
                                                                    <div className="absolute bg-white border rounded shadow z-10 max-h-40 overflow-y-auto top-10 left-0 right-0">
                                                                        {filteredProducts.length ===
                                                                            0 && (
                                                                            <div className="px-2 py-1 text-gray-400">
                                                                                Aucun
                                                                                produit
                                                                                trouvé
                                                                            </div>
                                                                        )}
                                                                        {filteredProducts.map(
                                                                            (
                                                                                p
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        p.id
                                                                                    }
                                                                                    className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                                                                                    onClick={() => {
                                                                                        setFieldValue(
                                                                                            `orderItems.${index}.productId`,
                                                                                            p.id
                                                                                        );
                                                                                        setFieldValue(
                                                                                            `orderItems.${index}.unit`,
                                                                                            p.unit
                                                                                        );
                                                                                        const newSearches =
                                                                                            [
                                                                                                ...searches,
                                                                                            ];
                                                                                        newSearches[
                                                                                            index
                                                                                        ] =
                                                                                            p.name;
                                                                                        setSearches(
                                                                                            newSearches
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        p.name
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                        {/* Quantity field */}
                                                        <Field
                                                            type="number"
                                                            name={`orderItems.${index}.quantity`}
                                                            className="border rounded px-2 py-1 w-20"
                                                            min={0.01}
                                                            step={0.01}
                                                            placeholder="Qté"
                                                            onChange={(
                                                                e: React.ChangeEvent<HTMLInputElement>
                                                            ) =>
                                                                setFieldValue(
                                                                    `orderItems.${index}.quantity`,
                                                                    parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ) || ""
                                                                )
                                                            }
                                                        />
                                                        {/* Unit selection field */}
                                                        <Field
                                                            as="select"
                                                            name={`orderItems.${index}.unit`}
                                                            className="border rounded px-2 py-1"
                                                            required
                                                            value={item.unit}
                                                            onChange={(
                                                                e: React.ChangeEvent<HTMLSelectElement>
                                                            ) =>
                                                                setFieldValue(
                                                                    `orderItems.${index}.unit`,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            <option value="">
                                                                Unité
                                                            </option>
                                                            <option value="KG">
                                                                KG
                                                            </option>
                                                            <option value="L">
                                                                L
                                                            </option>
                                                            <option value="UN">
                                                                UN
                                                            </option>
                                                        </Field>
                                                        {/* Unit price field with currency symbol */}
                                                        <div className="relative w-24">
                                                            <Field
                                                                type="number"
                                                                name={`orderItems.${index}.unitPrice`}
                                                                className="border rounded px-2 py-1 w-full pr-6"
                                                                min={0}
                                                                step={0.01}
                                                                placeholder="Prix"
                                                            />
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                                                €
                                                            </span>
                                                        </div>
                                                        {/* Remove product button if more than one product exists */}
                                                        {values.orderItems
                                                            .length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="text-red-500 font-bold px-2"
                                                                onClick={() => {
                                                                    const newSearches =
                                                                        [
                                                                            ...searches,
                                                                        ];
                                                                    newSearches.splice(
                                                                        index,
                                                                        1
                                                                    );
                                                                    setSearches(
                                                                        newSearches
                                                                    );
                                                                    remove(
                                                                        index
                                                                    );
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                        {/* Button to add a new product */}
                                        <button
                                            type="button"
                                            className="bg-gray-200 px-3 py-1 rounded mt-2"
                                            onClick={() => {
                                                push({
                                                    productId: "",
                                                    quantity: 1,
                                                    unitPrice: 0,
                                                    unit: "",
                                                });
                                                setSearches([...searches, ""]);
                                            }}
                                        >
                                            Ajouter un produit
                                        </button>
                                    </div>
                                )}
                            </FieldArray>
                            {/* Total amount display */}
                            <div>
                                <label className="block mb-1">
                                    Montant total
                                </label>
                                <div className="font-semibold">
                                    {values.orderItems
                                        .reduce(
                                            (sum, item) =>
                                                sum +
                                                item.quantity * item.unitPrice,
                                            0
                                        )
                                        .toFixed(2)}{" "}
                                    €
                                </div>
                            </div>
                            {/* Display any submission error/status */}
                            {status && (
                                <div className="text-red-500 text-sm">
                                    {status}
                                </div>
                            )}
                            <div className="flex justify-between gap-2 mt-2">
                                {/* Cancel button */}
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                >
                                    Annuler
                                </button>
                                {/* Delete order button */}
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-red-600 text-white"
                                    disabled={isSubmitting || deleting}
                                    onClick={async () => {
                                        if (
                                            window.confirm(
                                                "Supprimer cette commande ? Cette action est irréversible."
                                            )
                                        ) {
                                            setDeleting(true);
                                            try {
                                                await deleteOrder(order.id);
                                                onSuccess();
                                                onClose();
                                            } catch (err) {
                                                alert(
                                                    "Erreur lors de la suppression."
                                                );
                                            } finally {
                                                setDeleting(false);
                                            }
                                        }
                                    }}
                                >
                                    {deleting ? "Suppression..." : "Supprimer"}
                                </button>
                                {/* Save submission button */}
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Enregistrement..."
                                        : "Enregistrer"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
