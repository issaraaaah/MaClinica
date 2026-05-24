import axios from 'axios';

const API = axios.create({
  baseURL: 'https://maclinica-2.onrender.com//api'
});
API.interceptors.request.use((config) => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  if (admin && admin.token) {
    config.headers.Authorization = `Bearer ${admin.token}`;
  }
  return config;
});

// Auth
export const loginAdmin = (data) => API.post('/auth/login', data);

// Doctors
export const getDoctors    = ()       => API.get('/doctors');
export const createDoctor  = (data)   => API.post('/doctors', data);
export const updateDoctor  = (id, data) => API.put(`/doctors/${id}`, data);
export const deleteDoctor  = (id)     => API.delete(`/doctors/${id}`);

// Appointments
export const getAllAppointments  = ()         => API.get('/appointments');
export const updateAppointment   = (id, data) => API.put(`/appointments/${id}`, data);
export const deleteAppointment   = (id)       => API.delete(`/appointments/${id}`);

// Users
export const getUsers   = () => API.get('/users');
export const blockUser  = (id) => API.put(`/users/${id}/block`);

export default API;