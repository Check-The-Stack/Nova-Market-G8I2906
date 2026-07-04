import type { CartItem as CartItemType } from '../../../types';
import { useCart } from '../../../context/CartContext';

interface Props { item: CartItemType; }

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <img src={item.product.imageUrl} alt={item.product.name} className="h-20 w-20 rounded object-cover" />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
        <p className="text-sm text-gray-500">${item.product.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded border px-2 py-1 text-sm" onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}>-</button>
        <span className="w-8 text-center text-sm">{item.quantity}</span>
        <button className="rounded border px-2 py-1 text-sm" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
      </div>
      <p className="w-20 text-right font-medium">${(item.product.price * item.quantity).toLocaleString()}</p>
      <button className="text-sm text-red-600 hover:text-red-700" onClick={() => removeItem(item.product.id)}>Eliminar</button>
    </div>
  );
}
