import AsyncStorage from '@react-native-async-storage/async-storage';

export const guardarDato = async (clave, valor) => {
    try {
        await AsyncStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
        console.error('Error al guardar dato:', error);
    }
};

export const obtenerDato = async (clave) => {
    try {
        const valor = await AsyncStorage.getItem(clave);
        return valor ? JSON.parse(valor) : null;
    } catch (error) {
        console.error('Error al obtener dato:', error);
        return null;
    }
};

export const eliminarDato = async (clave) => {
    try {
        await AsyncStorage.removeItem(clave);
    } catch (error) {
        console.error('Error al eliminar dato:', error);
    }
};
