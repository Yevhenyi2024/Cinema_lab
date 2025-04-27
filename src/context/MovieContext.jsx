import React, { createContext, useContext, useState } from 'react';

// Контекст
const MovieContext = createContext();

// Хук для споживання
export function useMovies() {
  return useContext(MovieContext);
}

// Провайдер
export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const value = {
    movies,
    showtimes,
    favorites
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}