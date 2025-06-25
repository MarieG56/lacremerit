import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postCustomer } from "../api/customerApi";

// Define the props for the AddCustomerModal component
type AddCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

// Validation schema for the form using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  address: Yup.string(),
  email: Yup.string().email("Email invalide"),
  phoneNumber: Yup.string(),
});

export default function AddCustomerModal({ open, onClose, onSuccess }: AddCustomerModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        {/* Modal title */}
        <h2 className="text-lg font-semibold mb-4">Ajouter un·e client·e</h2>
        <Formik
          initialValues={{
            name: "",
            address: "",
            email: "",
            phoneNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
            setStatus(null);
            try {
              const payload: Record<string, any> = { name: values.name.trim() };
              if (values.address) payload.address = values.address;
              if (values.email) payload.email = values.email;
              if (values.phoneNumber) payload.phoneNumber = values.phoneNumber;

              await postCustomer(payload);
              onSuccess();
              onClose();
              resetForm();
            } catch (err) {
              setStatus("Erreur lors de l'ajout du·de la client·e.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-3">
              {/* Customer name input */}
              <Field
                className="w-full border rounded px-3 py-2"
                name="name"
                placeholder="Nom"
                required
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />

              {/* Customer address input */}
              <Field
                className="w-full border rounded px-3 py-2"
                name="address"
                placeholder="Adresse"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />

              {/* Customer email input */}
              <Field
                className="w-full border rounded px-3 py-2"
                name="email"
                placeholder="Email"
                type="email"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

              {/* Customer phone number input */}
              <Field
                className="w-full border rounded px-3 py-2"
                name="phoneNumber"
                placeholder="Téléphone"
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />

              {/* Display submission status or error */}
              {status && <div className="text-red-500 text-sm">{status}</div>}
              <div className="flex justify-end gap-2 mt-2">
                {/* Cancel button */}
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                {/* Submit button */}
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Ajout..." : "Ajouter"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}