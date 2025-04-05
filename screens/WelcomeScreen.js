import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌊 Bienvenido a Hydromochito</Text>
            <Text style={styles.description}>Monitoreo inteligente de agua con IoT</Text>
            <Button title="Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    description: { fontSize: 16, color: '#666', marginBottom: 20 },
});

export default WelcomeScreen;
