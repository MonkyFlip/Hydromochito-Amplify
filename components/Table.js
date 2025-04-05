import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const Table = ({ columns, data }) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.table}>
                <View style={styles.row}>
                    {columns.map((col) => (
                        <Text key={col} style={styles.header}>{col}</Text>
                    ))}
                </View>

                {data.map((item, index) => (
                    <View key={index} style={styles.row}>
                        {columns.map((col) => (
                            <Text key={col} style={styles.cell}>{item[col]}</Text>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10 },
    table: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10 },
    row: { flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    header: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
    cell: { flex: 1, textAlign: 'center' },
});

export default Table;
