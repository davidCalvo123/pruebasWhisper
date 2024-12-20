const api = require('etherpad-lite-client');
const config = require('../config');

const etherpad = api.connect({
    apikey: config.etherpad.apiKey,
    host: config.etherpad.server,
    port: config.etherpad.port,
    ssl: false,
    rejectUnauthorized: false
});
// La función para aplicar los estilos de color con <span style="color:...">
function formatTextWithColors(inputText) {
  const regex = /(\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
  const formattedText = inputText.replace(regex, (match) => {
      if (match.startsWith('***')) {
          const content = match.slice(3, -3).trim(); // Quita los asteriscos y trim()
          return `<span class="color:red;">${content}</span>`;
      } else if (match.startsWith('**')) {
          const content = match.slice(2, -2).trim(); // Quita los asteriscos y trim()
          return `<span class="color:orange;">${content}</span>`;
      } else if (match.startsWith('*')) {
          const content = match.slice(1, -1).trim(); // Quita los asteriscos y trim()
          return `<span class="color:green;">${content}</span>`;
      }
      return match;
  });

  // Quitar saltos de línea no necesarios y envolver en <p> para Etherpad
  const cleanedText = formattedText.replace(/\n/g, '').replace(/\s\s+/g, ' ').trim();
  return `<p>${cleanedText}</p>`;
}

// La función que crea el pad con texto
exports.createPadWithText = (padID, text, callback) => {
  const formattedText = formatTextWithColors(text); // Aquí formateamos el texto antes de insertarlo
  etherpad.createPad({ padID }, (error, data) => {
      if (error) {
          console.error('Error al crear el pad:', error);
          return callback({ success: false, message: 'No se pudo crear el pad.' });
      }
      console.log(formattedText);
      etherpad.setHTML({ padID, html: formattedText }, (error) => {
          if (error) {
              console.error('Error al insertar texto en el pad:', error);
              return callback({ success: false, message: 'No se pudo insertar el texto.' });
          }
          callback({ success: true, message: 'El pad se ha creado con el texto correctamente.' });
      });
  });
};
exports.createPadWithContent = (padID, content, callback) => {
  console.log(`🟢 Iniciando la creación del pad con ID: ${padID}`);

  etherpad.createPad({ padID: padID }, (error, data) => {
      if (error) {
          console.error('❌ Error creando el pad:', error);
          if (error.message.includes('padID does already exist')) {
              console.warn(`⚠️ El pad ${padID} ya existe.`);
          }
          return callback({ success: false, message: 'No se pudo crear el pad. Inténtalo de nuevo más tarde.' });
      }

      console.log(`✅ Pad creado o ya existente: ${padID}`);
      
      // Aquí empieza la parte de establecer el contenido
      etherpad.setHTML({ padID: padID, html: content }, (error, data) => {
          if (error) {
              console.error('❌ Error al establecer el contenido del pad:', error);
              return callback({ success: false, message: 'No se pudo establecer el contenido del pad.' });
          }
          console.log('✅ Contenido HTML establecido:', data);
          callback({ success: true, message: 'El pad se ha creado con el contenido especificado.' });
      });
  });
};
// Crear un pad si no existe
exports.createPadIfNotExists = (id, callback) => {
  etherpad.createPad({ padID: id }, (error, data) => {
      if (error) {
          if (error.message.includes('padID does already exist')) {
              console.warn(`El pad ${id} ya existe.`);
              return callback({ success: true, message: 'El pad ya existe.' }); // ⚠️ Cambiado a success: false
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

// Eliminar todos los pads
exports.deleteAllPads = (callback) => {
  etherpad.listAllPads((error, data) => {
      if (error) {
          console.error('Error al listar los pads:', error);
          return callback({ success: false, message: 'No se pudieron listar los pads.' });
      }

      const padIDs = data.padIDs;

      if (padIDs.length === 0) {
          return callback({ success: true, message: 'No hay pads para eliminar.' });
      }

      let padsDeleted = 0;
      padIDs.forEach((padID) => {
          etherpad.deletePad({ padID }, (error, data) => {
              if (error) {
                  console.error(`Error eliminando el pad ${padID}:`, error);
              } else {
                  console.log(`Pad eliminado: ${padID}`);
              }

              padsDeleted++;

              // Cuando se hayan eliminado todos, devolvemos la respuesta
              if (padsDeleted === padIDs.length) {
                  callback({ success: true, message: 'Todos los pads se han eliminado con éxito.' });
              }
          });
      });
  });
};

//PALABRAS CLAVE START
exports.evaluateTranscription = (criteria, padID, callback) => {
  etherpad.getHTML({ padID: padID }, (error, data) => {
      if (error) {
          console.error('❌ Error obteniendo la transcripción:', error);
          return callback({ success: false, message: 'No se pudo obtener la transcripción.' });
      }

      const htmlContent = data.html;
      let totalScore = 0;
      let highlightedText = htmlContent;

      // 🟢 Buscar las palabras clave
      criteria.forEach(({ word, count, score }) => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          const matches = htmlContent.match(regex) || [];
          const occurrences = matches.length;

          // 🟢 Resaltar la palabra en azul
          highlightedText = highlightedText.replace(regex, `<span style="background-color: lightblue;">${word}</span>`);

          // 🟢 Calcular la puntuación proporcional
          const fraction = Math.min(occurrences / count, 1); // No puede superar 1 (es decir, no puede tener más del 100%)
          const partialScore = fraction * score; // Calcula la puntuación proporcional
          totalScore += partialScore;
      });

      // 🟢 Devolver el texto con las palabras resaltadas y la puntuación total
      callback({
          success: true,
          highlightedText,
          score: totalScore.toFixed(2) // Redondear a 2 decimales
      });
  });
};