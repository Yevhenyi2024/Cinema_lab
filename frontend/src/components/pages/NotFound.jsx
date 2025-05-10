import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-secondary mb-4">404</h1>
      <p className="text-2xl font-semibold mb-6">Сторінку не знайдено</p>
      <p className="text-gray-600 mb-8 text-center">
        Вибачте, сторінка, яку ви шукаєте, не існує або була переміщена.
      </p>
      <Link to="/" className="btn btn-primary">
        Повернутися на головну
      </Link>
    </div>
  );
}

export default NotFound;