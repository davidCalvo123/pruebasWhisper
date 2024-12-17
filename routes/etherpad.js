const express = require('express');
const router = express.Router();
const etherpadManager = require('../controllers/etherpadController');

// Muestra la vista principal de Etherpad
router.get('/', (req, res) => {
    res.render('etherpad');
});

// Ruta para crear un pad
router.post('/create', (req, res) => {
    const { padID } = req.body;
    etherpadManager.createPadIfNotExists(padID, (response) => {
        res.json({ message: 'Pad creado con éxito', response });
    });
});

//ruta para verificar si un pad existe
router.get('/check/:padID', (req, res) => {
    const padID = req.params.padID;
    etherpadManager.checkIfPadExists(padID, (result) => { // Usar etherpadManager en lugar de etherpadController
        res.json(result);
    });
});

// Ruta para eliminar un pad
router.post('/delete/:padID', (req, res) => {
    const { padID } = req.params;
    etherpadManager.deletePad(padID, (response) => {
        res.json({ message: `Pad con ID ${padID} eliminado`, response });
    });
});

module.exports = router;