import axios from 'axios';
import { getConfigWithUserId, getCurrentUser } from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

export const getMovies = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies`);
        return response.data;
    } catch (error) {
        console.error('Помилка отримання фільмів:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Помилка отримання фільмів');
    }
};

export const getMovieById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Помилка отримання фільму з ID ${id}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || `Фільм з ID ${id} не знайдено`);
    }
};

export const searchMovies = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/search`, { params: query });
        return response.data;
    } catch (error) {
        console.error('Помилка під час пошуку фільмів:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Помилка під час пошуку фільмів');
    }
};

export const getGenresList = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/genres`);
        return response.data;
    } catch (error) {
        console.error('Помилка отримання списку жанрів:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Помилка отримання списку жанрів');
    }
};

export const getReleaseYearsList = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/years`);
        return response.data;
    } catch (error) {
        console.error('Помилка отримання списку років випуску:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Помилка отримання списку років випуску');
    }
};

export const getMovieCast = async (movieId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/actors/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error(`Помилка отримання акторського складу для фільму з ID ${movieId}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || `Не вдалося отримати акторський склад для фільму з ID ${movieId}`);
    }
};

export const getShowtimes = async (filters = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/showtimes`, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Помилка отримання сеансів:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Помилка отримання сеансів');
    }
};

export const getShowtimeById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/showtimes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Помилка отримання сеансу з ID ${id}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || `Сеанс з ID ${id} не знайдено`);
    }
};


export const createMovie = async (movieData) => {
    const config = getConfigWithUserId();
    if (!config) throw new Error("Користувач не автентифікований");

    try {
        const response = await axios.post(`${API_BASE_URL}/movies`, movieData, config);
        return response.data;
    } catch (error) {
        console.error('Помилка створення фільму:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Помилка створення фільму');
    }
};

export const updateMovie = async (id, movieData) => {
    const config = getConfigWithUserId();
    if (!config) throw new Error("Користувач не автентифікований");

    try {
        const response = await axios.put(`${API_BASE_URL}/movies/${id}`, movieData, config);
        return response.data;
    } catch (error) {
        console.error(`Помилка оновлення фільму з ID ${id}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || `Помилка оновлення фільму з ID ${id}`);
    }
};

export const deleteMovie = async (id) => {
    const config = getConfigWithUserId();
    if (!config) throw new Error("Користувач не автентифікований");

    try {
        const response = await axios.delete(`${API_BASE_URL}/movies/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(`Помилка видалення фільму з ID ${id}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || `Помилка видалення фільму з ID ${id}`);
    }
};

export const createShowtime = async (showtimeData) => {
    const config = getConfigWithUserId();
    if (!config) throw new Error("Користувач не автентифікований");

    try {
        const response = await axios.post(`${API_BASE_URL}/showtimes`, showtimeData, config);
        return response.data;
    } catch (error) {
        console.error('Помилка створення сеансу:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Помилка створення сеансу');
    }
};

export const updateShowtime = async (id, showtimeData) => {
    const config = getConfigWithUserId();
    if (!config) throw new Error("Користувач не автентифікований");

    try {
        const response = await axios.put(`${API_BASE_URL}/showtimes/${id}`, showtimeData, config);
        return response.data;
    } catch (error) {
        console.error(`Помилка оновлення сеансу з ID ${id}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || `Помилка оновлення сеансу з ID ${id}`);
    }
};

export const deleteShowtime = async (id) => {
    const config = getConfigWithUserId();
    if (!config) throw new Error("Користувач не автентифікований");

    try {
        const response = await axios.delete(`${API_BASE_URL}/showtimes/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(`Помилка видалення сеансу з ID ${id}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || `Помилка видалення сеансу з ID ${id}`);
    }
};
