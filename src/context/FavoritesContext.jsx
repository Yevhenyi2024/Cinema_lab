import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });


  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(fav => fav.id === movie.id)) {
        return [...prevFavorites, movie];
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (movieId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(movie => movie.id !== movieId)
    );
  };

  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};