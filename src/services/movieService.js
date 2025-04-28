import axios from 'axios';

const API_URL = 'https://api.example.com';

const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Виживші. Вихід в пітьму',
    poster: 'https://kino-teatr.ua/public/main/films/2025-03/poster_67e3a6ad375c4.jpg',
    rating: 7.2,
    overview: 'Головний герой рятує двох хлопчиків після катастрофи, що знищила цивілізацію. Вони ховаються від небезпеки, яка приходить з настанням ночі.',
    releaseDate: '2025-04-03',
    director: 'Бенджамін Брівер',
    genres: ['Жахи', 'Бойовик'],
    duration: '1год 32хв',
    trailer: 'https://www.youtube.com/embed/jqAK1Dm7dV8'
  },
  {
    id: 2,
    title: 'Мишоловка',
    poster: 'https://mostkino.dp.ua/upload/10233/poster/poster-1743521142.jpg',
    rating: 7.8,
    overview: 'Антон опиняється заблокованим у бліндажі після обстрілу. Він бореться за виживання, використовуючи всі доступні засоби.',
    releaseDate: '2025-04-03',
    director: 'Сергій Касторних',
    genres: ['Воєнна драма', 'Трилер'],
    duration: '1год 45хв',
    trailer: 'https://www.youtube.com/embed/dKoIr3ZJHg0'
  },
  {
    id: 3,
    title: 'Такі дрібниці',
    poster: 'https://multiplex.ua/images/c1/fe/c1fe95846c794b31c6c5980eb4b567f7.jpeg',
    rating: 8.1,
    overview: 'Білл, батько п\'ятьох доньок, дізнається про жахливі умови в місцевому монастирі та стикається з моральною дилемою: мовчати чи діяти.',
    releaseDate: '2025-04-03',
    director: 'Тім Мілантс',
    genres: ['Історична драма'],
    duration: '1год 38хв',
    trailer: 'https://www.youtube.com/embed/g6K65Z7aX_4'
  },
  {
    id: 4,
    title: 'Minecraft: Фільм',
    poster: 'https://upload.wikimedia.org/wikipedia/uk/5/5c/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_Minecraft_%D0%A4%D1%96%D0%BB%D1%8C%D0%BC.jpg?20250406155125',
    rating: 7.5,
    overview: 'Молода дівчина та її друзі потрапляють у світ Minecraft і мають знайти шлях назад, долаючи численні випробування.',
    releaseDate: '2025-04-03',
    director: 'Джаред Хесс',
    genres: ['Пригодницьке фентезі', 'Комедія'],
    duration: '1год 40хв',
    trailer: 'https://www.youtube.com/embed/DrmFheV9Pyk'
  },
  {
    id: 5,
    title: 'Киснева станція',
    poster: 'https://premierakino.com.ua/wp-content/uploads/2025/03/os_poster_02_ua-min-scaled-400x650.jpg',
    rating: 8.3,
    overview: 'Мустафа Джемілєв, політичний в\'язень, працює на кисневій станції в засланні, що символізує його боротьбу та стійкість.',
    releaseDate: '2025-04-10',
    director: 'Іван Тимченко',
    genres: ['Біографічна драма'],
    duration: '1год 50хв',
    trailer: 'https://www.youtube.com/embed/YgtgI7Ab1w4'
  },
  {
    id: 6,
    title: 'Фатальний меседж',
    poster: 'https://upload.wikimedia.org/wikipedia/uk/7/72/%D0%A4%D0%B0%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D0%B8%D0%B9_%D0%BC%D0%B5%D1%81%D0%B5%D0%B4%D0%B6%2C_%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80%2C_2025.jpg',
    rating: 7.0,
    overview: 'Вайолет отримує анонімні повідомлення під час побачення, які перетворюють її вечір на справжній кошмар.',
    releaseDate: '2025-04-10',
    director: 'Кристофер Лендон',
    genres: ['Трилер', 'Детектив'],
    duration: '1год 42хв',
    trailer: 'https://www.youtube.com/embed/WHjcTeMWXgc'
  },
  {
    id: 7,
    title: 'Аматор',
    poster: 'https://upload.wikimedia.org/wikipedia/uk/thumb/e/e8/%D0%90%D0%BC%D0%B0%D1%82%D0%BE%D1%80_2025.png/250px-%D0%90%D0%BC%D0%B0%D1%82%D0%BE%D1%80_2025.png',
    rating: 7.9,
    overview: 'Чарлі Геллер, співробітник ЦРУ, після загибелі дружини вирішує самостійно розслідувати теракт, що забрав її життя.',
    releaseDate: '2025-04-10',
    director: 'Джеймс Хоуз',
    genres: ['Шпигунський трилер'],
    duration: '1год 48хв',
    trailer: 'https://www.youtube.com/embed/71-8CIA9G5U'
  },
  {
    id: 8,
    title: 'Сплячі пси',
    poster: 'https://cdn.planetakino.ua/13251_sleeping-dogs-2024_2024/Media/Posters/vertical/a8820456-8122-456a-a054-d0ccbb04f43c.jpg',
    rating: 7.6,
    overview: 'Колишній детектив з амнезією намагається розкрити стару справу, що може змінити його життя.',
    releaseDate: '2025-04-17',
    director: 'Адам Купер',
    genres: ['Кримінальний трилер'],
    duration: '1год 44хв',
    trailer: 'https://www.youtube.com/embed/TtMpflVp_dE'
  },
  {
    id: 9,
    title: 'Під замком',
    poster: 'https://cdn.planetakino.ua/12292_locked-2025_2025/Media/Posters/vertical/opt_eefe0215-e46b-4940-94cf-15f0ee61bc5e.jpg',
    rating: 8.4,
    overview: 'Злодій потрапляє в пастку більш досвідченого злочинця, який грає з ним у смертельну гру.',
    releaseDate: '2025-04-17',
    director: 'Девід Яровескі',
    genres: ['Трилер'],
    duration: '1год 39хв',
    trailer: 'https://www.youtube.com/embed/rXNSCjTKyWg'
  },
];

export const getMovies = async () => {
  try {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_MOVIES), 800);
    });
  } catch (error) {
    console.error('Помилка отримання фільмів:', error);
    throw error;
  }
};

export const getMovieById = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const movie = MOCK_MOVIES.find(m => m.id === parseInt(id));
        if (movie) {
          resolve(movie);
        } else {
          reject(new Error('Фільм не знайдено'));
        }
      }, 800);
    });
  } catch (error) {
    console.error(`Помилка отримання фільму з номером ${id}:`, error);
    throw error;
  }
};

const MOCK_ACTORS = {
  1: [ // «Виживші. Вихід в пітьму»
    { id: 101, name: "Бенджамін Брівер", character: "Режисер", photo: "https://cdn.planetakino.ua/person/Benjamin_Brewer/75474747.jpg" },
    { id: 102, name: "Майкл Нілон", character: "Сценарист", photo: "https://cdn.planetakino.ua/person/Mike_Nilon/96965.jpg" },
    { id: 103, name: "Ніколас Кейдж", character: "Актор", photo: "https://cdn.planetakino.ua/person/Nicolas+Cage/2RMV9JvFN8KZ4CrikO1BIJYYPwa.jpg" },
    { id: 104, name: "Джейден Мартелл", character: "Актор", photo: "https://cdn.planetakino.ua/person/Jaeden_Martell/Anx0n2hsJnHKAnMQP7ptOTfTxTI.jpg" },
    { id: 105, name: "Максвелл Дженкінс", character: "Актор", photo: "https://cdn.planetakino.ua/person/Maxwell_Jenkins/962452145.jpg" },
    { id: 106, name: "Саді Солеван", character: "Актриса", photo: "https://cdn.planetakino.ua/person/Sadie_Soverall/321452.jpg" },
    { id: 107, name: "Саманта Кохлен", character: "Актриса", photo: "https://cdn.planetakino.ua/person/Samantha_Coughlan/45321456.jpg" },
  ],
  2: [ // «Мишоловка»
    { id: 201, name: "Сергій Касторних", character: "Режисер-сценарист", photo: "https://kino-teatr.ua/public/main/persons/2022-09/x4_photo_6329a8181a675.jpg" },
    { id: 202, name: "Юрій Кулініч", character: "Актор", photo: "https://i.kinobaza.com.ua/posters/original/609c6a707847a.jpg" },
    { id: 203, name: "Андрій Ісаєнко", character: "Актор", photo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Andriy_Isaienko.jpg" },
    { id: 204, name: "Ганна Бірзул", character: "Актор", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9FYncCE0DXQF_k28geW8BHWjRr6_o0QIxSQ&s" },
    { id: 205, name: "Назар Грабар", character: "Актор", photo: "https://www.rbc.ua/static/ckef2/img/2_317.jpg" },
  ],
  3: [ // «Такі дрібниці»
    { id: 301, name: "Тім Мілантс", character: "Режисер", photo: "https://images.kinorium.com/persona/150/1385437.jpg?20180601115641" },
    { id: 302, name: "Кілліан Мерфі", character: "Актор", photo: "https://images.kinorium.com/persona/150/461224.jpg?20240123162512" },
    { id: 303, name: "Емілі Вотсон", character: "Актриса", photo: "https://images.kinorium.com/persona/150/1832.jpg?20201106104129" },
    { id: 304, name: "Айлін Уолш", character: "Актриса", photo: "https://images.kinorium.com/persona/150/681530.jpg?20201106081315" },
    { id: 305, name: "Мішель Фейрлі", character: "Актриса", photo: "https://images.kinorium.com/persona/150/201519.jpg?20220127113717" },
    { id: 306, name: "Патрік Райан", character: "Актор", photo: "https://images.kinorium.com/persona/150/1855508.jpg?20201106090317" },
  ],
  4: [ // «Minecraft: Фільм»
    { id: 401, name: "Джаред Хесс", character: "Режисер", photo: "https://images.kinorium.com/persona/150/287423.jpg?20250218172825" },
    { id: 402, name: "Джек Блек", character: "Актор", photo: "https://images.kinorium.com/persona/150/66348.jpg?20220127163938" },
    { id: 403, name: "Дженніфер Кулідж", character: "Актриса", photo: "https://images.kinorium.com/persona/150/135451.jpg?20220127085711" },
    { id: 404, name: "Емма Майерс", character: "Актриса", photo: "https://images.kinorium.com/persona/150/2058926.jpg?20220606215405" },
    { id: 405, name: "Джейсон Момоа", character: "Актор", photo: "https://images.kinorium.com/persona/150/448768.jpg?20220127154750" },
    { id: 406, name: "Себастьян Юджин Хансен", character: "Актор", photo: "https://images.kinorium.com/persona/150/4350447.jpg?20250414175847" },
  ],
  5: [ // «Киснева станція»
    { id: 501, name: "Іван Тимченко", character: "Режисер", photo: "https://gdb.rferl.org/c4ab60fe-13b2-499f-fc8e-08dd5c87a9b6_cx0_cy3_cw100_w408_r0_s.jpg" },
    { id: 502, name: "Василь Кухарський", character: "Актор", photo: "https://static.ukrinform.com/photos/2023_12/1702309139-192.jpg" },
    { id: 503, name: "Віктор Полторацький", character: "Актор", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf9JPLI8DUC2WTc-fypZcCcbWCt78e5kpQnw&s" },
    { id: 504, name: "Борис Орлов", character: "Актор", photo: "https://kino-teatr.ua/public/main/persons/2020-09/x4_photo_5f619cd71312d.jpg" },
    { id: 505, name: "Христина Дейлик", character: "Актриса", photo: "https://lemonn.agency/media/user/fFF0ni24HWrcNygchqg2DQdYXJE7aK4N.jpg" },
    { id: 506, name: "Сергій Петько", character: "Актор", photo: "https://images.kinorium.com/persona/300/3971148.jpg?1600776546" },
  ],
  6: [ // «Фатальний меседж»
    { id: 601, name: "Кристофер Лендон", character: "Режисер", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc85OZal7YfNmYLOrd2zVYeOrBXIB70pAlDA&s" },
    { id: 602, name: "Меган Фейхи", character: "Актриса", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThvpZmmSr8G5yWg5hvgDhBVIqHpfByDZqRNQ&s" },
    { id: 603, name: "Брендон Скленар", character: "Актор", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMife8amPv-1ye4cBkBJxdrELdjsTiye-8Fw&s" },
    { id: 604, name: "Вайолет Бін", character: "Актриса", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF-1Hi_ACP902iV26nyHlmzNC8rxTMoe537A&s" },
    { id: 605, name: "Джейкоб Робінсон", character: "Актор", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxUKE6Ei5tYfGBB86DfjM6f_dsc2BFXexduA&s" },
    { id: 606, name: "Рід Даймонд", character: "Актор", photo: "https://image.tmdb.org/t/p/original/z3ESNaXSeHiGmmhm49Og9FeXwG8.jpg" },
  ],
  7: [ // «Аматор»
    { id: 701, name: "Джеймс Хоувз", character: "Режисер", photo: "https://www.faynatown.kyiv.ua/wp-content/uploads/ta_poster_ukraine-1200x765.jpg" },
    { id: 702, name: "Катріна Балф", character: "Актриса", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Caitriona_Balfe_at_the_2024_Toronto_International_Film_Festival_%28crop%29.jpg" },
    { id: 703, name: "Джон Бернтал", character: "Актор", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Jon_Bernthal_%2853983124020%29.jpg/330px-Jon_Bernthal_%2853983124020%29.jpg" },
    { id: 704, name: "Рамі Малек", character: "Актор", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi_jBqywqInF3tbd6oizWSmrOOrqf5eykVcA&s" },
    { id: 705, name: "Рейчел Броснаген", character: "Актриса", photo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Rachel_Brosnahan_%282024%29.jpg" },
    { id: 706, name: "Голт МакКеллані", character: "Актор", photo: "https://kino-teatr.ua/public/main/persons/2020-06/x4_photo_5eec7f9298396.jpg" },
  ],
  8: [ // «Сплячі пси»
    { id: 801, name: "Адам Купер", character: "Режисер", photo: "https://images.kinorium.com/persona/180/135585.jpg?1716462267" },
    { id: 802, name: "Рассел Кроу", character: "Актор", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5PTpsPACVS5WER2ikLvuxaph5WPTJK11gGBbw80RfKxXxJPf1LEXf3TtVQEJ0hIShR-A&usqp=CAU" },
    { id: 803, name: "Карен Гіллан", character: "Актриса", photo: "https://kino-teatr.ua/public/main/persons/2023-03/x4_photo_640edfecef0f3.jpg" },
    { id: 804, name: "Мартон Цокас", character: "Актор", photo: "https://staticeu.sweet.tv/images/cache/person_profiles/BC546AISAJ2WWIAD/26555-marton-chokash.jpg" },
    { id: 805, name: "Томмі Фленаган", character: "Актор", photo: "https://upload.wikimedia.org/wikipedia/commons/1/14/Tommy_Flanagan_March_2012_%28cropped%29.jpg" },
    { id: 806, name: "Гаррі Грінвуд", character: "Актор", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWpEGh8aWeZJQdiNwdBUotz-Q8pa4eOGXQPprSZb3VIgb8RhsWiUeZnC7Q087R8VqordQ&usqp=CAU" },
  ],
  9: [ // «Під замком»
    { id: 901, name: "Девід Яровескі", character: "Режисер", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAkxKwW4TJOlICnR-t_CUUwMkD8t0mZwHfPA&s" },
    { id: 902, name: "Білл Скашгорд", character: "Актор", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYv_f5MaOzvPuRiTKwMiKvNATNyL0xXWVW2A&s" },
    { id: 903, name: "Ешлі Картрайт", character: "Актриса", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo2VH-6N_m20xc7BtFR5ttyHndIFr10gAobg&s" },
    { id: 904, name: "Навід Чархі", character: "Актор", photo: "https://kino-teatr.ua/public/main/persons/2025-04/x4_photo_67fccb6c5729d.jpg" },
    { id: 905, name: "Майкл Еклунд", character: "Актор", photo: "https://kino-teatr.ua/public/main/persons/2021-01/x4_photo_600009fc7ce61.jpg" },
    { id: 906, name: "Зандара Кеннеди", character: "Актриса", photo: "https://images.kinorium.com/persona/180/1624183.jpg?1576821866" },
  ],
};

export const getMovieCast = async (movieId) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cast = MOCK_ACTORS[movieId];
        if (cast) {
          resolve(cast);
        } else {
          reject(new Error('Акторів не знайдено'));
        }
      }, 600);
    });
  } catch (error) {
    console.error(`Помилка отримання акторського складу для фільму з номером ${movieId}:`, error);
    throw error;
  }
};