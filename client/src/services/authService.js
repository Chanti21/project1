import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const signup = async (name, email, password, role) => {
  const { data } = await api.post('/auth/signup', { name, email, password, role });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
