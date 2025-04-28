import axios from 'axios';


const API_URL = 'https://api.example.com';


const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Месники: Завершення',
    poster: 'https://upload.wikimedia.org/wikipedia/uk/d/d4/%D0%9C%D0%B5%D1%81%D0%BD%D0%B8%D0%BA%D0%B8_%D0%97%D0%B0%D0%B2%D0%B5%D1%80%D1%88%D0%B5%D0%BD%D0%BD%D1%8F_%D0%94%D1%80%D1%83%D0%B3%D0%B8%D0%B9_%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80.png',
    rating: 8.4,
    overview: 'Після руйнівних подій у "Месниках: Війна нескінченності" всесвіт перебуває в руїнах. За допомогою решти союзників Месники знову збираються разом, щоб скасувати дії Таноса та відновити порядок у всесвіті.'
  },
  {
    id: 2,
    title: 'Джокер',
    poster: 'https://static.hdrezka.ac/i/2021/10/17/vda64b8e56d09uh71k19y.png',
    rating: 8.5,
    overview: 'Історія про те, як невдаха-комік Артур Флек перетворюється на злочинця-психопата Джокера — заклятого ворога Бетмена.'
  },
  {
    id: 3,
    title: 'Паразити',
    poster: 'https://upload.wikimedia.org/wikipedia/uk/8/84/Parasite_2019_poster.jpg',
    rating: 8.6,
    overview: 'Історія про бідну сім\'ю, яка обманом влаштовується на роботу в дім заможної родини, що призводить до неочікуваних наслідків.'
  },
  {
    id: 4,
    title: 'Дюна',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT056oVmYvXg854WQHG1asb8BzpKLnxntt3tA&s',
    rating: 8.0,
    overview: 'Спадкоємець знаменитого дому Атрідів, Пол, вирушає на найнебезпечнішу планету у Всесвіті, щоб забезпечити майбутнє своєї родини та народу.'
  },
  {
    id: 5,
    title: 'Початок',
    poster: 'https://kino-teatr.ua/public/main/films/x2_poster_5bcdd93ed5d38.jpg',
    rating: 8.8,
    overview: 'Злодій, який краде корпоративні секрети через використання технології спільного сну, отримує завдання впровадити ідею у підсвідомість CEO.'
  },
  {
    id: 6,
    title: 'Інтерстеллар',
    poster: 'https://upload.wikimedia.org/wikipedia/uk/2/29/Interstellar_film_poster2.jpg',
    rating: 8.6,
    overview: 'Команда дослідників подорожує через червоточину в космосі в спробі забезпечити виживання людства.'
  },
];

export const getMovies = async () => {
  try {
   
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_MOVIES), 800); 
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const getMovieById = async (id) => {
  try {
   
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const movie = MOCK_MOVIES.find(m => m.id === parseInt(id));
        if (movie) {
          resolve({
            ...movie,
            releaseDate: '2023-05-15',
            director: 'Режисер Фільму',
            genres: ['Бойовик', 'Пригоди', 'Фантастика'],
            duration: '2h 35m',
            trailer: 'https://www.youtube.com'
          });
        } else {
          reject(new Error('Movie not found'));
        }
      }, 800);
    });
  } catch (error) {
    console.error(`Error fetching movie with ID ${id}:`, error);
    throw error;
  }
};