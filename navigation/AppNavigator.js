import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import UserNavigator from './UserNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="Admin" component={AdminNavigator} />
                <Stack.Screen name="User" component={UserNavigator} />
            </Stack.Navigator>
    );
};

export default AppNavigator;
