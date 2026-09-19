import client from './client';

export const getCategories = () => client.get('/categories').then((r) => r.data);
export const createCategory = (data) => client.post('/categories', data).then((r) => r.data);
export const updateCategory = (id, data) =>
  client.patch(`/categories/${id}`, data).then((r) => r.data);
export const deleteCategory = (id) => client.delete(`/categories/${id}`).then((r) => r.data);

export const getProducts = (params) =>
  client.get('/products', { params }).then((r) => r.data);
export const getProduct = (id) => client.get(`/products/${id}`).then((r) => r.data);
export const createProduct = (data) => client.post('/products', data).then((r) => r.data);
export const updateProduct = (id, data) =>
  client.patch(`/products/${id}`, data).then((r) => r.data);
export const deleteProduct = (id) => client.delete(`/products/${id}`).then((r) => r.data);
