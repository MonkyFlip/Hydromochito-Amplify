import React from 'react';
import { Modal, View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';

const ConfirmModal = ({ visible, onClose, onConfirm, title, message }) => {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirmButton]}>
                            <Text style={styles.confirmText}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente
    },
    modal: {
        width: '80%',
        backgroundColor: '#F3FAF8', // Fondo del modal
        padding: 20,
        borderRadius: 10,
        elevation: 5, // Sombra para Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#285D56', // Verde oscuro para el título
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#55AC9B', // Verde intermedio para el mensaje
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#D7F0E9', // Botón cancelar
    },
    confirmButton: {
        backgroundColor: '#2D7468', // Botón eliminar
    },
    cancelText: {
        color: '#285D56', // Texto cancelar
        fontWeight: 'bold',
    },
    confirmText: {
        color: '#F3FAF8', // Texto eliminar
        fontWeight: 'bold',
    },
});

export default ConfirmModal;