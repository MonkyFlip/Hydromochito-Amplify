import React from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ModalForm = ({ visible, onClose, onSubmit, title, fields = [], setValues = () => {}, values = {} }) => {
    console.log('Valores recibidos en ModalForm:', values); // Verificar valores
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>

                    {fields.map((field) => (
                        <View key={field.name} style={styles.fieldContainer}>
                            <Text style={styles.label}>{field.placeholder}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={field.placeholder}
                                value={values[field.name] || ''} // Precargar valor o vacío
                                onChangeText={(text) => setValues({ ...values, [field.name]: text })}
                            />
                        </View>
                    ))}

                    <View style={styles.buttonContainer}>
                        <Button title="Guardar" onPress={() => onSubmit(values)} color="#3E5C76" />
                        <Button title="Cerrar" onPress={onClose} color="#8D6E63" />
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
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        backgroundColor: '#F5F5DC', // Beige-brown background for a warm tone
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, // For Android shadow
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#3E5C76', // Deep blue for contrast
    },
    fieldContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#3E5C76', // Deep blue
    },
    input: {
        borderWidth: 1,
        borderColor: '#8D6E63', // Earthy brown
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#E3F2FD', // Soft blue shade for input fields
        color: '#3E5C76',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default ModalForm;