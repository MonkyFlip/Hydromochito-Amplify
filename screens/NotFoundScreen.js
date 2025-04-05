import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotFoundScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Error 404</Text>
            <Text style={styles.description}>La página que buscas no existe.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: 'red', marginBottom: 10 },
    description: { fontSize: 16, color: '#666' },
});

export default NotFoundScreen;
