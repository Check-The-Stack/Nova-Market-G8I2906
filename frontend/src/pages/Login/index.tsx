import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch { setError('Credenciales inválidas'); }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
      <div className="w-full">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Iniciar sesión</Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">¿No tienes cuenta? <Link to="/register" className="text-primary-600 hover:text-primary-700">Registrarse</Link></p>
      </div>
    </div>
  );
}
