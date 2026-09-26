import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import * as catalogApi from '../api/catalogApi';

function getErrorMessage(err) {
  return err.response?.data?.error || err.message || 'Something went wrong';
}

function ShopPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'price-asc', 'price-desc'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const fallbackImg = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80";

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch((err) => addToast(getErrorMessage(err), 'error'));
  }, [addToast]);

  const loadProducts = useCallback(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (debouncedSearch) params.search = debouncedSearch;
    catalogApi
      .getProducts(params)
      .then(setProducts)
      .catch((err) => addToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  }, [selectedCategory, debouncedSearch, addToast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleAddToCart(productId) {
    try {
      const qty = quantities[productId] || 1;
      await addToCart(productId, qty);
      addToast('Added to cart', 'success');
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    }
  }

  const handleQuantity = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const displayedProducts = products
    .filter(p => !inStockOnly || p.stock > 0)
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0; // 'newest' is already sorted by backend
    });

  return (
    <>
      <section className="hero">
        <h1>Fresh Groceries.<br/>No Waiting.</h1>
        <p>Your favorite local brands and fresh produce, delivered to your door in minutes.</p>
        <button onClick={() => window.scrollTo({ top: document.querySelector('.page').offsetTop - 80, behavior: 'smooth' })}>
          Shop Now ↓
        </button>
      </section>

      <div className="page" style={{ paddingTop: '20px' }}>

      <div className="filters" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 200px' }}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ flex: '0 1 auto' }}>
          <option value="newest">Sort by: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontFamily: 'var(--sans)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <input 
            type="checkbox" 
            checked={inStockOnly} 
            onChange={(e) => setInStockOnly(e.target.checked)} 
            style={{ minWidth: 'auto', width: 'auto' }}
          />
          In Stock Only
        </label>
      </div>

      <div className="category-chips">
        <div 
          className={`category-chip ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('')}
        >
          All Categories
        </div>
        {categories.map((c) => (
          <div 
            key={c._id} 
            className={`category-chip ${selectedCategory === c._id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(c._id)}
          >
            {c.name}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="product-card skeleton" style={{ padding: 0 }}>
              <div className="skeleton-img"></div>
              <div className="product-card-body">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <p className="status">No products found matching your filters.</p>
      ) : (
        <div className="product-grid">
          {displayedProducts.map((product) => (
            <div className="product-card" key={product._id} onClick={() => setQuickViewProduct(product)}>
              <img src={product.image || fallbackImg} alt={product.name} />
              <div className="product-card-body">
                <h3>{product.name}</h3>
                <p className="category-tag">{product.category?.name}</p>
                <p className="price">
                  ${product.price.toFixed(2)} / {product.unit}
                </p>
                <p className="stock">{product.stock} in stock</p>
                {user ? (
                  <div style={{ display: 'flex', gap: '4px', flexDirection: 'column', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                      <button style={{ flex: 1 }} onClick={() => handleQuantity(product._id, -1)} disabled={product.stock === 0 || (quantities[product._id] || 1) <= 1}>-</button>
                      <input style={{ flex: 2, textAlign: 'center', padding: '9px 4px' }} readOnly value={quantities[product._id] || 1} />
                      <button style={{ flex: 1 }} onClick={() => handleQuantity(product._id, 1)} disabled={product.stock === 0 || (quantities[product._id] || 1) >= product.stock}>+</button>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                    </button>
                  </div>
                ) : (
                  <p className="login-hint" style={{ marginTop: 'auto' }}>Log in to order</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setQuickViewProduct(null)}>×</button>
            <div className="modal-image">
              <img src={quickViewProduct.image || fallbackImg} alt={quickViewProduct.name} />
            </div>
            <div className="modal-info">
              <h2>{quickViewProduct.name}</h2>
              <p className="category-tag">{quickViewProduct.category?.name}</p>
              <div className="price">${quickViewProduct.price.toFixed(2)} / {quickViewProduct.unit}</div>
              <p>{quickViewProduct.description || "Fresh and high-quality local produce, sourced directly to ensure maximum flavor and nutrition."}</p>
              <div style={{ marginTop: 'auto' }}>
                <p className="stock" style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>{quickViewProduct.stock} in stock</p>
                {user ? (
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button style={{ flex: 1 }} onClick={() => handleQuantity(quickViewProduct._id, -1)} disabled={quickViewProduct.stock === 0 || (quantities[quickViewProduct._id] || 1) <= 1}>-</button>
                      <input style={{ flex: 2, textAlign: 'center' }} readOnly value={quantities[quickViewProduct._id] || 1} />
                      <button style={{ flex: 1 }} onClick={() => handleQuantity(quickViewProduct._id, 1)} disabled={quickViewProduct.stock === 0 || (quantities[quickViewProduct._id] || 1) >= quickViewProduct.stock}>+</button>
                    </div>
                    <button onClick={() => { handleAddToCart(quickViewProduct._id); setQuickViewProduct(null); }} disabled={quickViewProduct.stock === 0}>
                      {quickViewProduct.stock === 0 ? 'Out of stock' : 'Add to cart'}
                    </button>
                  </div>
                ) : (
                  <p className="login-hint">Log in to order</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default ShopPage;
