import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // ✅ Íconos para botones

const UserScreen = ({ navigation }) => {
    const [usuario, setUsuario] = useState(null); // ✅ Estado para rastrear la sesión del usuario

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData); // ✅ Mantiene la sesión activa
            } else {
                navigation.navigate('Auth'); // ✅ Redirige al inicio de sesión si no hay sesión activa
            }
        };

        const manejarEstadoApp = (estado) => {
            if (estado === 'background') {
                AsyncStorage.removeItem('usuario'); // ✅ Borra la sesión al salir de la app
            }
        };

        verificarSesion();

        // Escucha cambios en el estado de la aplicación
        const appStateListener = AppState.addEventListener('change', manejarEstadoApp);

        return () => {
            appStateListener.remove(); // ✅ Limpia el listener al desmontar el componente
        };
    }, [navigation]);

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario'); // ✅ Borra datos de sesión
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth'); // ✅ Redirige al inicio de sesión
    };

    return (
        <View style={styles.container}>
            {/* Saludo dinámico del usuario */}
            {usuario && (
                <View style={styles.overlay}>
                    <Text style={styles.title}>Bienvenido, {usuario.nombre}!</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3FAF8', // ✅ Fondo claro
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // ✅ Fondo opaco con transparencia ligera
        padding: 30,
        borderRadius: 15, // ✅ Bordes redondeados
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5, // ✅ Sombra
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#285D56', // ✅ Verde profundo
        textAlign: 'center',
        marginBottom: 25,
    },
    button: {
        flexDirection: 'row', // ✅ Ícono y texto alineados
        backgroundColor: '#55AC9B', // ✅ Verde cálido
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10, // ✅ Bordes redondeados
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3, // ✅ Sombras en Android
    },
    buttonCerrar: {
        flexDirection: 'row',
        backgroundColor: '#D32F2F', // ✅ Rojo vibrante para cerrar sesión
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 10, // ✅ Espacio entre ícono y texto
    },
    icon: {
        marginRight: 8,
    },
});

export default UserScreen;