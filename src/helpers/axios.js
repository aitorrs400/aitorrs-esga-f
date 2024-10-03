import axios from 'axios';
import { getEnvVariables } from './getEnvVariables';

const { VITE_API_URL } = getEnvVariables();


export const axiosInstance = axios.create({
  baseURL: VITE_API_URL, // Cambia esto por tu URL base
  headers: {
    'Content-Type': 'application/json', // Tipo de contenido (opcional)
    'x-token': localStorage.getItem('token')
    // Otros encabezados personalizados si es necesario
  }
});

export const axiosFileInstance = axios.create({
  baseURL: VITE_API_URL, // Cambia esto por tu URL base
  headers: {
    'Content-Type': 'multipart/form-data', // Tipo de contenido (opcional)
    'x-token': localStorage.getItem('token')
    // Otros encabezados personalizados si es necesario
  }
});
