const api = require('etherpad-lite-client');
const config = require('../config');

const etherpad = api.connect({
    apikey: config.etherpad.apiKey,
    host: config.etherpad.server,
    port: config.etherpad.port,
    ssl: true,
    rejectUnauthorized: false
});

// Crear un pad si no existe
exports.createPadIfNotExists = (id, callback) => {
    etherpad.createPad({ padID: id }, (error, data) => {
        if (error) {
            console.error('Error creando el pad:', error);
            return callback({ success: false, error });
        }
        console.log('Pad creado:', data);
        callback({ success: true, data });
    });
};

// Eliminar un pad
exports.deletePad = (id, callback) => {
    etherpad.deletePad({ padID: id }, (error, data) => {
        if (error) {
            console.error('Error eliminando el pad:', error);
            return callback({ success: false, error });
        }
        console.log('Pad eliminado:', data);
        callback({ success: true, data });
    });
};