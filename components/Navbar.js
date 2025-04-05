import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Navbar = ({ navigation }) => {
    return (
        <View style={styles.navbar}>
            <Text style={styles.logo}>🌊 Hydromochito</Text>
            <Button title="Admin" onPress={() => navigation.navigate('Admin')} />
            <Button title="Usuario" onPress={() => navigation.navigate('User')} />
            <Button title="Cerrar Sesión" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#007bff' },
    logo: { fontSize: 20, fontWeight: 'bold', color: 'white' }
});

export default Navbar;
