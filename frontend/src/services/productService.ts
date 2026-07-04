import api from './api';

export const productService = {
  getAll(params?: Record<string, unknown>) { return api.get('/products', { params }); },
  getBySlug(slug: string) { return api.get(`/products/${slug}`); },
  create(payload: Record<string, unknown>) { return api.post('/admin/products', payload); },
  update(id: string, payload: Record<string, unknown>) { return api.put(`/admin/products/${id}`, payload); },
  remove(id: string) { return api.delete(`/admin/products/${id}`); },
};
