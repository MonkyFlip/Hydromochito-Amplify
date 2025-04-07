import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // ✅ Importa íconos

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

        verificarSesion();
    }, [navigation]);

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario'); // ✅ Borra datos de sesión
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth'); // ✅ Redirige al login
    };

    return (
        <View style={styles.container}>
            {/* Cuadro opaco centrado */}
            <View style={styles.overlay}>
                <Text style={styles.title}>Panel de Administración</Text>

                {/* Botón Gestión de Usuarios */}
                <TouchableOpacity
                    style={styles.buttonUsuarios}
                    onPress={() => navigation.navigate('Usuarios')}
                >
                    <Icon name="account-group" size={24} color="#FFF" style={styles.icon} /> {/* Ícono de usuarios */}
                    <Text style={styles.buttonText}>Gestión de Usuarios</Text>
                </TouchableOpacity>

                {/* Botón Registros Hydromochito */}
                <TouchableOpacity
                    style={styles.buttonHydromochito}
                    onPress={() => navigation.navigate('Registros Hydromochito')}
                >
                    <Icon name="database" size={24} color="#FFF" style={styles.icon} /> {/* Ícono de registros */}
                    <Text style={styles.buttonText}>Registros Hydromochito</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B9A89E', // ✅ Fondo café claro como antes
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // ✅ Cuadro opaco con transparencia ligera
        padding: 30,
        borderRadius: 15, // ✅ Bordes redondeados para suavizar el diseño
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // ✅ Sombra para profundidad visual
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E88E5', // ✅ Azul vibrante para el título
        textAlign: 'center',
        marginBottom: 25,
    },
    buttonUsuarios: {
        flexDirection: 'row', // ✅ Ícono y texto alineados
        backgroundColor: '#42A5F5', // ✅ Azul brillante para el botón de usuarios
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10, // ✅ Bordes redondeados
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonHydromochito: {
        flexDirection: 'row', // ✅ Ícono y texto alineados
        backgroundColor: '#8D6E63', // ✅ Café tierra para el botón de registros Hydromochito
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 20,
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

export default AdminScreen;