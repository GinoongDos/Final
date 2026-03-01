import React, { useState } from "react";
import "./App.css";
import CustomerList from "./component/CustomerList";
import ProductList from "./component/ProductList";
import OrderList from "./component/OrderList";

type Tab = "customers" | "products" | "orders";

function App() {
  const [tab, setTab] = useState<Tab>("customers");

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2">
          <button
            onClick={() => setTab("customers")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab === "customers"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab === "products"
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab === "orders"
                ? "bg-sky-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Orders
          </button>
        </div>
      </nav>
      <main className="py-6">
        {tab === "customers" && <CustomerList />}
        {tab === "products" && <ProductList />}
        {tab === "orders" && <OrderList />}
      </main>
    </div>
  );
}

export default App;
