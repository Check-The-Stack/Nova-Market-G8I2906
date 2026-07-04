import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Bienvenido a NovaMarket</h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-500">Tu tienda de productos tecnológicos. Accesorios, periféricos y gadgets para tu día a día.</p>
        <div className="mt-8 flex gap-4">
          <Link to="/catalog"><Button size="lg">Ver catálogo</Button></Link>
          <Link to="/register"><Button variant="secondary" size="lg">Crear cuenta</Button></Link>
        </div>
      </div>
    </div>
  );
}
