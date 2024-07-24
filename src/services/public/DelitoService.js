import { axiosConfig } from "../../config/axiosConfig";

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
};

export const obtenerTodos = async () => {
    const url = "/delitos";
    try {
        const response = await axiosConfig.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error al obtener todos los delitos:', error);
        throw error;
    }
};