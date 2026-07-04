import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary-600">NovaMarket</Link>
          <div className="flex items-center gap-4">
            <Link to="/catalog" className="text-sm text-gray-600 hover:text-gray-900">Catálogo</Link>
            <Link to="/cart" className="relative text-sm text-gray-600 hover:text-gray-900">
              Carrito
              {totalItems > 0 && (
                <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">{totalItems}</span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{user?.name}</span>
                {isAdmin && <Link to="/admin" className="text-sm text-primary-600 hover:text-primary-700">Admin</Link>}
                <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">Cerrar sesión</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Iniciar sesión</Link>
                <Link to="/register" className="rounded bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
