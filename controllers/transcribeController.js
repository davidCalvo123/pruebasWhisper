const transcribeModel = require('../models/transcribeModel');
const etherpadManager = require('../controllers/etherpadController');

exports.showForm = (req, res) => {
    res.render('index', { transcription: null, padID: null }); 
};

exports.transcribe = (req, res) => {
    const { audioPath, targetData } = req.body;

    if (!audioPath || !targetData) {
        return res.status(400).json({ error: 'Faltan parámetros audioPath o targetData' });
    }

    transcribeModel.transcribeAudio(audioPath, JSON.parse(targetData))
        .then((result) => {
            const transcription = result.transcription;

            // Generar un ID único basado en la fecha y hora
            const padID = `transcripcion_${new Date().toISOString().replace(/[:.-]/g, '')}`;

            // Crear un pad con el texto transcrito
            etherpadManager.createPadWithText(padID, transcription, (response) => {
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