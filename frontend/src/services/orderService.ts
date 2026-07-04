import api from './api';

export const orderService = {
  create(payload: Record<string, unknown>) { return api.post('/orders', payload); },
  getMyOrders() { return api.get('/orders'); },
  getAll() { return api.get('/admin/orders'); },
  updateStatus(id: string, status: string) { return api.put(`/admin/orders/${id}/status`, { status }); },
};
