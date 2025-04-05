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
    container: { flex: 1, padding: 20, backgroundColor: "#F3FAF8" }, // ✅ Fondo estilizado
    saludo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: "#285D56" },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: "#285D56" },
    headerRow: { flexDirection: 'row', backgroundColor: "#285D56", padding: 10 },
    headerCell: { flex: 1, fontWeight: 'bold', textAlign: 'center', color: "#F3FAF8" },
    row: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: "#A4CAC5", alignItems: 'center' },
    cell: { flex: 1, textAlign: 'center', color: "#285D56" },
    iconButton: { flex: 1, alignItems: 'center' },
});

export default IoTRecordsScreen;