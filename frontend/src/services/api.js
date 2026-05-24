import axios from 'axios';
const API = axios.create({
  baseURL: 'https://maclinica-2.onrender.com/api'
});
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const register = (data) => API.post('/auth/register', data);
export const login    = (data) => API.post('/auth/login', data);

export const getDoctors     = ()     => API.get('/doctors');
export const getDoctorById  = (id)   => API.get(`/doctors/${id}`);

export const createAppointment  = (data) => API.post('/appointments', data);
export const getMyAppointments  = ()     => API.get('/appointments/mine');
export const cancelAppointment  = (id)   => API.put(`/appointments/${id}`);

export default API;