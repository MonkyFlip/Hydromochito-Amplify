import api from './api';

export const loginUsuario = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Error en el login:', error);
        return { error: 'Credenciales incorrectas' };
    }
};

export const registrarUsuario = async (nombre, email, password) => {
    try {
        const response = await api.post('/registros_usuarios', { nombre, email, password });
        return response.data;
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return { error: 'No se pudo registrar el usuario' };
    }
};
