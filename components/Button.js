import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, color = '#007bff', size = 'medium' }) => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: color }, styles[size]]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
    small: { paddingVertical: 6, paddingHorizontal: 12 },
    medium: { paddingVertical: 10, paddingHorizontal: 20 },
    large: { paddingVertical: 14, paddingHorizontal: 30 },
});

export default Button;
