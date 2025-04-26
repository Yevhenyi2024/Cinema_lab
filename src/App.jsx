import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Заглушки для сторінок, додамо пізніше
function Placeholder({ title }) {
  return <div className="pt-24 text-center text-3xl">{title}</div>;
}

function App() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <Routes>
          <Route path="/" element={<Placeholder title="Головна" />} />
          <Route path="/showtimes" element={<Placeholder title="Сеанси" />} />
          <Route path="/favorites" element={<Placeholder title="Улюблені" />} />
          <Route path="/search" element={<Placeholder title="Пошук" />} />
          <Route path="*" element={<Placeholder title="Сторінку не знайдено" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
