import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch { setError('Error al registrarse'); }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
      <div className="w-full">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Crear cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Crear cuenta</Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">¿Ya tienes cuenta? <Link to="/login" className="text-primary-600 hover:text-primary-700">Iniciar sesión</Link></p>
      </div>
    </div>
  );
}
