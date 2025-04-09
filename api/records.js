import api from './api';

export const getRegistrosIot = async () => {
    try {
        const response = await api.get('/registros_iot');
        return response.data;
    } catch (error) {
        console.error('Error al obtener registros IoT:', error);
        return [];
    }
};

export const getRegistroById = async (id) => {
    try {
        const response = await api.get(`/registros_iot/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener registro IoT:', error);
        return null;
    }
};

export const createRegistroIot = async (nuevoRegistro) => {
    try {
        const response = await api.post('/registros_iot', nuevoRegistro);
        return response.data;
    } catch (error) {
        console.error('Error al crear registro IoT:', error);
        return { error: 'No se pudo crear el registro' };
    }
};

export const deleteRegistroIot = async (id) => {
    try {
        const response = await api.delete(`/registros_iot/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar registro IoT:', error);
        return { error: 'No se pudo eliminar el registro' };
    }
};

export const getUsuarios = async () => {
    // Example: Fetching users from an API endpoint
    const response = await fetch('https://your-api-endpoint.com/usuarios');
    if (!response.ok) {
        throw new Error('Error fetching users');
    }
    return await response.json();
};