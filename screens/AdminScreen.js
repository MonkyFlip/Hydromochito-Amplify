import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminScreen = ({ navigation }) => {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData); // ✅ Mantiene la sesión activa
            } else {
                navigation.navigate('Auth'); // ✅ Redirige al login si no hay sesión activa
            }
        };

        const mantenerSesion = () => {
            window.addEventListener('beforeunload', () => {
                AsyncStorage.removeItem('usuario'); // ✅ Remueve sesión si se cierra la pestaña
            });
        };

        verificarSesion();
        mantenerSesion();

        return () => {
            window.removeEventListener('beforeunload', mantenerSesion); // ✅ Limpia el evento al desmontar
        };
    }, [navigation]);

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario'); // ✅ Borra datos de sesión
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth'); // ✅ Redirige al login
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Panel de Administración</Text>
            <Button 
                title="Gestión de Usuarios" 
                onPress={() => navigation.navigate('Usuarios')} 
                color="#285D56" // ✅ Color de la paleta
            />
            <Button 
                title="Gestión de Hydromochito" 
                onPress={() => navigation.navigate('Registros IoT')} 
                color="#285D56" 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F3FAF8" },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: "#285D56" },
});

export default AdminScreen;