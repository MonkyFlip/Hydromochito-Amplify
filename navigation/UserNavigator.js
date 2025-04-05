import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserScreen from '../screens/UserScreen';
import UserRecordsScreen from '../screens/UserRecordsScreen';
import UserChartsScreen from '../screens/UserChartsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const cerrarSesion = async (navigation) => {
    await AsyncStorage.removeItem('usuario');
    navigation.navigate('Auth');
};

const UserNavigator = ({ navigation }) => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#F3FAF8' }, // Fondo suave de la paleta
                headerTintColor: '#285D56', // Texto destacado de la cabecera
                headerRight: () => (
                    <Button 
                        title="Cerrar sesión" 
                        onPress={() => cerrarSesion(navigation)} 
                        color="#55AC9B" // Botón con color de la paleta
                    />
                ),
                tabBarStyle: { backgroundColor: '#F3FAF8' }, // Fondo de la barra de navegación
                tabBarActiveTintColor: '#285D56', // Color activo en las pestañas
                tabBarInactiveTintColor: '#A4CAC5', // Color inactivo en las pestañas
            }}
        >
            <Tab.Screen 
                name="Perfil" 
                component={UserScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account" color={color} size={size} />
                    )
                }} 
            />
            <Tab.Screen 
                name="Registros" 
                component={UserRecordsScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="database" color={color} size={size} />
                    )
                }} 
            />
            <Tab.Screen 
                name="Gráficos Hydromochito" 
                component={UserChartsScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="chart-line" color={color} size={size} />
                    )
                }} 
            />
        </Tab.Navigator>
    );
};

export default UserNavigator;