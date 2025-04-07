import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Button, Animated, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import ModalForm from '../components/ModalForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserRecordsScreen = ({ navigation }) => {
    const [registros, setRegistros] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalOpacity] = useState(new Animated.Value(0)); // ✅ Para la transición del modal
    const [usuario, setUsuario] = useState(null);
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData); // ✅ Mantiene la sesión activa
                cargarRegistros(usuarioData.id, pagina); // ✅ Carga los registros del usuario
            } else {
                navigation.navigate('Auth'); // ✅ Redirige al login si no hay sesión activa
            }
        };

        const manejarEstadoApp = (estado) => {
            if (estado === 'background') {
                AsyncStorage.removeItem('usuario'); // ✅ Borra la sesión al mover la app al fondo
            }
        };

        verificarSesion();

        // Escucha cambios en el estado de la aplicación
        const appStateListener = AppState.addEventListener('change', manejarEstadoApp);

        return () => {
            appStateListener.remove(); // ✅ Limpia el listener al desmontar el componente
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
        setModalVisible(visible); // ✅ Cambia el estado para mostrar/ocultar el modal
        Animated.timing(modalOpacity, {
            toValue: visible ? 1 : 0,
            duration: 300, // ✅ Transición del modal
            useNativeDriver: true,
        }).start();
    };

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario'); // ✅ Elimina la sesión manualmente
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth'); // ✅ Redirige al login
    };

    return (
        <View style={styles.container}>
            {usuario && <Text style={styles.saludo}>Hola, {usuario.nombre}! Bienvenido 👋</Text>}
            <Text style={styles.title}>Mis Registros IoT</Text>

            <Button
                title="Agregar Registro"
                onPress={() => toggleModal(true)} // ✅ Activa el modal al presionar
                color="#55AC9B"
            />

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

                    {registros.length > 10 && (
                        <View style={styles.pagination}>
                            <Button
                                title="← Anterior"
                                onPress={() => setPagina((prev) => Math.max(prev - 1, 1))}
                                disabled={pagina === 1}
                                color="#285D56"
                            />
                            <Text style={styles.pageText}>Página {pagina}</Text>
                            <Button
                                title="Siguiente →"
                                onPress={() => setPagina((prev) => prev + 1)}
                                color="#285D56"
                            />
                        </View>
                    )}
                </>
            )}

            {modalVisible && (
                <Animated.View style={[styles.modalContainer, { opacity: modalOpacity }]}>
                    <ModalForm
                        visible={modalVisible}
                        onClose={() => toggleModal(false)}
                        onSubmit={(data) => {
                            api.post('/registros_iot', { ...data, id_usuario: usuario.id });
                            cargarRegistros(usuario.id, pagina);
                            toggleModal(false);
                        }}
                        title="Nuevo Registro IoT"
                        fields={[
                            { name: 'flujo_agua', placeholder: 'Flujo de Agua' },
                            { name: 'nivel_agua', placeholder: 'Nivel de Agua' },
                            { name: 'temp', placeholder: 'Temperatura' },
                            { name: 'energia', placeholder: 'Fuente de Energía' },
                        ]}
                        setValues={() => {}}
                        values={{}}
                    />
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F3FAF8' },
    saludo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#285D56' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#285D56' },
    headerRow: { flexDirection: 'row', backgroundColor: '#285D56', padding: 10 },
    headerCell: { flex: 1, fontWeight: 'bold', textAlign: 'center', color: '#F3FAF8' },
    row: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#A4CAC5', alignItems: 'center' },
    cell: { flex: 1, textAlign: 'center', color: '#285D56' },
    iconButton: { flex: 1, alignItems: 'center', padding: 5 },
    info: { textAlign: 'center', fontSize: 18, marginTop: 20, color: '#A4CAC5' },
    pagination: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    pageText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#285D56' },
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default UserRecordsScreen;