import { useState } from 'react';
import { registerUser } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';


function RegisterPage() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = e => {
        setError(null);
        if (registrationSuccess) {
            setRegistrationSuccess(false);
        }
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async e => {
        e.preventDefault();

        setError(null);
        setSubmitting(true);
        setRegistrationSuccess(false);

        try {
            if (!form.username.trim()) {
                setError(new Error("Будь ласка, введіть ім'я користувача."));
                return;
            }

            await registerUser(form);

            setRegistrationSuccess(true);
            setForm({ username: '', email: '', password: '' });

        } catch (err) {
            setError(err);
            console.error("Помилка реєстрації:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto mt-10 p-6 border rounded-md shadow bg-white">
            <h1 className="text-2xl font-bold mb-4 text-center">Реєстрація</h1>

            {registrationSuccess ? (
                <div className="text-center">
                    <p className="text-green-600 text-lg mb-4">Користувач успішно зареєструвався!</p>
                    <Link to="/login" className="text-blue-600 hover:underline">
                          Увійти до акаунту
                    </Link>
                </div>
            ) : (
                <>
                    {error && <ErrorMessage message={error.message} className="mb-4" />}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="username"
                            type="text"
                            placeholder="Ім'я користувача"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            disabled={submitting}
                        />
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
                                  'Зареєструватися'
                              )}
                        </button>
                    </form>
                      <p className="text-center mt-4 text-gray-600">
                          Вже маєте акаунт? <Link to="/login" className="text-blue-600 hover:underline">Увійти</Link>
                      </p>
                </>
            )}
        </div>
    );
}

export default RegisterPage;