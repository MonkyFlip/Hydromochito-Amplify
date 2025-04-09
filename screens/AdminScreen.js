import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons

const AdminScreen = ({ navigation }) => {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                setUsuario(JSON.parse(datosUsuario));
            } else {
                navigation.navigate('Auth'); // Redirect if no active session
            }
        };

        verificarSesion();
    }, [navigation]);

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario');
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth'); // Redirect to login
    };

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <Text style={styles.title}>Panel de Administración</Text>

                {/* Button: Gestión de Usuarios */}
                <TouchableOpacity
                    style={styles.buttonUsuarios}
                    onPress={() => navigation.navigate('Usuarios')}
                >
                    <Icon name="account-group" size={24} color="#FFF" style={styles.icon} />
                    <Text style={styles.buttonText}>Gestión de Usuarios</Text>
                </TouchableOpacity>

                {/* Button: Registrar desde Hydromochito */}
                <TouchableOpacity
                    style={styles.buttonHydromochito}
                    onPress={() => navigation.navigate('Registros Hydromochito')}
                >
                    <Icon name="database" size={24} color="#FFF" style={styles.icon} />
                    <Text style={styles.buttonText}>Registros de Hydromochito</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B9A89E', // Café claro
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Opaco con transparencia
        padding: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E88E5', // Azul vibrante
        textAlign: 'center',
        marginBottom: 25,
    },
    buttonUsuarios: {
        flexDirection: 'row',
        backgroundColor: '#42A5F5', // Azul brillante
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
    buttonHydromochito: {
        flexDirection: 'row',
        backgroundColor: '#8D6E63', // Café tierra
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
    buttonCerrar: {
        flexDirection: 'row',
        backgroundColor: '#D32F2F', // Rojo vibrante para cerrar sesión
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
        marginLeft: 10,
    },
    icon: {
        marginRight: 8,
    },
});

export default AdminScreen;