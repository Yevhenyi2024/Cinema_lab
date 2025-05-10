import { useState } from 'react';
import { registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h1 className="text-2xl font-bold mb-4">Реєстрація</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" type="text" placeholder="Ім'я користувача" onChange={handleChange} className="input w-full" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input w-full" required />
        <input name="password" type="password" placeholder="Пароль" onChange={handleChange} className="input w-full" required />
        <button type="submit" className="btn btn-primary w-full">Зареєструватися</button>
      </form>
    </div>
  );
}

export default RegisterPage;
