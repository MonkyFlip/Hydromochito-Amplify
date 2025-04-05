import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserScreen = ({ navigation }) => {
    const [usuario, setUsuario] = useState(null); // ✅ State to track user session

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData); // ✅ Keeps the session active
            } else {
                navigation.navigate('Auth'); // ✅ Redirects to login if no session
            }
        };

        const mantenerSesion = () => {
            window.addEventListener('beforeunload', () => {
                AsyncStorage.removeItem('usuario'); // ✅ Removes session only when the tab is closed
            });
        };

        verificarSesion();
        mantenerSesion();

        return () => {
            window.removeEventListener('beforeunload', mantenerSesion); // ✅ Cleans up the event listener
        };
    }, [navigation]);

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario'); // ✅ Clears session manually
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth'); // ✅ Redirects to login
    };

    return (
        <View style={styles.container}>
            {usuario && <Text style={styles.title}>Bienvenido, {usuario.nombre}!</Text>}
            <Button 
                title="Mis Registros" 
                onPress={() => navigation.navigate('Mis Registros')} 
                color="#55AC9B" 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: "#F3FAF8" 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        color: "#285D56" 
    },
});

export default UserScreen;