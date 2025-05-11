import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import ErrorMessage from '../common/ErrorMessage';

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login, register } = useAuth();

    const handleChange = e => {
        setError(null);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleToggleForm = (isLoginForm) => {
        setIsLogin(isLoginForm);
        setError(null);
        setForm({ username: '', email: '', password: '' });
        setSubmitting(false);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        setError(null);
        setSubmitting(true);

        try {
            if (isLogin) {
                await login({ email: form.email, password: form.password });
                navigate('/');
                window.location.reload();
            } else {
                if (!form.username.trim()) {
                    setError(new Error("Будь ласка, введіть ім'я користувача."));
                    return;
                }
                await register(form);
            }

        } catch (err) {
            setError(err);
            console.error("Помилка входу/реєстрації:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto mt-10 p-6 border rounded-md shadow bg-white">
            <div className="flex justify-around mb-6">
                <button
                    onClick={() => handleToggleForm(true)}
                    className={`px-4 py-2 font-semibold transition ${
                        isLogin
                            ? 'border-b-2 border-yellow-400 text-yellow-400'
                            : 'text-gray-500 hover:text-yellow-400'
                    }`}
                    disabled={submitting}
                >
                    Вхід
                </button>
                <button
                    onClick={() => handleToggleForm(false)}
                    className={`px-4 py-2 font-semibold transition ${
                        !isLogin
                            ? 'border-b-2 border-yellow-400 text-yellow-400'
                            : 'text-gray-500 hover:text-yellow-400'
                    }`}
                    disabled={submitting}
                >
                    Реєстрація
                </button>
            </div>

            <h1 className="text-xl font-bold mb-4 text-center">{isLogin ? 'Увійти до акаунту' : 'Створити акаунт'}</h1>

            <>
                {error && <ErrorMessage message={error.message} className="mb-4" />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            name="username"
                            type="text"
                            placeholder="Ім'я користувача"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required={!isLogin}
                            disabled={submitting}
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
                        disabled={submitting}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        disabled={submitting}
                    />
                    <button
                        type="submit"
                        className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md transition flex items-center justify-center ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <svg className="animate-spin h-5 w-5 text-black mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            isLogin ? 'Увійти' : 'Зареєструватися'
                        )}
                    </button>
                </form>
                <p className="text-center mt-4 text-gray-600">
                    {isLogin ? (
                        <>Немає акаунту? <Link to="/register" className="text-blue-600 hover:underline">Зареєструватися</Link></>
                    ) : (
                        <>Вже маєте акаунт? <Link to="/login" className="text-blue-600 hover:underline">Увійти</Link></>
                    )}
                </p>
            </>
        </div>
    );
}

export default LoginPage;