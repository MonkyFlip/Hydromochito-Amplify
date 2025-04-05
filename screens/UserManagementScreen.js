import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsuarios, deleteUsuario } from '../api/users';
import ModalForm from '../components/ModalForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserManagementScreen = ({ navigation }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usuario, setUsuario] = useState(null); // ✅ Mantener el estado del usuario

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData); // ✅ Mantiene la sesión activa
                cargarUsuarios(); // Carga la lista de usuarios
            } else {
                navigation.navigate('Auth'); // ✅ Redirige al login si no hay sesión activa
            }
        };

        const mantenerSesion = () => {
            window.addEventListener('beforeunload', () => {
                AsyncStorage.removeItem('usuario'); // ✅ Remueve la sesión si se cierra la pestaña
            });
        };

        verificarSesion();
        mantenerSesion();

        return () => {
            window.removeEventListener('beforeunload', mantenerSesion); // ✅ Limpia el evento al desmontar
        };
    }, [navigation]);

    const cargarUsuarios = async () => {
        try {
            const response = await getUsuarios();
            setUsuarios(response);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };

    const eliminarUsuario = async (id) => {
        try {
            await deleteUsuario(id);
            Alert.alert('Usuario eliminado');
            cargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario'); // ✅ Borra datos de sesión
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth'); // ✅ Redirige al login
    };

    const interpretarRol = (id_rol) => {
        return id_rol === 1 ? 'Admin' : 'Usuario'; // ✅ Interpreta el rol
    };

    return (
        <View style={styles.container}>
            {usuario && <Text style={styles.saludo}>Hola, {usuario.nombre}! 👋</Text>}
            <Text style={styles.title}>Gestión de Usuarios</Text>

            <Button 
                title="Nuevo Usuario" 
                onPress={() => setModalVisible(true)} 
                color="#AC8863" 
            />

            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Nombre</Text>
                <Text style={styles.headerCell}>Correo</Text>
                <Text style={styles.headerCell}>Rol</Text>
                <Text style={styles.headerCell}>Acción</Text>
            </View>

            <FlatList
                data={usuarios}
                keyExtractor={(item) => item.id_usuario.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.nombre}</Text>
                        <Text style={styles.cell}>{item.email}</Text>
                        <Text style={styles.cell}>{interpretarRol(item.id_rol)}</Text> 
                        <TouchableOpacity onPress={() => eliminarUsuario(item.id_usuario)} style={styles.iconButton}>
                            <Icon name="trash-can" size={24} color="#AC8863" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <ModalForm
                visible={modalVisible || !!selectedUser}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedUser(null);
                }}
                onSubmit={() => {
                    cargarUsuarios();
                    setModalVisible(false);
                }}
                title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                fields={[
                    { name: 'nombre', placeholder: 'Nombre' },
                    { name: 'email', placeholder: 'Correo electrónico' },
                ]}
                setValues={setSelectedUser}
                values={selectedUser || {}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F6F4F0" },
    saludo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: "#6C4A3C" },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: "#6C4A3C" },
    headerRow: { flexDirection: 'row', backgroundColor: "#6C4A3C", padding: 10 },
    headerCell: { flex: 1, fontWeight: 'bold', textAlign: 'center', color: "#F6F4F0" },
    row: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: "#D6C7B2", alignItems: 'center' },
    cell: { flex: 1, textAlign: 'center', color: "#6C4A3C" },
    iconButton: { flex: 1, alignItems: 'center' },
});

export default UserManagementScreen;