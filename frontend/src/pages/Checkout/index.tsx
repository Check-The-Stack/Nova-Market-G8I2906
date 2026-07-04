import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await orderService.create({
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: { street, city, state, zipCode, country: 'Argentina' },
      });
      clear();
      navigate('/');
    } catch { alert('Error al procesar el pedido'); }
    finally { setSubmitting(false); }
  };

  if (!items.length) { navigate('/cart'); return null; }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Dirección de envío</h2>
          <div className="space-y-4">
            <Input label="Calle" value={street} onChange={e => setStreet(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Ciudad" value={city} onChange={e => setCity(e.target.value)} required />
              <Input label="Provincia" value={state} onChange={e => setState(e.target.value)} required />
            </div>
            <Input label="Código postal" value={zipCode} onChange={e => setZipCode(e.target.value)} required />
          </div>
        </div>
        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-900">Resumen</h3>
          <p className="mt-2 text-sm text-gray-600">Productos: {items.length}</p>
          <p className="text-lg font-bold text-primary-600">Total: ${total.toLocaleString()}</p>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Procesando...' : 'Confirmar pedido'}</Button>
      </form>
    </div>
  );
}
