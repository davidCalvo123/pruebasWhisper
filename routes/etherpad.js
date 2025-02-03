const express = require('express');
const router = express.Router();
const etherpadManager = require('../controllers/etherpadController');

// Muestra la vista principal de Etherpad
router.get('/', (req, res) => {
    res.render('etherpad', { padID: null });
});

// Ruta para crear un pad
router.post('/create', (req, res) => {
    const { padID } = req.body;

    etherpadManager.createPadIfNotExists(padID, (response) => {
        res.json(response); 
    });
});


 //router.post('/createWithContent', (req, res) => {
//     const { padID, content } = req.body;

//     if (!padID || !content) {
//         return res.status(400).json({ success: false, message: 'Se requiere un padID y un contenido' });
//     }

//     etherpadManager.createPadWithContent(padID, content, (response) => {
//         res.json(response);
//     });
// });




// Ruta para crear un pad con texto
router.post('/createWithText', (req, res) => {
    const { padID, text } = req.body;

    etherpadManager.createPadWithText(padID, text, (response) => {
        res.json(response); 
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

// Ruta para eliminar todos los pads
router.post('/deleteAll', (req, res) => {
    etherpadManager.deleteAllPads((response) => {
        res.json(response);
    });
});

//PALABRAS CLAVE START
router.post('/evaluate/:padID', (req, res) => {
    const padID = req.params.padID;
    const { criteria } = req.body;

    etherpadManager.evaluateTranscription(criteria,padID, (result) => {
        res.json(result);
    });
});


module.exports = router;