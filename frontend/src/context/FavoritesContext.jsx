import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser, getConfigWithUserId } from '../services/authService';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

const API_BASE_URL = 'http://localhost:5000/api';

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = getCurrentUser();

    useEffect(() => {
        const fetchFavorites = async () => {
            const config = getConfigWithUserId();
            if (!config) {
                setFavorites([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/favorites`, config);
                setFavorites(response.data);
            } catch (error) {
                console.error('Помилка завантаження обраних фільмів:', error.response?.data?.message || error.message);
                setFavorites([]);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchFavorites();
        } else {
            setFavorites([]);
            setLoading(false);
        }

    }, [currentUser?.id]);


    const addToFavorites = async (movie) => {
        const config = getConfigWithUserId();
        if (!config) {
            console.warn("Не автентифікований користувач не може додати до обраного.");
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/favorites`, { movieId: movie.id }, config);
            const addedMovie = response.data;
            setFavorites(prevFavorites => {
                if (!prevFavorites.some(fav => fav.id === addedMovie.id)) {
                    return [...prevFavorites, addedMovie];
                }
                return prevFavorites;
            });
            console.log('Фільм додано до обраного');
        } catch (error) {
            console.error('Помилка додавання до обраного:', error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Помилка додавання до обраного');
        }
    };

    const removeFromFavorites = async (movieId) => {
        const config = getConfigWithUserId();
         if (!config) {
              console.warn("Не автентифікований користувач не може видалити з обраного.");
              return;
         }
        try {
            await axios.delete(`${API_BASE_URL}/favorites/${movieId}`, config);
            setFavorites(prevFavorites =>
                prevFavorites.filter(movie => movie.id !== movieId)
            );
            console.log('Фільм видалено з обраного');
        } catch (error) {
            console.error('Помилка видалення з обраного:', error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Помилка видалення з обраного');
        }
    };

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId);
    };

    const isAuthenticated = () => {
         return !!currentUser;
    };


    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        loading,
        isAuthenticated,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};
