import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ title, description }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { padding: 15, borderRadius: 10, backgroundColor: '#f8f9fa', marginBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold' },
    description: { fontSize: 14, color: '#666' },
});

export default Card;
