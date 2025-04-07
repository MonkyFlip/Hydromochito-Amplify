import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, Button, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { LineChart } from 'react-native-chart-kit';

const UserChartsScreen = ({ navigation }) => {
    const [registros, setRegistros] = useState([]);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData);
                cargarRegistros(usuarioData.id); // ✅ Carga los registros del usuario
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
    }, [navigation]);

    const cargarRegistros = async (idUsuario) => {
        try {
            const response = await api.get('/registros_iot');
            if (response.data) {
                const registrosUsuario = response.data.filter((registro) => registro.id_usuario === idUsuario);
                setRegistros(registrosUsuario);
            }
        } catch (error) {
            console.error('Error al obtener registros:', error);
        }
    };

    const limpiarDatos = (registros, campo) => {
        return registros.map((r) => (isNaN(r[campo]) || !isFinite(r[campo]) ? 0 : r[campo]));
    };

    const cerrarSesion = async () => {
        await AsyncStorage.removeItem('usuario'); // ✅ Borra la sesión manualmente
        setUsuario(null);
        Alert.alert('Sesión cerrada');
        navigation.navigate('Auth'); // ✅ Redirige al login
    };

    return (
        <View style={styles.container}>
            {usuario && <Text style={styles.saludo}>Hola, {usuario.nombre}! 👋</Text>}
            <Text style={styles.title}>Tendencias de Datos IoT</Text>

            {registros.length === 0 ? (
                <Text style={styles.info}>No hay datos disponibles para mostrar gráficos.</Text>
            ) : (
                <>
                    <Text style={styles.chartTitle}>Temperatura</Text>
                    <LineChart
                        data={{
                            labels: registros.map((_, index) => `Reg ${index + 1}`),
                            datasets: [{ data: limpiarDatos(registros, 'temp') }],
                        }}
                        width={Dimensions.get('window').width - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: '#F3FAF8',
                            backgroundGradientFrom: '#285D56',
                            backgroundGradientTo: '#55AC9B',
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: () => '#F3FAF8',
                            strokeWidth: 2,
                        }}
                        bezier
                        style={styles.chart}
                    />

                    <Text style={styles.chartTitle}>Nivel de Agua</Text>
                    <LineChart
                        data={{
                            labels: registros.map((_, index) => `Reg ${index + 1}`),
                            datasets: [{ data: limpiarDatos(registros, 'nivel_agua') }],
                        }}
                        width={Dimensions.get('window').width - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: '#F3FAF8',
                            backgroundGradientFrom: '#285D56',
                            backgroundGradientTo: '#55AC9B',
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: () => '#F3FAF8',
                            strokeWidth: 2,
                        }}
                        bezier
                        style={styles.chart}
                    />
                </>
            )}
            <Button title="Cerrar Sesión" onPress={cerrarSesion} color="#D9534F" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F3FAF8' },
    saludo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#285D56' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#285D56' },
    chartTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, textAlign: 'center', color: '#55AC9B' },
    chart: { marginVertical: 10, borderRadius: 10 },
    info: { textAlign: 'center', fontSize: 18, marginTop: 20, color: '#A4CAC5' },
});

export default UserChartsScreen;