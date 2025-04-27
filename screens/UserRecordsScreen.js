import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, StyleSheet, TouchableOpacity, AppState, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmModal from '../components/ConfirmModal';
import AddUserRecordModal from '../components/AddUserRecordModal';

const UserRecordsScreen = ({ navigation }) => {
    const [registros, setRegistros] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // Modal de confirmación
    const [addModalVisible, setAddModalVisible] = useState(false); // Modal para agregar registros
    const [usuario, setUsuario] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [registroAEliminar, setRegistroAEliminar] = useState(null); // Registro a eliminar
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar el refresh

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData);
                cargarRegistros(usuarioData.id, pagina);
            } else {
                navigation.navigate('Auth');
            }
        };

        const manejarEstadoApp = (estado) => {
            if (estado === 'background') {
                AsyncStorage.removeItem('usuario');
            }
        };

        verificarSesion();
        const appStateListener = AppState.addEventListener('change', manejarEstadoApp);

        return () => {
            appStateListener.remove();
        };
    }, [pagina, navigation]);

    const cargarRegistros = async (idUsuario, pagina) => {
        try {
            const response = await api.get(`/registros_iot?page=${pagina}&limit=10`);
            if (response.data) {
                const registrosUsuario = response.data.filter((registro) => registro.id_usuario === idUsuario);
                setRegistros(registrosUsuario);
            }
        } catch (error) {
            console.error('Error al obtener registros:', error);
        }
    };

    const eliminarRegistro = async () => {
        if (!registroAEliminar) return;

        try {
            const response = await api.delete(`/registros_iot/${registroAEliminar}`);
            if (response.status === 200) {
                Alert.alert('Éxito', 'Registro eliminado exitosamente.');
                if (usuario) {
                    cargarRegistros(usuario.id, pagina);
                }
            } else {
                Alert.alert('Error', 'No se pudo eliminar el registro.');
            }
        } catch (error) {
            console.error('Error al eliminar registro:', error);
            Alert.alert('Error', 'Ocurrió un error al intentar eliminar el registro.');
        } finally {
            setRegistroAEliminar(null);
            setModalVisible(false);
        }
    };

    const agregarRegistro = async (registro) => {
        try {
            const response = await api.post('/registros_iot', registro);
            if (response.status === 201) {
                Alert.alert('Éxito', 'Registro agregado exitosamente.');
                cargarRegistros(usuario.id, pagina); // Recargar registros después de agregar
            } else {
                Alert.alert('Error', 'No se pudo agregar el registro.');
            }
        } catch (error) {
            console.error('Error al agregar registro:', error);
            Alert.alert('Error', 'Ocurrió un error al intentar agregar el registro.');
        }
    };

    const NGROK_API_URL = 'https://1637-201-162-226-163.ngrok-free.app';

    const obtenerRegistrosDesdeCircuito = async () => {
        try {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (!datosUsuario) {
                Alert.alert('Error', 'Debe iniciar sesión para obtener registros.');
                return;
            }

            const { id } = JSON.parse(datosUsuario);

            console.log('📡 Solicitando registros desde el circuito para el usuario:', id);

            const response = await fetch('http://3.148.193.165/api/registrar_desde_hydromochito', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: id, esp32_url: NGROK_API_URL }),
            });

            // 🔎 Primero revisamos el cuerpo de la respuesta ANTES de intentar convertirlo a JSON
            const responseText = await response.text();
            console.log('✅ Respuesta en texto (sin procesar):', responseText);

            // Intentamos convertir la respuesta a JSON solo si no es HTML
            try {
                const jsonResponse = JSON.parse(responseText);
                console.log('✅ Respuesta procesada como JSON:', JSON.stringify(jsonResponse, null, 2));

                if (jsonResponse.success) {
                    Alert.alert('Éxito', jsonResponse.message);
                    cargarRegistros(id, 1); // 🚀 Recargar la lista después de obtener registros
                } else {
                    Alert.alert('Error', jsonResponse.message);
                }
            } catch (jsonError) {
                console.error('🚨 Error al convertir la respuesta en JSON:', jsonError);
                Alert.alert('Error', 'El servidor no devolvió datos válidos.');
            }
        } catch (error) {
            console.error('🚨 Error al obtener registros desde el circuito:', error);
            Alert.alert('Error', 'Ocurrió un error inesperado.');
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (usuario) {
            cargarRegistros(usuario.id, pagina).then(() => setRefreshing(false));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Registros de Hydromochito</Text>

            {/* Botones alineados */}
            <View style={styles.buttonsRow}>
                <TouchableOpacity
                    style={styles.buttonAgregar}
                    onPress={() => setAddModalVisible(true)} // Abrir el modal de agregar registros
                >
                    <Icon name="plus-circle" size={24} color="#FFF" />
                    <Text style={styles.buttonText}>Agregar Registro</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonHydromochito} onPress={obtenerRegistrosDesdeCircuito}>
                    <Icon name="cloud-download" size={24} color="#FFF" />
                    <Text style={styles.buttonText}>Registrar desde Hydromochito</Text>
                </TouchableOpacity>
            </View>

            {/* Tabla de registros */}
            {registros.length === 0 ? (
                <Text style={styles.info}>No tienes registros aún.</Text>
            ) : (
                <>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell}>Flujo de Agua</Text>
                        <Text style={styles.headerCell}>Nivel de Agua</Text>
                        <Text style={styles.headerCell}>Temperatura</Text>
                        <Text style={styles.headerCell}>Energía</Text>
                        <Text style={styles.headerCell}>Acción</Text>
                    </View>
                    <FlatList
                        data={registros}
                        keyExtractor={(item) => item.id_registro.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <Text style={styles.cell}>{item.flujo_agua}</Text>
                                <Text style={styles.cell}>{item.nivel_agua}</Text>
                                <Text style={styles.cell}>{item.temp}</Text>
                                <Text style={styles.cell}>{item.energia}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setRegistroAEliminar(item.id_registro);
                                        setModalVisible(true);
                                    }}
                                    style={styles.iconButton}
                                >
                                    <Icon name="trash-can" size={24} color="#55AC9B" />
                                </TouchableOpacity>
                            </View>
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Pull-to-refresh
                        }
                    />
                </>
            )}

            {/* Modal para Agregar Registro */}
            <AddUserRecordModal
                visible={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAdd={agregarRegistro}
            />

            {/* Modal de Confirmación de Eliminación */}
            <ConfirmModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={eliminarRegistro}
                title="Confirmación"
                message="¿Estás seguro de que deseas eliminar este registro?"
            />

            <AddUserRecordModal
                visible={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                usuario={usuario}
                cargarRegistros={cargarRegistros} // ✅ Pasar la función como prop
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F3FAF8', // Light greenish background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#285D56', // Dark green
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    buttonAgregar: {
        flex: 1,
        marginRight: 10,
        flexDirection: 'row',
        backgroundColor: '#55AC9B', // Medium green
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonHydromochito: {
        flex: 1,
        marginLeft: 10,
        flexDirection: 'row',
        backgroundColor: '#285D56', // Dark green
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#285D56', // Dark green
        padding: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#F3FAF8', // Light green
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#A4CAC5', // Light green border
        alignItems: 'center',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        color: '#285D56', // Dark green
    },
    info: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
        color: '#A4CAC5', // Light green
    },
    iconButton: {
        padding: 5,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Transparent dark overlay
    },
    modal: {
        width: '80%',
        backgroundColor: '#F3FAF8', // Light greenish modal background
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#285D56', // Dark green
        marginBottom: 10,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#A4CAC5', // Light green border
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#E3F2FD', // Very light blue for input background
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalCancelButton: {
        backgroundColor: '#D7F0E9', // Light green for cancel
    },
    modalConfirmButton: {
        backgroundColor: '#2D7468', // Dark green for confirm
    },
    modalCancelText: {
        color: '#285D56', // Dark green text for cancel
        fontWeight: 'bold',
    },
    modalConfirmText: {
        color: '#F3FAF8', // Light green text for confirm
        fontWeight: 'bold',
    },
});

export default UserRecordsScreen;