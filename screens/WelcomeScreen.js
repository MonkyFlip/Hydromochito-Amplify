import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // ✅ Para íconos

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                {/* Logo de la aplicación */}
                <Image 
                    source={require('../assets/images/logo.png')} 
                    style={styles.logo} 
                />

                {/* Título */}
                <Text style={styles.title}>🌊 Bienvenido a Hydromochito</Text>

                {/* Descripción */}
                <Text style={styles.description}>Monitoreo inteligente de agua con IoT</Text>

                {/* Beneficios */}
                <View style={styles.featuresContainer}>
                    <View style={styles.feature}>
                        <Icon name="water-pump" size={30} color="#42A5F5" />
                        <Text style={styles.featureText}>Monitoreo en tiempo real</Text>
                    </View>
                    <View style={styles.feature}>
                        <Icon name="chart-line" size={30} color="#8D6E63" />
                        <Text style={styles.featureText}>Registros históricos</Text>
                    </View>
                    <View style={styles.feature}>
                        <Icon name="alert-circle" size={30} color="#F44336" />
                        <Text style={styles.featureText}>Alertas de niveles críticos</Text>
                    </View>
                </View>

                {/* Botón */}
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                    <Icon name="login" size={20} color="#FFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C2D3CF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: 30,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        width: '90%',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1E88E5',
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
    },
    featuresContainer: {
        marginBottom: 20,
        width: '100%',
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    featureText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#42A5F5',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 10,
    },
    buttonIcon: {
        marginRight: 8,
    },
});

export default WelcomeScreen;