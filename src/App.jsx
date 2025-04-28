import { Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { FavoritesProvider } from './context/FavoritesContext';
import './styles/index.css';

function App() {
  return (
    <FavoritesProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </FavoritesProvider>
  );
}

export default App;