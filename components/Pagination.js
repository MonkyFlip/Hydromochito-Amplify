import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
    return (
        <View style={styles.pagination}>
            <Button title="Anterior" onPress={onPrev} disabled={currentPage === 1} />
            <Text style={styles.text}>Página {currentPage} de {totalPages}</Text>
            <Button title="Siguiente" onPress={onNext} disabled={currentPage === totalPages} />
        </View>
    );
};

const styles = StyleSheet.create({
    pagination: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
    text: { fontSize: 16, fontWeight: 'bold' }
});

export default Pagination;
