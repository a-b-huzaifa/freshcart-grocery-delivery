import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as catalogApi from '../api/catalogApi';
import * as ordersApi from '../api/ordersApi';

function getErrorMessage(err) {
  return err.response?.data?.error || err.message || 'Something went wrong';
}

function ShopPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch((err) => setError(getErrorMessage(err)));
  }, []);

  const loadProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (search) params.search = search;
    catalogApi
      .getProducts(params)
      .then(setProducts)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [selectedCategory, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleAddToCart(productId) {
    setError(null);
    setMessage('');
    try {
      await ordersApi.addToCart(productId, 1);
      setMessage('Added to cart');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="page">
      <h1>Shop</h1>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="status">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="status">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              {product.image && <img src={product.image} alt={product.name} />}
              <div className="product-card-body">
                <h3>{product.name}</h3>
                <p className="category-tag">{product.category?.name}</p>
                <p className="price">
                  ${product.price.toFixed(2)} / {product.unit}
                </p>
                <p className="stock">{product.stock} in stock</p>
                {user ? (
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                  </button>
                ) : (
                  <p className="login-hint">Log in to order</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShopPage;
