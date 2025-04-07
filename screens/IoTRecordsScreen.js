import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRegistrosIot, createRegistroIot, deleteRegistroIot } from '../api/records';
import ModalForm from '../components/ModalForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IoTRecordsScreen = () => {
    const [registros, setRegistros] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData); // ✅ Mantiene la sesión activa
                cargarRegistros();
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
    }, []);

    const cargarRegistros = async () => {
        try {
            const response = await getRegistrosIot();
            setRegistros(response);
        } catch (error) {
            console.error('Error al cargar registros:', error);
        }
    };

    const eliminarRegistro = async (id) => {
        try {
            await deleteRegistroIot(id);
            Alert.alert('Registro eliminado');
            cargarRegistros();
        } catch (error) {
            console.error('Error al eliminar registro:', error);
        }
    };

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario'); // ✅ Borra datos de sesión
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth'); // ✅ Redirige al login
    };

    return (
        <View style={styles.container}>
            {usuario && <Text style={styles.saludo}>Hola, {usuario.nombre}! 👋</Text>}
            <Text style={styles.title}>Registros de Hydromochito</Text>

            <Button
                title="Nuevo Registro"
                onPress={() => setModalVisible(true)}
                color="#55AC9B" // ✅ Color de botón estilizado
            />

            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Flujo de Agua</Text>
                <Text style={styles.headerCell}>Nivel de Agua</Text>
                <Text style={styles.headerCell}>Temperatura</Text>
                <Text style={styles.headerCell}>Acción</Text>
            </View>

            <FlatList
                data={registros}
                keyExtractor={(item) => item.id_registro.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.flujo_agua}</Text>
                        <Text style={styles.cell}>{item.nivel_agua}</Text>
                        <Text style={styles.cell}>{item.temp}°C</Text>
                        <TouchableOpacity onPress={() => eliminarRegistro(item.id_registro)} style={styles.iconButton}>
                            <Icon name="trash-can" size={24} color="#55AC9B" /> {/* ✅ Icono estilizado */}
                        </TouchableOpacity>
                    </View>
                )}
            />

            {modalVisible && (
                <ModalForm
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={(data) => {
                        createRegistroIot(data);
                        cargarRegistros();
                        setModalVisible(false);
                    }}
                    title="Nuevo Registro IoT"
                    fields={[
                        { name: 'flujo_agua', placeholder: 'Flujo de Agua' },
                        { name: 'nivel_agua', placeholder: 'Nivel de Agua' },
                        { name: 'temp', placeholder: 'Temperatura' },
                    ]}
                    setValues={() => {}}
                    values={{}}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#E3F2FD", // ✅ Azul claro como base del fondo
    },
    saludo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: "#1565C0", // ✅ Azul profundo para el texto
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: "#0D47A1", // ✅ Azul aún más vibrante para destacar el título
        textShadowColor: "#BBDEFB", // ✅ Sombra ligera en azul claro
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: "#1976D2", // ✅ Azul fuerte para el encabezado
        padding: 12,
        borderRadius: 8, // ✅ Bordes redondeados para suavizar
        marginBottom: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#E3F2FD", // ✅ Texto blanco-azulado para contraste
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#BBDEFB", // ✅ Azul claro como divisor
        alignItems: 'center',
        backgroundColor: "#E1F5FE", // ✅ Fondo azul pálido para alternar
        borderRadius: 6,
        marginBottom: 5,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        color: "#0D47A1", // ✅ Azul oscuro para las celdas de datos
    },
    iconButton: {
        flex: 1,
        alignItems: 'center',
    },
    addButton: {
        marginVertical: 10,
        paddingVertical: 15,
        backgroundColor: "#64B5F6", // ✅ Botón azul vibrante
        borderRadius: 8,
        shadowColor: "#000", // ✅ Sombra para profundidad
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3, // ✅ Elevación en Android
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#FFFFFF", // ✅ Texto blanco para contraste
    },
});

export default IoTRecordsScreen;