import api from './api';

export const getProjects = async () => {
  const { data } = await api.get('/projects');
  return data;
};

export const getProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const createProject = async (projectData) => {
  const { data } = await api.post('/projects', projectData);
  return data;
};

export const updateProject = async (id, projectData) => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

export const addMember = async (projectId, userId) => {
  const { data } = await api.post(`/projects/${projectId}/members`, { userId });
  return data;
};

export const removeMember = async (projectId, userId) => {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`);
  return data;
};
