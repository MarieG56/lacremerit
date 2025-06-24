import React, { useState } from "react";
import { FiEdit2, FiX, FiCheck, FiXCircle } from "react-icons/fi";
import { updateCustomer, deleteCustomer, Customer } from "../api/customerApi";

type CustomerListModalProps = {
  open: boolean;
  customers: Customer[];
  onClose: () => void;
  onRefresh?: () => void;
};

export default function CustomerListModal({
  open,
  customers,
  onClose,
  onRefresh,
}: CustomerListModalProps) {
  // State to track which customer is being edited and temporary edit values
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Customer>>({});
  // State to track the loading status for a given customer ID
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Do not render the modal if it's not open
  if (!open) return null;

  // Set a customer in edit mode and initialize the edit values
  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditValues({ ...customer });
  };

  // Update the edit values from input changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save the edited customer data by updating it
  const handleEditSave = async () => {
    if (!editingId) return;
    setLoadingId(editingId);
    // Exclude unnecessary fields from the payload (e.g., timestamps)
    const { id, created_at, updated_at, ...customerData } = editValues as any;
    await updateCustomer(Number(editingId), customerData);
    setEditingId(null);
    setLoadingId(null);
    if (onRefresh) onRefresh();
  };

  // Cancel editing mode and reset the edit values
  const handleEditCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  // Delete a customer after confirmation
  const handleDelete = async (customer: Customer) => {
    if (window.confirm(`Supprimer ${customer.name} ?`)) {
      setLoadingId(customer.id);
      await deleteCustomer(Number(customer.id));
      setLoadingId(null);
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl md:max-w-3xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Clients magasin</h2>
          <button
            className="text-gray-500 hover:text-red-600 text-xl"
            onClick={onClose}
            title="Fermer"
          >
            ×
          </button>
        </div>
        {customers.length === 0 ? (
          <div className="text-gray-400 text-center py-8">Aucun client.</div>
        ) : (
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left">Nom</th>
                <th className="px-2 py-2 text-left">Adresse</th>
                <th className="px-2 py-2 text-left">Email</th>
                <th className="px-2 py-2 text-left">Téléphone</th>
                <th className="px-2 py-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t">
                  {editingId === customer.id ? (
                    <>
                      {/* Editable fields for the customer */}
                      <td className="px-2 py-2">
                        <input
                          name="name"
                          value={editValues.name || ""}
                          onChange={handleEditChange}
                          className="border rounded px-1 py-0.5 w-full"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          name="address"
                          value={editValues.address || ""}
                          onChange={handleEditChange}
                          className="border rounded px-1 py-0.5 w-full"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          name="email"
                          value={editValues.email || ""}
                          onChange={handleEditChange}
                          className="border rounded px-1 py-0.5 w-full"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          name="phoneNumber"
                          value={editValues.phoneNumber || ""}
                          onChange={handleEditChange}
                          className="border rounded px-1 py-0.5 w-full"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        {/* Save edited customer */}
                        <button
                          className="text-green-600 hover:text-green-800 mr-2"
                          title="Enregistrer"
                          onClick={handleEditSave}
                          disabled={loadingId === customer.id}
                        >
                          <FiCheck className="inline w-5 h-5" />
                        </button>
                        {/* Cancel editing */}
                        <button
                          className="text-gray-500 hover:text-gray-800"
                          title="Annuler"
                          onClick={handleEditCancel}
                          disabled={loadingId === customer.id}
                        >
                          <FiXCircle className="inline w-5 h-5" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Display customer details */}
                      <td className="px-2 py-2">{customer.name}</td>
                      <td className="px-2 py-2">{customer.address || "-"}</td>
                      <td className="px-2 py-2">{customer.email || "-"}</td>
                      <td className="px-2 py-2">{customer.phoneNumber || "-"}</td>
                      <td className="px-2 py-2 text-center">
                        {/* Edit customer button */}
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          title="Modifier"
                          onClick={() => handleEdit(customer)}
                          disabled={loadingId !== null}
                        >
                          <FiEdit2 className="inline w-5 h-5" />
                        </button>
                        {/* Delete customer button */}
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Supprimer"
                          onClick={() => handleDelete(customer)}
                          disabled={loadingId !== null}
                        >
                          <FiX className="inline w-5 h-5" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}