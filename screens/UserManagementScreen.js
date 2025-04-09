import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsuarios, deleteUsuario } from '../api/users';
import ModalForm from '../components/ModalForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserManagementScreen = ({ navigation }) => {
    const [usuarios, setUsuarios] = useState([]); // Todos los usuarios
    const [displayedUsers, setDisplayedUsers] = useState([]); // Usuarios por página
    const [modalVisible, setModalVisible] = useState(false); // Visibilidad del modal
    const [isAdding, setIsAdding] = useState(false); // Determina si se está agregando un usuario
    const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado para editar
    const [values, setValues] = useState({}); // Valores del formulario
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const usersPerPage = 10; // Cantidad de usuarios por página

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                setValues(JSON.parse(datosUsuario));
                cargarUsuarios();
            } else {
                navigation.navigate('Auth'); // Redireccionar si no hay sesión activa
            }
        };

        verificarSesion();
    }, [navigation]);

    const cargarUsuarios = async () => {
        try {
            const response = await getUsuarios();
            setUsuarios(response || []);
            setCurrentPage(1); // Reiniciar paginación
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            Alert.alert('Error', 'No se pudieron cargar los usuarios.');
        }
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        setDisplayedUsers(usuarios.slice(startIndex, endIndex));
    }, [usuarios, currentPage]);

    const eliminarUsuario = async (idUsuario) => {
        try {
            await deleteUsuario(idUsuario);
            Alert.alert('Usuario eliminado exitosamente.');
            cargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            Alert.alert('Error', 'No se pudo eliminar el usuario.');
        }
    };

    const editarUsuario = (user) => {
        setSelectedUser(user);
        setValues({ nombre: user.nombre, email: user.email, id_usuario: user.id_usuario });
        setIsAdding(false);
        setModalVisible(true);
    };

    const agregarUsuario = () => {
        setSelectedUser(null);
        setValues({ nombre: '', email: '', id_rol: '' }); // Inicializar valores
        setIsAdding(true);
        setModalVisible(true);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(usuarios.length / usersPerPage)) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const interpretarRol = (idRol) => {
        return idRol === 1 ? 'Admin' : 'Usuario';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Usuarios</Text>

            {/* Botón para agregar usuario */}
            <TouchableOpacity style={styles.addButton} onPress={agregarUsuario}>
                <Icon name="account-plus" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Agregar Usuario</Text>
            </TouchableOpacity>

            {/* Columnas de la tabla */}
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>ID</Text>
                <Text style={styles.headerCell}>Nombre</Text>
                <Text style={styles.headerCell}>Correo</Text>
                <Text style={styles.headerCell}>Rol</Text>
                <Text style={styles.headerCell}>Acciones</Text>
            </View>

            <FlatList
                data={displayedUsers}
                keyExtractor={(item) => item.id_usuario.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.id_usuario}</Text>
                        <Text style={styles.cell}>{item.nombre}</Text>
                        <Text style={styles.cell}>{item.email}</Text>
                        <Text style={styles.cell}>{interpretarRol(item.id_rol)}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={() => editarUsuario(item)}
                                style={styles.iconButton}
                            >
                                <Icon name="pencil" size={24} color="#6C4A3C" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    Alert.alert(
                                        'Confirmación',
                                        '¿Estás seguro de que deseas eliminar este usuario?',
                                        [
                                            { text: 'Cancelar', style: 'cancel' },
                                            {
                                                text: 'Eliminar',
                                                onPress: () => eliminarUsuario(item.id_usuario),
                                            },
                                        ]
                                    )
                                }
                                style={styles.iconButton}
                            >
                                <Icon name="trash-can" size={24} color="#D32F2F" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.info}>No hay usuarios disponibles.</Text>}
            />

            {/* Botones de paginación */}
            <View style={styles.pagination}>
                <TouchableOpacity
                    onPress={handlePreviousPage}
                    disabled={currentPage === 1}
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                >
                    <Text style={styles.pageButtonText}>← Anterior</Text>
                </TouchableOpacity>
                <Text style={styles.pageIndicator}>Página {currentPage}</Text>
                <TouchableOpacity
                    onPress={handleNextPage}
                    disabled={currentPage >= Math.ceil(usuarios.length / usersPerPage)}
                    style={[
                        styles.pageButton,
                        currentPage >= Math.ceil(usuarios.length / usersPerPage) && styles.disabledButton,
                    ]}
                >
                    <Text style={styles.pageButtonText}>Siguiente →</Text>
                </TouchableOpacity>
            </View>

            {/* Modal para agregar o editar usuarios */}
            <ModalForm
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={() => {
                    cargarUsuarios(); // Recargar usuarios después de guardar
                    setModalVisible(false);
                }}
                title={isAdding ? 'Agregar Usuario' : 'Editar Usuario'}
                fields={[
                    { name: 'nombre', placeholder: 'Nombre' },
                    { name: 'email', placeholder: 'Correo' },
                    { name: 'id_rol', placeholder: 'Rol' },
                ]}
                values={values}
                setValues={setValues}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F6F4F0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#6C4A3C',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6C4A3C',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#D6C7B2',
        padding: 10,
        marginBottom: 5,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6C4A3C',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D6C7B2',
        alignItems: 'center',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        color: '#6C4A3C',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    iconButton: {
        alignItems: 'center',
    },
    info: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6C4A3C',
        marginTop: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    pageButton: {
        backgroundColor: '#D6C7B2',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    pageButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6C4A3C',
    },
    disabledButton: {
        backgroundColor: '#F6F4F0',
        shadowOpacity: 0,
        elevation: 0,
    },
    pageIndicator: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6C4A3C',
    },
});

export default UserManagementScreen;