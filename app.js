// const { spawn } = require("child_process");

// function transcribeAudio(audioPath, targetData) {
//     return new Promise((resolve, reject) => {
//         const pythonProcess = spawn("python3", ["pruebasWhisper.py"]);

//         const input = JSON.stringify({
//             audio_path: audioPath,
//             target_data: targetData,
//         });
//         let output = "";
//         let error = "";

//         pythonProcess.stdin.write(input);
//         pythonProcess.stdin.end();

//         pythonProcess.stdout.on("data", (data) => {
//             output += data.toString();
//         });

//         pythonProcess.stderr.on("data", (data) => {
//             error += data.toString();
//         });

//         pythonProcess.on("close", (code) => {
//             if (code === 0) {
//                 try {
//                     resolve(JSON.parse(output));
//                 } catch (err) {
//                     reject(`Error al parsear la salida: ${err.message}`);
//                 }
//             } else {
//                 reject(`Error en el proceso de Python: ${error}`);
//             }
//         });
//     });
// }

// // Ejemplo de uso
// const audioPath = "/Users/davidcalvomunoz/Desktop/ex.m4a";
// // const targetData = [
//     { time: 15, level: 2 },
//      { time: 7, level: 3 },

//  ];

// transcribeAudio(audioPath, targetData)
//     .then((result) => {
//         console.log("Transcripción recibida:", result.transcription);
//         console.log("Archivo guardado en:", result.file);
//     })
//     .catch((err) => {
//         console.error("Error:", err);
//     });
const express = require('express'); 
const path = require('path');
const app = express(); 
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la carpeta de vistas (EJS)
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const transcribeRoutes = require('./routes/transcribeRoutes');
app.use('/', transcribeRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});