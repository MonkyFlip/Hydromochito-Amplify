import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Animated, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import ModalForm from '../components/ModalForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserRecordsScreen = ({ navigation }) => {
    const [registros, setRegistros] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalOpacity] = useState(new Animated.Value(0));
    const [usuario, setUsuario] = useState(null);
    const [pagina, setPagina] = useState(1);

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

    const toggleModal = (visible) => {
        setModalVisible(visible);
        Animated.timing(modalOpacity, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario');
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth');
    };

    const registrarDesdeHydromochito = async () => {
        try {
            const usuario = await AsyncStorage.getItem('usuario');
            if (!usuario) {
                Alert.alert('Error', 'Debe iniciar sesión para registrar datos.');
                return;
            }

            const { id } = JSON.parse(usuario);

            const response = await fetch('http://tu-api-url.com/api/registrar_desde_esp32', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_usuario: id }),
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert('Éxito', result.message);
                cargarRegistros(id, pagina); // Recargar registros después del registro
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            console.error('Error al registrar desde Hydromochito:', error);
            Alert.alert('Error', 'Ocurrió un error inesperado.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Registros de Hydromochito</Text>

            {/* Botones alineados */}
            <View style={styles.buttonsRow}>
                <TouchableOpacity style={styles.buttonAgregar} onPress={() => toggleModal(true)}>
                    <Icon name="plus-circle" size={24} color="#FFF" />
                    <Text style={styles.buttonText}>Agregar Registro</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonHydromochito} onPress={registrarDesdeHydromochito}>
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
                                <TouchableOpacity onPress={() => eliminarRegistro(item.id_registro)} style={styles.iconButton}>
                                    <Icon name="trash-can" size={24} color="#55AC9B" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F3FAF8' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#285D56' },
    buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    buttonAgregar: {
        flex: 1,
        marginRight: 10,
        flexDirection: 'row',
        backgroundColor: '#55AC9B',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonHydromochito: {
        flex: 1,
        marginLeft: 10,
        flexDirection: 'row',
        backgroundColor: '#285D56',
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
    headerRow: { flexDirection: 'row', backgroundColor: '#285D56', padding: 10 },
    headerCell: { flex: 1, fontWeight: 'bold', textAlign: 'center', color: '#F3FAF8' },
    row: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#A4CAC5', alignItems: 'center' },
    cell: { flex: 1, textAlign: 'center', color: '#285D56' },
    info: { textAlign: 'center', fontSize: 18, marginTop: 20, color: '#A4CAC5' },
});

export default UserRecordsScreen;