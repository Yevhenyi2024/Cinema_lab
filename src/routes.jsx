import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './components/pages/HomePage';
import MovieDetails from './components/pages/MovieDetails';
import FavoritesPage from './components/pages/FavoritesPage';
import NotFound from './components/pages/NotFound';
import SearchPage from './components/pages/SearchPage';
import SessionsPage from './components/pages/SessionsPage';
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';
import AdminPage from './components/pages/admin/AdminPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'movie/:id',
        element: <MovieDetails />
      },
      {
        path: 'favorites',
        element: <FavoritesPage />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'sessions',
        element: <SessionsPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/admin',
        element: <AdminPage />
      }      
    ]
  }
]);

export default router;