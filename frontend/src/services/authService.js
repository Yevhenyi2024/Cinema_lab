const USERS_KEY = 'kino_users';
const CURRENT_USER_KEY = 'kino_current_user';

const MOCK_USERS = [ 
  {
    id: '1',
    username: 'slava',
    email: 'slava24@gmail.com',
    password: 'slavaadminkino',
    role: 'admin'
  },
  {
    id: '2',
    username: 'zhenya',
    email: 'zhenya8383@gmail.com',
    password: 'qwerty123',
    role: 'user'
  },
];

if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
}

export const registerUser = async ({ email, password, username }) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const exists = users.some(user => user.email === email);
  if (exists) throw new Error('Користувач з такою поштою вже існує');
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password,
    role: 'user'
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Невірна пошта або пароль');
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
};
