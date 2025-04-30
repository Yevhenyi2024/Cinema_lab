import { useState } from 'react';
import { loginUser, registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginUser({ email: form.email, password: form.password });
      } else {
        await registerUser(form);
      }
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 border rounded-md shadow bg-white">
      <div className="flex justify-around mb-6">
        <button
        onClick={() => setIsLogin(true)}
        className={`px-4 py-2 font-semibold transition ${
            isLogin
        ? 'border-b-2 border-yellow-400 text-yellow-400'
        : 'text-gray-500 hover:text-yellow-400'
        }`}
    >
        Вхід
     </button>
    <button
        onClick={() => setIsLogin(false)}
        className={`px-4 py-2 font-semibold transition ${
        !isLogin
        ? 'border-b-2 border-yellow-400 text-yellow-400'
        : 'text-gray-500 hover:text-yellow-400'
      }`}
      >
        Реєстрація
      </button>
    </div>

      <h1 className="text-xl font-bold mb-4 text-center">{isLogin ? 'Увійти до акаунту' : 'Створити акаунт'}</h1>
      {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            name="username"
            type="text"
            placeholder="Ім'я користувача"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md transition"
        >
        {isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;