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
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch customers on load
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  // CREATE or UPDATE customer
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId === null) {
        const newCustomer = await createCustomer({ name, email });
        setCustomers((prev) => [...prev, newCustomer]);
      } else {
        const updated = await updateCustomer(editingId, { name, email });
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingId ? updated : c))
        );
      }
      setName("");
      setEmail("");
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save customer", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingId(customer.id);
    setName(customer.name);
    setEmail(customer.email);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setEmail("");
  };

  // DELETE customer
  const handleDelete = async (id: number) => {
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete customer", error);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Customer List</h2>

      {/* CREATE / UPDATE FORM */}
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId === null ? "Add Customer" : "Update Customer"}
        </button>
        {editingId !== null && (
          <button type="button" onClick={handleCancelEdit} disabled={loading} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      {/* LIST */}
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <strong>{customer.name}</strong> — {customer.email}
            <button
              style={{ marginLeft: 10 }}
              onClick={() => handleEditClick(customer)}
            >
              Edit
            </button>
            <button
              style={{ marginLeft: 10 }}
              onClick={() => handleDelete(customer.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;