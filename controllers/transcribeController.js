const transcribeModel = require('../models/transcribeModel');

exports.showForm = (req, res) => {
    res.render('index', { transcription: null });
};

exports.transcribe = (req, res) => {
    const { audioPath, targetData } = req.body;

    if (!audioPath || !targetData) {
        return res.status(400).json({ error: 'Faltan parámetros audioPath o targetData' });
    }

    transcribeModel.transcribeAudio(audioPath, JSON.parse(targetData))
        .then((result) => {
            res.render('index', { transcription: result.transcription });
        })
        .catch((error) => {
            res.status(500).json({ error: `Error en la transcripción: ${error}` });
        });
};