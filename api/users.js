import api from './api';

export const getUsuarios = async () => {
    try {
        const response = await api.get('/registros_usuarios');
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
};

export const getUsuarioById = async (id) => {
    try {
        const response = await api.get(`/registros_usuarios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
};

export const updateUsuario = async (id, datosActualizados) => {
    try {
        const response = await api.put(`/registros_usuarios/${id}`, datosActualizados);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return { error: 'No se pudo actualizar el usuario' };
    }
};

export const deleteUsuario = async (id) => {
    try {
        const response = await api.delete(`/registros_usuarios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return { error: 'No se pudo eliminar el usuario' };
    }
};

export const createUsuario = async (nuevoUsuario) => {
    try {
        const response = await api.post('/registros_usuarios', nuevoUsuario);
        return response.data;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return { error: 'No se pudo crear el usuario' };
    }
};

export const createRegistroIot = async (nuevoRegistro) => {
    try {
        console.log('🚀 Enviando datos al servidor:', JSON.stringify(nuevoRegistro, null, 2));
        const response = await api.post('/registros_iot', nuevoRegistro);
        console.log('✅ Respuesta recibida:', response.data);
        return response.data;
    } catch (error) {
        console.error('🚨 Error al crear registro:', error);
        return { error: 'No se pudo crear el registro' };
    }
};