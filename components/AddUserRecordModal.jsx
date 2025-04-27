import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createRegistroIot } from '../api/records';

const AddUserRecordModal = ({ visible, onClose, cargarRegistros }) => {
    const [flujoAgua, setFlujoAgua] = useState('');
    const [nivelAgua, setNivelAgua] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [energia, setEnergia] = useState('Electricidad');
    const [usuario, setUsuario] = useState(null);

    // Validar si un valor es numérico
    const isNumeric = (value) => {
        return /^\d+(\.\d+)?$/.test(value); // Acepta enteros o decimales positivos
    };

    // Cargar usuario desde AsyncStorage
    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const datosUsuario = await AsyncStorage.getItem('usuario');
                if (datosUsuario) {
                    setUsuario(JSON.parse(datosUsuario));
                    console.log('✅ Usuario cargado:', JSON.parse(datosUsuario));
                } else {
                    console.log('🚨 No se encontró usuario en AsyncStorage');
                }
            } catch (error) {
                console.error('🚨 Error al cargar usuario:', error);
            }
        };

        cargarUsuario();
    }, []);

    const handleAdd = async () => {
        console.log('📌 Se hizo clic en "Guardar"');

        if (!flujoAgua || !nivelAgua || !temperatura || !energia) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (!isNumeric(flujoAgua) || !isNumeric(nivelAgua) || !isNumeric(temperatura)) {
            Alert.alert('Error', 'Los valores deben contener solo números.');
            return;
        }

        if (!usuario || !usuario.id) {
            console.log('🚨 Usuario no está definido correctamente:', usuario);
            Alert.alert('Error', 'El usuario no está registrado correctamente.');
            return;
        }

        const nuevoRegistro = {
            flujo_agua: flujoAgua,
            nivel_agua: nivelAgua,
            temp: temperatura,
            energia,
            id_usuario: usuario.id,
        };

        console.log('📡 Datos que se enviarán:', JSON.stringify(nuevoRegistro, null, 2));

        try {
            const response = await createRegistroIot(nuevoRegistro);

            if (!response || response.error) {
                throw new Error(response.error || 'Error desconocido');
            }

            alert('Registro creado exitosamente.');
            await cargarRegistros(usuario.id, 1);
            onClose();
        } catch (error) {
            console.error('🚨 Error al crear registro:', error);
            Alert.alert('Error', 'Ocurrió un problema al guardar el registro.');
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Agregar Registro</Text>

                    {/* Flujo de Agua */}
                    <Text style={styles.label}>Flujo de Agua (litros):</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej. 10.5"
                        value={flujoAgua}
                        onChangeText={setFlujoAgua}
                        keyboardType="numeric"
                    />

                    {/* Nivel de Agua */}
                    <Text style={styles.label}>Nivel de Agua (litros):</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej. 50.2"
                        value={nivelAgua}
                        onChangeText={setNivelAgua}
                        keyboardType="numeric"
                    />

                    {/* Temperatura */}
                    <Text style={styles.label}>Temperatura (°C):</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej. 25.0"
                        value={temperatura}
                        onChangeText={setTemperatura}
                        keyboardType="numeric"
                    />

                    {/* Tipo de Energía */}
                    <Text style={styles.label}>Tipo de Energía:</Text>
                    <View style={styles.energySelection}>
                        <TouchableOpacity
                            style={[
                                styles.energyOption,
                                energia === 'Electricidad' && styles.energyOptionSelected,
                            ]}
                            onPress={() => setEnergia('Electricidad')}
                        >
                            <Text style={styles.energyText}>Electricidad</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.energyOption,
                                energia === 'Solar' && styles.energyOptionSelected,
                            ]}
                            onPress={() => setEnergia('Solar')}
                        >
                            <Text style={styles.energyText}>Solar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Botones */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAdd} style={[styles.button, styles.confirmButton]}>
                            <Text style={styles.confirmText}>Guardar</Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        width: '80%',
        backgroundColor: '#F3FAF8',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#285D56',
        marginBottom: 15,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#285D56',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#A4CAC5',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#E3F2FD',
    },
    energySelection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    energyOption: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#D7F0E9',
        borderRadius: 5,
        alignItems: 'center',
    },
    energyOptionSelected: {
        backgroundColor: '#2D7468',
    },
    energyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#285D56',
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
        backgroundColor: '#D7F0E9',
    },
    confirmButton: {
        backgroundColor: '#2D7468',
    },
    cancelText: {
        color: '#285D56',
        fontWeight: 'bold',
    },
    confirmText: {
        color: '#F3FAF8',
        fontWeight: 'bold',
    },
});

export default AddUserRecordModal;