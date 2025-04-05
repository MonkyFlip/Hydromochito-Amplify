import React from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ModalForm = ({ visible, onClose, onSubmit, title, fields, setValues, values }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>

                    {fields.map((field) => (
                        <TextInput
                            key={field.name}
                            style={styles.input}
                            placeholder={field.placeholder}
                            value={values[field.name]}
                            onChangeText={(text) => setValues({ ...values, [field.name]: text })}
                        />
                    ))}

                    <Button title="Guardar" onPress={onSubmit} />
                    <Button title="Cerrar" onPress={onClose} color="red" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modal: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});

export default ModalForm;
