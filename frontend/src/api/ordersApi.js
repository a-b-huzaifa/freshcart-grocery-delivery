import client from './client';

export const getCart = () => client.get('/cart').then((r) => r.data);
export const addToCart = (productId, quantity = 1) =>
  client.post('/cart', { productId, quantity }).then((r) => r.data);
export const updateCartItem = (productId, quantity) =>
  client.patch(`/cart/${productId}`, { quantity }).then((r) => r.data);
export const removeFromCart = (productId) =>
  client.delete(`/cart/${productId}`).then((r) => r.data);

export const createOrder = (deliveryAddress) =>
  client.post('/orders', { deliveryAddress }).then((r) => r.data);
export const getMyOrders = () => client.get('/orders').then((r) => r.data);
export const getAllOrders = () => client.get('/orders/all').then((r) => r.data);
export const updateOrderStatus = (id, status) =>
  client.patch(`/orders/${id}/status`, { status }).then((r) => r.data);
export const cancelOrder = (id) => client.delete(`/orders/${id}`).then((r) => r.data);
