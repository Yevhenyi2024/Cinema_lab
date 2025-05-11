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
import ProtectedRoute from './components/common/ProtectedRoute';

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
        element: <ProtectedRoute><FavoritesPage /></ProtectedRoute>
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
        element: <ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>
      },      
    ]
  }
]);

export default router;