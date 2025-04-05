import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminScreen from '../screens/AdminScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import IoTRecordsScreen from '../screens/IoTRecordsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const cerrarSesion = async (navigation) => {
    await AsyncStorage.removeItem('usuario'); // ✅ Borra datos de sesión
    navigation.navigate('Auth'); // ✅ Redirige al login
};

const AdminNavigator = ({ navigation }) => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerRight: () => (
                    <Button title="Cerrar sesión" onPress={() => cerrarSesion(navigation)} color="red" />
                ),
                tabBarStyle: { backgroundColor: '#007AFF' }, // ✅ Color de fondo más limpio
                tabBarActiveTintColor: '#fff', // ✅ Color cuando está activo
                tabBarInactiveTintColor: '#ccc', // ✅ Color cuando está inactivo
            }}
        >
            <Tab.Screen
                name="Panel Admin"
                component={AdminScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account-cog" color={color} size={size} /> // ✅ Icono de configuración
                    ),
                }}
            />
            <Tab.Screen
                name="Usuarios"
                component={UserManagementScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account-group" color={color} size={size} /> // ✅ Icono de gestión de usuarios
                    ),
                }}
            />
            <Tab.Screen
                name="Registros Hydromochito"
                component={IoTRecordsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="database" color={color} size={size} /> // ✅ Icono de registros de base de datos
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default AdminNavigator;
