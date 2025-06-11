
const etherpadManager = require('../controllers/etherpadController');
const { spawn } = require("child_process");
//Carga la página 1 de mi archivo
exports.showForm = (req, res) => {
    res.render('index', { transcription: null, padID: null }); 
};


//controler al que se le llama cuando se pulsa el boton de transcribir
//llama a transcribeaudio mandando url y levels
//Recibe el texto trascrito de whisper y opera con él (crea un etherpad y mas cosas)
exports.transcribe = (req, res) => {
    const { audioPath, targetData } = req.body;

    if (!audioPath || !targetData) {
        return res.status(400).json({ error: 'Faltan parámetros audioPath o targetData' });
    }

    transcribeAudio(audioPath, JSON.parse(targetData))
        .then((result) => {
            const transcription = result.transcription;

            // Generar un ID único basado en la fecha y hora
            const padID = `transcripcion_${new Date().toISOString().replace(/[:.-]/g, '')}`;

            // Crear un pad con el texto transcrito
            etherpadManager.createLocalPadWithText(padID, transcription, (response) => {
                if (response.success) {
                    res.render('index', { transcription, padID }); // Enviamos solo el ID del pad
                } else {
                    res.render('index', { transcription, padID: null });
                }
            });

        })
        .catch((error) => {
            res.status(500).json({ error: `Error en la transcripción: ${error}` });
        });
};

//Recibe el path del audio y target data
//ejecuta el script de python para transcribir con las marcas temporales
//devuelve una promesa que se integra en la parte de codigo donde se le habia llamado 
function transcribeAudio(audioPath, targetData) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("/usr/bin/python3", ["pruebasWhisper.py"]);

        const input = JSON.stringify({
            audio_path: audioPath,
            target_data: targetData
        });

        let output = "";
        let error = "";

        pythonProcess.stdin.write(input);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            error += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                try {
                    resolve(JSON.parse(output));
                } catch (err) {
                    reject(`Error al parsear la salida: ${err.message}`);
                }
            } else {
                reject(`Error en el proceso de Python: ${error}`);
            }
        });
    });
};