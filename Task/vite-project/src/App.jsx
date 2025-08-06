import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

import axios from "axios";

// Axios config
// axios.defaults.baseURL = "http://localhost:8000";
baseURL: import.meta.env.MODE === "development" ? "http://localhost:8000/api" : "/api",
axios.defaults.withCredentials = true;

// ----- Product CRUD Component -----
const WebPage = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [isShipped, setIsShipped] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ["Electronics", "Books", "Clothing"];
  const itemsPerPage = 10;

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      console.log(res.data);
      setProducts(res.data.products); // ✅ Extract array
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!productName.trim()) return;

    const payload = { name: productName, category, shipped: isShipped };
    console.log("Sending product payload:", payload); // 👈 Log here

    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, payload);
      } else {
        await axios.post("/api/products", payload);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
      console.error("Backend error response:", err.response?.data);
    }
  };

  const handleEdit = (prod) => {
    setProductName(prod.name);
    setCategory(prod.category);
    setIsShipped(prod.shipped);
    setEditingId(prod._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const resetForm = () => {
    setProductName("");
    setCategory("Electronics");
    setIsShipped(false);
    setEditingId(null);
  };

   
  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.category === filter);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginated = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

   
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📦 Product Manager</h2>
        {/* <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button> */}
        <button
          onClick={async () => {
            try {
              // 1. Call backend to clear cookie
              await axios.post(
                "/api/auth/logout",
                {},
                { withCredentials: true }
              );

              // 2. Remove token manually (optional, if you stored it in JS-accessible Cookies or localStorage)
              Cookies.remove("token");

              // 3. Run logout logic (e.g., redirect, clear context)
              onLogout();
            } catch (err) {
              console.error("Logout failed", err);
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          className="border px-2 py-1 mr-2"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <select
          className="border px-2 py-1 mr-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <label className="mr-2">
          <input
            type="checkbox"
            checked={isShipped}
            onChange={(e) => setIsShipped(e.target.checked)}
          />{" "}
          Shipped
        </label>
        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Filter */}
      <div className="mb-2">
        <label className="mr-2 font-semibold">Filter:</label>
        <select
          className="border px-2 py-1"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option>All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="w-full bg-white shadow rounded mb-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Shipped</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((prod) => (
            <tr key={prod._id}>
              <td className="p-2">{prod.name}</td>
              <td className="p-2">{prod.category}</td>
              <td className="p-2">{prod.shipped ? "✅" : "❌"}</td>
              <td className="p-2 space-x-2">
                <button
                  className="text-blue-600"
                  onClick={() => handleEdit(prod)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(prod._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setCurrentPage(pg)}
            className={`px-3 py-1 rounded ${
              currentPage === pg
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {pg}
          </button>
        ))}
      </div> */}
      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setCurrentPage(pg)}
            className={`px-3 py-1 rounded ${
              currentPage === pg
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {pg}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
// ✅ Import js-cookie

const Login = ({ onSwitch, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true } // ✅ Important to receive cookies from server
      );

      onLogin();
    } catch (err) {
      console.error("Login failed", err);
      setMsg("❌ Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border w-full px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full px-3 py-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
        {msg && <p className="text-red-500 mt-2">{msg}</p>}
        <p className="mt-4 text-center">
          No account?{" "}
          <button className="text-blue-500" onClick={onSwitch}>
            Signup
          </button>
        </p>
      </form>
    </div>
  );
};

const Signup = ({ onSwitch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", { userName: name, email, password });
      setMsg("✅ Signup successful");
      setTimeout(onSwitch, 1000);
    } catch (err) {
      setMsg("❌ Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        <input
          type="text"
          placeholder="Name"
          className="border w-full px-3 py-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border w-full px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full px-3 py-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white w-full py-2 rounded"
        >
          Signup
        </button>
        {msg && <p className="text-green-600 mt-2">{msg}</p>}
        <p className="mt-4 text-center">
          Have an account?{" "}
          <button className="text-purple-500" onClick={onSwitch}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

// ----- App Root -----
const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (isAuthenticated) {
    return <WebPage onLogout={() => setIsAuthenticated(false)} />;
  }

  return isLogin ? (
    <Login
      onSwitch={() => setIsLogin(false)}
      onLogin={() => setIsAuthenticated(true)}
    />
  ) : (
    <Signup onSwitch={() => setIsLogin(true)} />
  );
};

export default App;
