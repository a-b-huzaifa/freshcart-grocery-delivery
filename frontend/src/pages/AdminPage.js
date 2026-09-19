import { useState, useEffect } from 'react';
import * as catalogApi from '../api/catalogApi';
import * as ordersApi from '../api/ordersApi';

function getErrorMessage(err) {
  return err.response?.data?.error || err.message || 'Something went wrong';
}

function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [error, setError] = useState(null);

  const [categoryForm, setCategoryForm] = useState({ name: '', image: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'each',
    stock: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    refreshAll();
  }, []);

  function refreshAll() {
    catalogApi.getCategories().then(setCategories).catch((err) => setError(getErrorMessage(err)));
    catalogApi.getProducts().then(setProducts).catch((err) => setError(getErrorMessage(err)));
    ordersApi.getAllOrders().then(setAllOrders).catch((err) => setError(getErrorMessage(err)));
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    setError(null);
    try {
      await catalogApi.createCategory(categoryForm);
      setCategoryForm({ name: '', image: '' });
      refreshAll();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteCategory(id) {
    setError(null);
    try {
      await catalogApi.deleteCategory(id);
      refreshAll();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setError(null);
    try {
      await catalogApi.createProduct({
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      });
      setProductForm({
        name: '',
        description: '',
        price: '',
        unit: 'each',
        stock: '',
        category: '',
        image: '',
      });
      refreshAll();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteProduct(id) {
    setError(null);
    try {
      await catalogApi.deleteProduct(id);
      refreshAll();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleStatusChange(id, status) {
    setError(null);
    try {
      const updated = await ordersApi.updateOrderStatus(id, status);
      setAllOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="page">
      <h1>Admin</h1>
      {error && <div className="error-banner">{error}</div>}

      <section className="admin-section">
        <h2>Categories</h2>
        <form className="inline-form" onSubmit={handleAddCategory}>
          <input
            placeholder="Category name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            placeholder="Image URL (optional)"
            value={categoryForm.image}
            onChange={(e) => setCategoryForm((f) => ({ ...f, image: e.target.value }))}
          />
          <button type="submit">Add category</button>
        </form>
        <ul className="admin-list">
          {categories.map((c) => (
            <li key={c._id}>
              {c.name}
              <button className="delete-btn" onClick={() => handleDeleteCategory(c._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-section">
        <h2>Products</h2>
        <form className="inline-form product-form" onSubmit={handleAddProduct}>
          <input
            placeholder="Name"
            value={productForm.name}
            onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            placeholder="Price"
            type="number"
            step="0.01"
            value={productForm.price}
            onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
          <input
            placeholder="Unit (kg, pack, each...)"
            value={productForm.unit}
            onChange={(e) => setProductForm((f) => ({ ...f, unit: e.target.value }))}
          />
          <input
            placeholder="Stock"
            type="number"
            value={productForm.stock}
            onChange={(e) => setProductForm((f) => ({ ...f, stock: e.target.value }))}
            required
          />
          <select
            value={productForm.category}
            onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Image URL (optional)"
            value={productForm.image}
            onChange={(e) => setProductForm((f) => ({ ...f, image: e.target.value }))}
          />
          <button type="submit">Add product</button>
        </form>
        <ul className="admin-list">
          {products.map((p) => (
            <li key={p._id}>
              {p.name} — ${p.price} / {p.unit} ({p.stock} in stock)
              <button className="delete-btn" onClick={() => handleDeleteProduct(p._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-section">
        <h2>All Orders</h2>
        <ul className="admin-list">
          {allOrders.map((o) => (
            <li key={o._id} className="admin-order-row">
              <span>
                #{o._id.slice(-6)} — ${o.totalAmount.toFixed(2)}
              </span>
              <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="out_for_delivery">out_for_delivery</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminPage;
