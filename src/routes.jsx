import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './components/pages/HomePage';
import MovieDetails from './components/pages/MovieDetails';
import NotFound from './components/pages/NotFound';

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
      }
    ]
  }
]);

export default router;