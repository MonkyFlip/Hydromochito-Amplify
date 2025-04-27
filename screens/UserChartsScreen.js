import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { LineChart } from 'react-native-chart-kit';

const UserChartsScreen = ({ navigation }) => {
    const [registros, setRegistros] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Actualización manual al deslizar hacia abajo
    const onRefresh = async () => {
        setRefreshing(true);
        if (usuario) {
            await cargarRegistros(usuario.id);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                const usuarioData = JSON.parse(datosUsuario);
                setUsuario(usuarioData);
                cargarRegistros(usuarioData.id);
            } else {
                navigation.navigate('Auth');
            }
        };

        verificarSesion();
    }, [navigation]);

    // Obtener registros del usuario
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

    return (
        <View style={styles.container}>
            {/* 1️⃣ Título Principal - Estático */}
            <Text style={styles.title}>Datos Graficados</Text>

            {registros.length === 0 ? (
                <Text style={styles.info}>No hay datos disponibles para mostrar gráficos.</Text>
            ) : (
                <>
                    {/* 2️⃣ Título del Gráfico de Temperatura - Estático */}
                    <Text style={styles.chartTitle}>Temperatura</Text>

                    {/* 3️⃣ Gráfico de Temperatura - Scroll Independiente */}
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={styles.scrollView}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        <View style={styles.chartContainer}>
                            <LineChart
                                data={{
                                    labels: registros.map((_, index) => `R${index + 1}`),
                                    datasets: [{ data: limpiarDatos(registros, 'temp') }],
                                }}
                                width={Dimensions.get('window').width * 1.6} // ✅ Aumenta el ancho del gráfico
                                height={200} // ✅ Aumenta la altura para evitar cortes
                                chartConfig={{
                                    backgroundColor: '#F3FAF8',
                                    backgroundGradientFrom: '#285D56',
                                    backgroundGradientTo: '#55AC9B',
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: () => '#F3FAF8',
                                    strokeWidth: 3,
                                    barPercentage: 0.7,
                                    propsForDots: {
                                        r: '6', // ✅ Aumenta el tamaño de los puntos
                                        strokeWidth: '2',
                                        stroke: '#F3FAF8',
                                    },
                                }}
                                bezier
                                style={styles.chart}
                            />
                        </View>
                    </ScrollView>

                    {/* 4️⃣ Título del Gráfico de Nivel de Agua - Estático */}
                    <Text style={styles.chartTitle}>Nivel de Agua</Text>

                    {/* 5️⃣ Gráfico de Nivel de Agua - Scroll Independiente */}
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={styles.scrollView}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        <View style={styles.chartContainer}>
                            <LineChart
                                data={{
                                    labels: registros.map((_, index) => `R${index + 1}`),
                                    datasets: [{ data: limpiarDatos(registros, 'nivel_agua') }],
                                }}
                                width={Dimensions.get('window').width * 1.6} // ✅ Aumenta el ancho del gráfico
                                height={200} // ✅ Aumenta la altura para evitar cortes
                                chartConfig={{
                                    backgroundColor: '#F3FAF8',
                                    backgroundGradientFrom: '#285D56',
                                    backgroundGradientTo: '#55AC9B',
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: () => '#F3FAF8',
                                    strokeWidth: 3,
                                    barPercentage: 0.7,
                                    propsForDots: {
                                        r: '6', // ✅ Aumenta el tamaño de los puntos
                                        strokeWidth: '2',
                                        stroke: '#F3FAF8',
                                    },
                                }}
                                bezier
                                style={styles.chart}
                            />
                        </View>
                    </ScrollView>
                </>
            )}
        </View>
    );
};

// 🎨 Estilos mejorados
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F3FAF8' },
    title: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        color: '#285D56', 
        marginBottom: 20, 
    },
    chartTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginTop: 30, // ✅ Mayor separación entre gráficos
        textAlign: 'center', 
        color: '#55AC9B', 
    },
    scrollView: { paddingVertical: 15 }, // ✅ Más espacio entre gráficos
    chartContainer: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    chart: { 
        marginVertical: 15, // ✅ Aumenta el margen para evitar cortes
        borderRadius: 15, 
        padding: 10, 
        shadowColor: '#000', 
        shadowOpacity: 0.2, 
        shadowRadius: 5 
    },
    info: { textAlign: 'center', fontSize: 18, marginTop: 80, color: '#A4CAC5' },
});

export default UserChartsScreen;