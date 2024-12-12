const { spawn } = require("child_process");

exports.transcribeAudio = (audioPath, targetData) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python3", ["pruebasWhisper.py"]);

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