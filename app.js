const express = require('express');
const path = require('path');
const app = express(); 
const port = 3000;

//todo lo que tengo aqui ya esta en smarterp


// Middleware para manejar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la carpeta de vistas (EJS)
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 

app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const transcribeRoutes = require('./routes/transcribeRoutes');
const etherpadRoutes = require('./routes/etherpad');

// Usar las rutas
app.use('/', transcribeRoutes);
app.use('/etherpad', etherpadRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});