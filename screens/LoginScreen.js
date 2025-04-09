import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Alert, Modal, TouchableOpacity, Image } from 'react-native';
import api from '../api/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import bcrypt from 'bcrypt-react-native'; // Importación de bcrypt-react-native
import { StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [nombre, setNombre] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar contraseña

    // Manejo del inicio de sesión
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Todos los campos son obligatorios para iniciar sesión.');
            return;
        }
        try {
            console.log('Datos enviados al servidor:', { email, password }); // Log para depuración

            // Solicitud de inicio de sesión al servidor
            const response = await api.post('/login', { email, password });
            const { usuario } = response.data;

            if (!usuario) {
                Alert.alert('Error', 'No se encontró un usuario válido.');
                return;
            }

            // Guardar datos del usuario en AsyncStorage
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
            navigation.navigate(usuario.id_rol === 1 ? 'Admin' : 'User'); // Navegar según el rol del usuario
        } catch (error) {
            console.error('Error en el login:', error); // Log para depuración
            if (error.response && error.response.data && error.response.data.error) {
                Alert.alert('Error', error.response.data.error); // Mensaje del servidor
            } else {
                Alert.alert('Error', 'No se pudo iniciar sesión, intenta más tarde.');
            }
        }
    };

    // Manejo del registro de usuarios
    const handleRegister = async () => {
        if (!nombre || !email || !password) {
            Alert.alert('Error', 'Todos los campos son obligatorios para registrarte.');
            return;
        }
        try {
            const id_rol = email.includes('@mony-tek') ? 1 : 2;

            // Encriptar la contraseña antes de enviarla
            const hashedPassword = await bcrypt.hash(password, 10);

            // Enviar los datos al servidor para registrar al usuario
            console.log('Datos enviados al servidor para registro:', { nombre, email, password: hashedPassword });
            const response = await api.post('/registros_usuarios', {
                nombre,
                email,
                password: hashedPassword,
                id_rol,
            });

            if (!response.data || response.data.error) {
                Alert.alert('Error', response?.data?.error || 'No se pudo registrar');
                return;
            }

            Alert.alert('Éxito', 'Usuario registrado correctamente');
            setShowRegister(false); // Cerrar el modal de registro
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            if (error.response && error.response.data && error.response.data.error) {
                Alert.alert('Error', error.response.data.error); // Mensaje del servidor
            } else {
                Alert.alert('Error', 'No se pudo registrar, intenta más tarde.');
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo del encabezado */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/logo.png')} // Cambia al path de tu logo
                    style={styles.logo}
                />
            </View>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                onChangeText={(text) => setEmail(text.trim())} // Eliminar espacios adicionales
                placeholderTextColor="#79AEB2"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry={!showPassword}
                onChangeText={(text) => setPassword(text.trim())} // Eliminar espacios adicionales
                placeholderTextColor="#79AEB2"
            />
            <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword((prevState) => !prevState)}
            >
                <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#285D56"
                />
                <Text style={styles.showPasswordText}>
                    {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
                <Icon name="login" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>

            <View style={styles.registerInviteContainer}>
                <Text style={styles.registerInviteText}>¿Aún no tienes una cuenta?</Text>
                <TouchableOpacity style={styles.buttonRegister} onPress={() => setShowRegister(true)}>
                    <Icon name="account-plus" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Únete a Hydromochito</Text>
                </TouchableOpacity>
            </View>

            {/* Modal para el registro */}
            <Modal visible={showRegister} transparent>
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.title}>Registro</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            onChangeText={(text) => setNombre(text.trim())} // Eliminar espacios adicionales
                            placeholderTextColor="#79AEB2"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            onChangeText={(text) => setEmail(text.trim())} // Eliminar espacios adicionales
                            placeholderTextColor="#79AEB2"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => setPassword(text.trim())} // Remover espacios extra
                            placeholderTextColor="#79AEB2"
                        />
                        <TouchableOpacity
                            style={styles.showPasswordButton}
                            onPress={() => setShowPassword((prevState) => !prevState)}
                        >
                            <Icon
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color="#285D56"
                            />
                            <Text style={styles.showPasswordText}>
                                {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonLogin} onPress={handleRegister}>
                            <Icon name="check-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Crear cuenta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonClose} onPress={() => setShowRegister(false)}>
                            <Icon name="close-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#DAE6E9', // Fondo azul claro
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20, // Espaciado entre el logo y el título
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60, // Forma de círculo
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Blanco muy transparente
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#4E957A', // Verde de la paleta
    },
    input: {
        borderWidth: 1,
        borderColor: '#79AEB2', // Azul para bordes
        backgroundColor: '#F1FAFA', // Fondo claro para inputs
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        color: '#285D56', // Texto de entradas
    },
    buttonLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4E957A', // Verde principal para el botón
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    buttonRegister: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E76B3C', // Naranja vibrante para registrar
        paddingVertical: 15,
        borderRadius: 10,
    },
    registerInviteContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    registerInviteText: {
        fontSize: 16,
        color: '#285D56', // Texto amigable para invitar
        marginBottom: 5,
    },
    buttonClose: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E45407', // Rojo para cerrar
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // Blanco para el texto de los botones
        marginLeft: 10,
    },
    buttonIcon: {
        marginRight: 5,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        backgroundColor: '#FFF4E6', // Fondo de Trinidad
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    showPasswordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    showPasswordText: {
        fontSize: 14,
        marginLeft: 5,
        color: '#285D56', // Verde para el texto del botón
    },
    passwordHint: {
        fontSize: 12,
        color: '#E76B3C', // Naranja para el mensaje sutil
        marginTop: 5,
    },
});

export default LoginScreen;