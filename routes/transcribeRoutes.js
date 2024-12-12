const express = require('express');
const router = express.Router();
const transcribeController = require('../controllers/transcribeController');

// Ruta para mostrar la página principal
router.get('/', transcribeController.showForm);

// Ruta para procesar la transcripción
router.post('/transcribe', transcribeController.transcribe);

module.exports = router;
