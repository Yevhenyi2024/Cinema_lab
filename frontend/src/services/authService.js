import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const CURRENT_USER_STORAGE_KEY = 'currentUser';

export const getCurrentUser = () => {
    const user = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
};

const getConfigWithUserId = () => {
    const user = getCurrentUser();
    if (!user || !user.id) {
        console.error("Користувач не автентифікований. Неможливо виконати захищений запит.");
        return null;
    }
    return {
        headers: {
            'x-user-id': user.id
        }
    };
};
export { getConfigWithUserId };


export const registerUser = async ({ username, email, password }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/register`, { username, email, password });
        const user = response.data;
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Помилка реєстрації:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Помилка реєстрації');
    }
};

export const loginUser = async ({ email, password }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
        const user = response.data;
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Помилка входу:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Невірна пошта або пароль');
    }
};

export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
};

export const fetchCurrentUser = async () => {
    const config = getConfigWithUserId();
    if (!config) return null;

    try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, config);
        const user = response.data;
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Помилка отримання поточного користувача:', error.response?.data?.message || error.message);
        logoutUser();
        throw new Error(error.response?.data?.message || 'Не вдалося отримати дані користувача');
    }
};