// src/context/AuthProvider.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser as loginService, registerUser as registerService, logoutUser as logoutService, getCurrentUser } from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);


    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        setLoadingInitial(false);
    }, []);


    const login = async (credentials) => {
        try {
            const user = await loginService(credentials);
            setCurrentUser(user);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const user = await registerService(userData);
            setCurrentUser(user);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        logoutService();
        setCurrentUser(null);
    };

    const isAuthenticated = () => {
        return !!currentUser;
    };

    const isAdmin = () => {
        return currentUser?.role === 'admin';
    };


    const value = {
        currentUser,
        loadingInitial,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loadingInitial && children}
            {loadingInitial && <LoadingSpinner message="Ініціалізація автентифікації..." />}
        </AuthContext.Provider>
    );
};