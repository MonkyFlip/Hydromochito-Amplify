import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const Loader = ({ message = 'Cargando...' }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
});

export default Loader;
