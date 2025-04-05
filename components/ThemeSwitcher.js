import React, { useState } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';

const ThemeSwitcher = ({ onToggle }) => {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        onToggle(!isDark);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{isDark ? 'Modo Oscuro' : 'Modo Claro'}</Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 },
    text: { fontSize: 16, fontWeight: 'bold', marginRight: 10 },
});

export default ThemeSwitcher;
