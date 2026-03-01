import React, { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api";
import { Customer } from "../types";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError("Failed to load customers.");
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await createCustomer({ name, email });
      setCustomers((prev) => [...prev, newCustomer]);
      setName("");
      setEmail("");
    } catch (err) {
      setError("Failed to create customer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (c: Customer) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditEmail(c.email);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId == null) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await updateCustomer(editingId, {
        name: editName,
        email: editEmail,
      });
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingId ? updated : c))
      );
      cancelEdit();
    } catch (err) {
      setError("Failed to update customer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this customer?")) return;
    setError(null);
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError("Failed to delete customer.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Customers</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6"
      >
        <h3 className="text-lg font-semibold text-slate-700 mb-4">
          Add customer
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
        >
          {loading ? "Saving..." : "Add customer"}
        </button>
      </form>

      <ul className="space-y-2">
        {customers.map((customer) => (
          <li
            key={customer.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3"
          >
            {editingId === customer.id ? (
              <form
                onSubmit={handleUpdate}
                className="flex-1 flex flex-wrap items-center gap-3"
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none flex-1 min-w-[120px]"
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none flex-1 min-w-[160px]"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <span className="font-semibold text-slate-800">
                    {customer.name}
                  </span>
                  <span className="text-slate-500 ml-2">{customer.email}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(customer)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {customers.length === 0 && !error && (
        <p className="text-slate-500 text-center py-8">No customers yet.</p>
      )}
    </div>
  );
};

export default CustomerList;
