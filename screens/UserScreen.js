import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserScreen = ({ navigation }) => {
    const [usuario, setUsuario] = useState(null); // ✅ Estado para rastrear la sesión del usuario

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData); // ✅ Mantiene la sesión activa
            } else {
                navigation.navigate('Auth'); // ✅ Redirige al inicio de sesión si no hay sesión
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
            {usuario && <Text style={styles.title}>Bienvenido, {usuario.nombre}!</Text>}
            <Button
                title="Mis Registros"
                onPress={() => navigation.navigate('Mis Registros')}
                color="#55AC9B"
            />
            <Button
                title="Cerrar Sesión"
                onPress={cerrarSesion}
                color="#D9534F" // ✅ Botón rojo para cerrar sesión
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3FAF8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#285D56',
    },
});

export default UserScreen;