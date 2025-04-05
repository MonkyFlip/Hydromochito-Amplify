import { colors } from './colors';
import { fonts } from './fonts';
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.registrosIoT.fondo,
  },
  title: {
    fontSize: fonts.sizes.title,
    fontWeight: 'bold',
    color: colors.login.texto,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.perfilUsuario.borde,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: fonts.sizes.medium,
    fontWeight: 'bold',
    color: '#fff',
  },
});
