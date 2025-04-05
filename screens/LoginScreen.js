import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, Alert, Modal, StyleSheet } from 'react-native';
import api from '../api/api';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [nombre, setNombre] = useState('');

    const handleLogin = async () => {
        try {
            const response = await api.post('/login', { email, password });
            console.log('Respuesta completa:', response);
    
            if (response.status === 401 || !response.data || response.data.error) {
                Alert.alert('Error', 'Correo o contraseña incorrecta. Verifica e intenta nuevamente.');
                return;
            }
    
            const { usuario } = response.data;
            if (!usuario || !usuario.id_rol) {
                Alert.alert('Error', 'No se pudo obtener la información del usuario');
                return;
            }
    
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
            console.log('Usuario guardado en AsyncStorage:', usuario);
    
            navigation.navigate(usuario.id_rol === 1 ? 'Admin' : 'User');
        } catch (error) {
            console.error('Error en el login:', error);
            Alert.alert('Error', 'No se pudo iniciar sesión, intenta más tarde.');
        }
    };
    

    const handleRegister = async () => {
        try {
            if (!nombre || !email || !password) {
                Alert.alert('Error', 'Todos los campos son obligatorios');
                return;
            }

            // ✅ Asignar `id_rol` automáticamente según el correo
            const id_rol = email.includes('@mony-tek') ? 1 : 2;

            const response = await api.post('/registros_usuarios', { nombre, email, password, id_rol }); // ✅ Se envía `id_rol`
            
            if (!response.data || response.data.error) {
                Alert.alert('Error', response?.data?.error || 'No se pudo registrar');
                return;
            }

            Alert.alert('Éxito', 'Usuario registrado correctamente');
            setShowRegister(false);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            Alert.alert('Error', `No se pudo registrar: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput style={styles.input} placeholder="Correo electrónico" onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry onChangeText={setPassword} />
            <Button title="Ingresar" onPress={handleLogin} />

            <Button title="Registrarse" onPress={() => setShowRegister(true)} />

            <Modal visible={showRegister} transparent>
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.title}>Registro</Text>
                        <TextInput style={styles.input} placeholder="Nombre" onChangeText={setNombre} />
                        <TextInput style={styles.input} placeholder="Correo electrónico" onChangeText={setEmail} />
                        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry onChangeText={setPassword} />
                        <Button title="Crear cuenta" onPress={handleRegister} />
                        <Button title="Cerrar" onPress={() => setShowRegister(false)} color="red" />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
    overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modal: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
});

export default LoginScreen;
