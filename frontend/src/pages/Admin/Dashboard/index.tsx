import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Panel de Administración</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/admin/products">
          <Card className="p-6 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
            <p className="mt-1 text-sm text-gray-500">Gestionar catálogo de productos</p>
          </Card>
        </Link>
        <Link to="/admin/orders">
          <Card className="p-6 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos</h2>
            <p className="mt-1 text-sm text-gray-500">Ver y gestionar pedidos</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
