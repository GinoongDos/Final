import React, { useEffect, useState } from "react";
import {
  getOrders,
  getCustomers,
  getProducts,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../api";
import {
  Order,
  Customer,
  Product,
  OrderItemWrite,
} from "../types";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<OrderItemWrite[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCustomerId, setEditCustomerId] = useState("");
  const [editItems, setEditItems] = useState<OrderItemWrite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    getCustomers().then(setCustomers);
    getProducts().then(setProducts);
  }, []);

  const fetchOrders = async () => {
    try {
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders.");
      console.error(err);
    }
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { product: products[0]?.id ?? 0, quantity: 1 }]);
  };

  const updateItem = (index: number, field: "product" | "quantity", value: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addEditItemRow = () => {
    setEditItems((prev) => [
      ...prev,
      { product: products[0]?.id ?? 0, quantity: 1 },
    ]);
  };

  const updateEditItem = (
    index: number,
    field: "product" | "quantity",
    value: number
  ) => {
    setEditItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeEditItem = (index: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cid = parseInt(customerId, 10);
    if (!cid || items.length === 0) {
      setError("Select a customer and add at least one item.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newOrder = await createOrder({
        customer: cid,
        items: items.filter((i) => i.product > 0 && i.quantity > 0),
      });
      const fullOrder = await getOrder(newOrder.id);
      setOrders((prev) => [fullOrder, ...prev]);
      setCustomerId("");
      setItems([]);
    } catch (err) {
      setError("Failed to create order.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (order: Order) => {
    setEditingId(order.id);
    setEditCustomerId(String(order.customer));
    setEditItems(
      (order.items || []).map((i) => ({ product: i.product, quantity: i.quantity }))
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCustomerId("");
    setEditItems([]);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId == null) return;
    const cid = parseInt(editCustomerId, 10);
    if (!cid || editItems.length === 0) {
      setError("Select a customer and add at least one item.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateOrder(editingId, {
        customer: cid,
        items: editItems.filter((i) => i.product > 0 && i.quantity > 0),
      });
      const fullOrder = await getOrder(editingId);
      setOrders((prev) =>
        prev.map((o) => (o.id === editingId ? fullOrder : o))
      );
      cancelEdit();
    } catch (err) {
      setError("Failed to update order.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this order?")) return;
    setError(null);
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError("Failed to delete order.");
      console.error(err);
    }
  };

  const formatDate = (s: string) => {
    try {
      return new Date(s).toLocaleString();
    } catch {
      return s;
    }
  };

  const formatMoney = (value: string | number | undefined): string => {
    const n = Number(value);
    return (Number.isNaN(n) ? 0 : n).toFixed(2);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Orders</h2>

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
          Create order
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Customer
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          >
            <option value="">Select customer</option>
            {(customers || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.email}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-600">Items</label>
            <button
              type="button"
              onClick={addItemRow}
              disabled={products.length === 0}
              className="text-sm px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add item
            </button>
          </div>
          {items.length === 0 ? (
            <p className="text-slate-500 text-sm">Add at least one product.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex flex-wrap items-center gap-2"
                >
                  <select
                    value={item.product}
                    onChange={(e) =>
                      updateItem(idx, "product", parseInt(e.target.value, 10))
                    }
                    className="flex-1 min-w-[140px] px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    {(products || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ${Number(p.price).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(idx, "quantity", parseInt(e.target.value, 10) || 1)
                    }
                    className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 font-medium"
        >
          {loading ? "Saving..." : "Create order"}
        </button>
      </form>

      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            {editingId === order.id ? (
              <form onSubmit={handleUpdate} className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Customer
                  </label>
                  <select
                    value={editCustomerId}
                    onChange={(e) => setEditCustomerId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {(customers || []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600">
                      Items
                    </span>
                    <button
                      type="button"
                      onClick={addEditItemRow}
                      className="text-sm px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      + Add
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {editItems.map((item, idx) => (
                      <li key={idx} className="flex flex-wrap items-center gap-2">
                        <select
                          value={item.product}
                          onChange={(e) =>
                            updateEditItem(
                              idx,
                              "product",
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="flex-1 min-w-[140px] px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                          {(products || []).map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateEditItem(
                              idx,
                              "quantity",
                              parseInt(e.target.value, 10) || 1
                            )
                          }
                          className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeEditItem(idx)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
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
                <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800">
                      Order #{order.id}
                    </span>
                    <span className="text-slate-500 ml-2">
                      {order.customer_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">
                      {formatDate(order.order_date)}
                    </span>
                    <button
                      onClick={() => startEdit(order)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="px-4 py-3 bg-slate-50">
                  <ul className="text-sm text-slate-600 space-y-1">
                    {(order.items || []).map((item) => (
                      <li key={item.id}>
                        {item.product_name} × {item.quantity} — $
                        {formatMoney(
                          Number(item.product_price) * item.quantity
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 font-semibold text-slate-800">
                    Total: ${formatMoney(order.total)}
                  </p>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {orders.length === 0 && !error && (
        <p className="text-slate-500 text-center py-8">No orders yet.</p>
      )}
    </div>
  );
};

export default OrderList;
