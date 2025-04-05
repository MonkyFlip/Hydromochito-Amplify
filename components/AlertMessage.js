import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlertMessage = ({ message, type = 'success' }) => {
    return (
        <View style={[styles.container, styles[type]]}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10, borderRadius: 5, marginBottom: 10 },
    text: { fontWeight: 'bold', textAlign: 'center' },
    success: { backgroundColor: '#28a745', color: '#fff' },
    error: { backgroundColor: '#dc3545', color: '#fff' },
});

export default AlertMessage;
