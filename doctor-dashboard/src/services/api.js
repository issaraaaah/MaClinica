import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const doctor = JSON.parse(localStorage.getItem('doctor'));
  if (doctor && doctor.token) {
    config.headers.Authorization = `Bearer ${doctor.token}`;
  }
  return config;
});

export const loginDoctor       = (data)     => API.post('/auth/login', data);
export const getMyAppointments = ()         => API.get('/appointments/doctor');
export const updateAppointment = (id, data) => API.put(`/appointments/${id}`, data);
export const getMyProfile      = ()         => API.get('/doctors/me');
export const updateMyProfile   = (data)     => API.put('/doctors/me', data);

export default API;