export const formatFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
};

export const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const calcularPromedio = (datos) => {
    if (!datos || datos.length === 0) return 0;
    const suma = datos.reduce((total, num) => total + num, 0);
    return (suma / datos.length).toFixed(2);
};
