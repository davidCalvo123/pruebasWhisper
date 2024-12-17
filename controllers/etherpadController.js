const api = require('etherpad-lite-client');
const config = require('../config');

const etherpad = api.connect({
    apikey: config.etherpad.apiKey,
    host: config.etherpad.server,
    port: config.etherpad.port,
    ssl: false,
    rejectUnauthorized: false
});

// Crear un pad si no existe
// Crear un pad si no existe
exports.createPadIfNotExists = (id, callback) => {
  etherpad.createPad({ padID: id }, (error, data) => {
      if (error) {
          if (error.message.includes('padID does already exist')) {
              console.warn(`El pad ${id} ya existe.`);
              return callback({ success: true, message: 'El pad ya existía.' });
          }
          console.error('Error creando el pad:', error);
          return callback({ success: false, message: 'No se pudo crear el pad. Inténtalo de nuevo más tarde.' });
      }
      console.log('Pad creado:', data);
      callback({ success: true, message: 'El pad se ha creado con éxito.' });
  });
};

// Verificar si el pad existe
exports.checkIfPadExists = (id, callback) => {
  etherpad.listAllPads((error, data) => {
      if (error) {
          console.error('Error listando los pads:', error);
          return callback({ success: false, error });
      }

      const padExists = data.padIDs.includes(id);
      if (padExists) {
          console.log(`El pad ${id} ya existe.`);
          callback({ success: true, message: 'El pad ya existe.' });
      } else {
          console.log(`El pad ${id} NO existe.`);
          callback({ success: false, message: 'El pad no existe.' });
      }
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