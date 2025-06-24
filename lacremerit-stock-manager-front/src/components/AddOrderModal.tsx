import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postOrder } from "../api/orderApi";
import { useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  unit: string;
};

type AddOrderModalProps = {
  open: boolean;
  onClose: () => void;
  customers: { id: number; name: string }[];
  clients: { id: number; name: string }[];
  products: Product[];
  onSuccess: () => void;
  defaultProfessional?: boolean;
};

const validationSchema = Yup.object().shape({
  customerId: Yup.string(),
  clientId: Yup.string(),
  orderItems: Yup.array()
    .of(
      Yup.object({
        productId: Yup.string().required("Produit requis"),
        quantity: Yup.number().min(1, "Min 1").required("Quantité requise"),
        unitPrice: Yup.number().min(0, "Prix requis").required("Prix requis"),
        unit: Yup.string().required("Unité requise"),
      })
    )
    .min(1, "Au moins un produit"),
}).test(
  "one-of-customer-or-client",
  "Sélectionnez un client particulier ou professionnel",
  (values) => !!(values.customerId || values.clientId)
);

export default function AddOrderModal({
  open,
  onClose,
  customers,
  clients,
  products,
  onSuccess,
  defaultProfessional = false,
}: AddOrderModalProps) {
  const [searches, setSearches] = useState<string[]>([]);
  const [isProfessional, setIsProfessional] = useState(defaultProfessional);

  // Set professional mode if defaultProfessional is true when modal opens
  useEffect(() => {
    if (open && defaultProfessional) {
      setIsProfessional(true);
    }
  }, [open, defaultProfessional]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Modal Title */}
        <h2 className="text-lg font-semibold mb-4">Nouvelle commande</h2>
        {/* Customer Type Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!isProfessional}
              onChange={() => setIsProfessional(false)}
            />
            Particulier
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={isProfessional}
              onChange={() => setIsProfessional(true)}
            />
            Professionnel
          </label>
        </div>
        <Formik
          initialValues={{
            customerId: "",
            clientId: "",
            orderItems: [{ productId: "", quantity: 1, unitPrice: 0, unit: "" }],
            status: "PENDING",
            orderDate: new Date().toISOString().slice(0, 10),
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
            setStatus(null);
            try {
              // Calculate total amount for the order
              const totalAmount = values.orderItems.reduce(
                (sum, item) => sum + item.quantity * item.unitPrice,
                0
              );
              // Post order using clientId or customerId based on selection
              await postOrder({
                ...(isProfessional
                  ? { clientId: Number(values.clientId) }
                  : { customerId: Number(values.customerId) }),
                orderDate: values.orderDate,
                status: values.status,
                totalAmount,
                orderItems: values.orderItems.map((item) => ({
                  productId: Number(item.productId),
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                })),
              });
              resetForm();
              onSuccess();
            } catch (err) {
              setStatus("Erreur lors de la création de la commande.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting, setFieldValue, status }) => (
            <Form className="space-y-4">
              {/* Customer Selection */}
              <div>
                <label className="block mb-1 font-semibold">
                  {isProfessional ? "Client professionnel" : "Client particulier"}
                </label>
                <Field
                  as="select"
                  name={isProfessional ? "clientId" : "customerId"}
                  className="w-full border rounded px-3 py-2"
                  required
                  value={isProfessional ? values.clientId : values.customerId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue(
                      isProfessional ? "clientId" : "customerId",
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
                      a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
                    )
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  name={isProfessional ? "clientId" : "customerId"}
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Order Items Field Array */}
              <FieldArray name="orderItems">
                {({ push, remove }) => (
                  <div>
                    <label className="block mb-1 font-semibold">Produits</label>
                    {values.orderItems.map((item, index) => {
                      const searchValue = searches[index] || "";
                      const filteredProducts = products.filter((p) =>
                        p.name.toLowerCase().includes(searchValue.toLowerCase())
                      );
                      const selectedProduct = products.find(
                        (p) => p.id === Number(item.productId)
                      );
                      return (
                        <div key={index} className="flex gap-2 mb-2 items-end">
                          {/* Product Search Input */}
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Rechercher un produit..."
                              className="border rounded px-2 py-1 w-full"
                              value={selectedProduct ? selectedProduct.name : searchValue}
                              onChange={(e) => {
                                const newSearches = [...searches];
                                newSearches[index] = e.target.value;
                                setSearches(newSearches);
                                setFieldValue(`orderItems.${index}.productId`, "");
                                setFieldValue(`orderItems.${index}.unit`, "");
                              }}
                              autoComplete="off"
                            />
                            {searchValue && !selectedProduct && (
                              <div className="absolute bg-white border rounded shadow z-10 max-h-40 overflow-y-auto top-10 left-0 right-0">
                                {filteredProducts.length === 0 && (
                                  <div className="px-2 py-1 text-gray-400">
                                    Aucun produit trouvé
                                  </div>
                                )}
                                {filteredProducts.map((p) => (
                                  <div
                                    key={p.id}
                                    className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => {
                                      setFieldValue(`orderItems.${index}.productId`, p.id);
                                      setFieldValue(`orderItems.${index}.unit`, p.unit);
                                      const newSearches = [...searches];
                                      newSearches[index] = p.name;
                                      setSearches(newSearches);
                                    }}
                                  >
                                    {p.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Quantity Input */}
                          <Field
                            type="number"
                            name={`orderItems.${index}.quantity`}
                            className="border rounded px-2 py-1 w-20"
                            min={1}
                            placeholder="Qté"
                          />
                          {/* Unit Select */}
                          <Field
                            as="select"
                            name={`orderItems.${index}.unit`}
                            className="border rounded px-2 py-1"
                            required
                          >
                            <option value="">Unité</option>
                            <option value="KG">KG</option>
                            <option value="L">L</option>
                            <option value="UN">UN</option>
                          </Field>
                          {/* Unit Price Input with Currency Symbol */}
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
                          {/* Remove Product Button */}
                          {values.orderItems.length > 1 && (
                            <button
                              type="button"
                              className="text-red-500 font-bold px-2"
                              onClick={() => {
                                const newSearches = [...searches];
                                newSearches.splice(index, 1);
                                setSearches(newSearches);
                                remove(index);
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {/* Add Product Button */}
                    <button
                      type="button"
                      className="bg-gray-200 px-3 py-1 rounded mt-2"
                      onClick={() => {
                        push({ productId: "", quantity: 1, unitPrice: 0, unit: "" });
                        setSearches([...searches, ""]);
                      }}
                    >
                      Ajouter un produit
                    </button>
                  </div>
                )}
              </FieldArray>
              {/* Total Amount Display */}
              <div>
                <label className="block mb-1">Montant total</label>
                <div className="font-semibold">
                  {values.orderItems
                    .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                    .toFixed(2)}{" "}
                  €
                </div>
              </div>
              {/* Display submission error */}
              {status && <div className="text-red-500 text-sm">{status}</div>}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Création..." : "Créer"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}