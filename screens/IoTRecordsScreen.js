import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRegistrosIot, deleteRegistroIot, updateRegistroIot, createRegistroIot } from '../api/records';
import ModalForm from '../components/ModalForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IoTRecordsScreen = ({ navigation }) => {
    const [registros, setRegistros] = useState([]);
    const [displayedRecords, setDisplayedRecords] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [values, setValues] = useState({}); // Almacenar valores actuales para el modal
    const [isAdding, setIsAdding] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    useEffect(() => {
        const verificarSesion = async () => {
            const datosUsuario = await AsyncStorage.getItem('usuario');
            if (datosUsuario) {
                cargarRegistros();
            } else {
                navigation.navigate('Auth');
            }
        };

        verificarSesion();
    }, [navigation]);

    const cargarRegistros = async () => {
        try {
            const response = await getRegistrosIot();
            setRegistros(response || []);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error al cargar registros:', error);
            Alert.alert('Error', 'No se pudieron cargar los registros.');
        }
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        setDisplayedRecords(registros.slice(startIndex, endIndex));
    }, [registros, currentPage]);

    const eliminarRegistro = async (idRegistro) => {
        try {
            await deleteRegistroIot(idRegistro);
            Alert.alert('Registro eliminado');
            cargarRegistros();
        } catch (error) {
            console.error('Error al eliminar registro:', error);
            Alert.alert('Error', 'No se pudo eliminar el registro.');
        }
    };

    const handleEditRecord = (record) => {
        console.log('Registro seleccionado para editar:', record); // Log para depuración
        setValues({
            flujo_agua: record.flujo_agua || '', // Asegúrate de asignar un valor por defecto
            nivel_agua: record.nivel_agua || '',
            temp: record.temp || '',
            energia: record.energia || '',
        });
        setModalVisible(true);
    };

    const handleAddRecord = () => {
        setValues({ flujo_agua: '', nivel_agua: '', temp: '', energia: '' }); // Inicializar valores
        setIsAdding(true); // Cambiar a modo agregar
        setModalVisible(true); // Mostrar el modal
    };

    const actualizarRegistro = async (data) => {
        try {
            await updateRegistroIot(data.id_registro, data); // Enviar los datos actualizados al backend
            Alert.alert('Registro actualizado exitosamente');
            cargarRegistros();
        } catch (error) {
            console.error('Error al actualizar el registro:', error);
            Alert.alert('Error', 'No se pudo actualizar el registro.');
        }
    };

    const crearRegistro = async (data) => {
        try {
            await createRegistroIot(data); // Crear el nuevo registro en el backend
            Alert.alert('Registro creado exitosamente');
            cargarRegistros();
        } catch (error) {
            console.error('Error al crear el registro:', error);
            Alert.alert('Error', 'No se pudo crear el registro.');
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(registros.length / recordsPerPage)) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registros de Hydromochito</Text>

            <TouchableOpacity style={styles.addButton} onPress={handleAddRecord}>
                <Icon name="plus" size={24} color="#E3F2FD" />
                <Text style={styles.addButtonText}>Agregar Registro</Text>
            </TouchableOpacity>

            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Flujo de Agua</Text>
                <Text style={styles.headerCell}>Nivel de Agua</Text>
                <Text style={styles.headerCell}>Temperatura</Text>
                <Text style={styles.headerCell}>Energía</Text>
                <Text style={styles.headerCell}>ID Usuario</Text>
                <Text style={styles.headerCell}>Acciones</Text>
            </View>

            <FlatList
                data={displayedRecords}
                keyExtractor={(item) => item.id_registro.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.flujo_agua}</Text>
                        <Text style={styles.cell}>{item.nivel_agua}</Text>
                        <Text style={styles.cell}>{item.temp}°C</Text>
                        <Text style={styles.cell}>{item.energia}</Text>
                        <Text style={styles.cell}>{item.id_usuario}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => handleEditRecord(item)} style={styles.iconButton}>
                                <Icon name="pencil" size={24} color="#1976D2" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    Alert.alert(
                                        'Confirmación',
                                        '¿Estás seguro de que deseas eliminar este registro?',
                                        [
                                            { text: 'Cancelar', style: 'cancel' },
                                            { text: 'Eliminar', onPress: () => eliminarRegistro(item.id_registro) },
                                        ]
                                    )
                                }
                                style={styles.iconButton}
                            >
                                <Icon name="trash-can" size={24} color="#D32F2F" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.info}>No hay registros disponibles.</Text>}
            />

            <View style={styles.pagination}>
                <TouchableOpacity
                    onPress={handlePreviousPage}
                    disabled={currentPage === 1}
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                >
                    <Text style={styles.pageButtonText}>← Anterior</Text>
                </TouchableOpacity>
                <Text style={styles.pageIndicator}>Página {currentPage}</Text>
                <TouchableOpacity
                    onPress={handleNextPage}
                    disabled={currentPage >= Math.ceil(registros.length / recordsPerPage)}
                    style={[
                        styles.pageButton,
                        currentPage >= Math.ceil(registros.length / recordsPerPage) && styles.disabledButton,
                    ]}
                >
                    <Text style={styles.pageButtonText}>Siguiente →</Text>
                </TouchableOpacity>
            </View>

            <ModalForm
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={(data) => {
                    if (isAdding) {
                        crearRegistro(data);
                    } else {
                        actualizarRegistro(data);
                    }
                    setModalVisible(false);
                }}
                title={isAdding ? 'Agregar Registro' : 'Editar Registro'}
                fields={[
                    { name: 'flujo_agua', placeholder: 'Flujo de Agua' },
                    { name: 'nivel_agua', placeholder: 'Nivel de Agua' },
                    { name: 'temp', placeholder: 'Temperatura' },
                    { name: 'energia', placeholder: 'Energía' },
                ]}
                values={values} // Este objeto debe contener las claves correctas
                setValues={(newValues) => {
                    console.log('Actualizando valores:', newValues); // Verifica que se actualicen
                    setValues(newValues);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#E3F2FD",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#0D47A1",
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1976D2",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    addButtonText: {
        color: "#E3F2FD",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#1976D2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
        color: "#E3F2FD",
    },
    row: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#BBDEFB",
        alignItems: "center",
        backgroundColor: "#E1F5FE",
        borderRadius: 6,
        marginBottom: 5,
    },
    cell: {
        flex: 1,
        textAlign: "center",
        color: "#0D47A1",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    iconButton: {
        alignItems: "center",
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    pageButton: {
        backgroundColor: "#1976D2",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    pageButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "#E3F2FD",
    },
    disabledButton: {
        backgroundColor: "#BBDEFB",
    },
    pageIndicator: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0D47A1",
    },
    info: {
        fontSize: 16,
        textAlign: "center",
        color: "#0D47A1",
        marginTop: 20,
    },
});

export default IoTRecordsScreen;