# 📝 Proyecto de Pruebas: Whisper + Etherpad

Este proyecto está diseñado como entorno de pruebas para integrar **transcripción automática con Whisper** y **edición colaborativa con Etherpad** en un backend Node.js. Incluye scripts para gestionar la transcripción de audios con anotaciones temporales y una instancia de Etherpad embebida para edición colaborativa básica.

## 🚀 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión recomendada: ≥14)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/) (con base de datos creada)
- [Python](https://www.python.org/) (≥3.8)
- [Git](https://git-scm.com/)
- [FFmpeg](https://ffmpeg.org/download.html)
- [Whisper (openai-whisper)](https://github.com/openai/whisper)


- `pip install openai-whisper` (o tu entorno con Whisper instalado)
- Sistema Unix (Linux/macOS) o WSL en Windows (para ejecutar `bin/run.sh` de Etherpad)

## 📁 Estructura del proyecto
```bash
PRUEBASWHISPER/
├── controllers/
│   ├── etherpadController.js
│   └── transcribeController.js
├── etherpad-lite/               ← Carpeta clonada de Etherpad TENGO QUE COMPROBAR QUE PASA CON LOS PLUGINGS
├── public/
│   └── etherpad.css
│   └── index.css
├── routes/
│   ├── etherpad.js
│   └── transcribeRoutes.js
├── views/
│   ├── etherpad.ejs
│   └── index.ejs
├── Transcripciones/            ← Carpeta donde se guardan las transcripciones
├── pruebasWhisper.py           ← Script de transcripción
├── app.js                      ← Archivo principal del servidor
├── config.js                   ← Configuración Etherpad
├── package.json
├── package-lock.json
└── nodemon.json
```
---

## 🛠️ Instalación y configuración

### 1. Clona el proyecto

```bash
git clone https://github.com/tu-usuario/proyecto-pruebas.git
cd proyecto-pruebas
```

### 2. Instala las dependencias
```bash
npm install
```
### 3. Instala Whisper en Python
```bash
pip install git+https://github.com/openai/whisper.git
```
Asegúrate de tener también ffmpeg instalado para procesar los audios.

### 4. Configura la base de datos de Etherpad
Primero, accede a MySQL y crea la base de datos con las credenciales que usarás en settings.json:(Tengo quemirar esto)
```bash
CREATE DATABASE (Nombre_de_la_BD DEFAULT) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'etherpad_user'@'localhost' IDENTIFIED BY 'Etherpad!2024';
GRANT ALL PRIVILEGES ON etherpad_db.* TO 'etherpad_user'@'localhost';
FLUSH PRIVILEGES;
```
### 5. 📝 Configuración de Etherpad
Modifica la sección correspondiente:
```bash
"dbType" : "mysql",
"dbSettings" : {
  "user"    : "etherpad_user",
  "host"    : "localhost",
  "password": "xxx",
  "database": "xx",
  "charset" : "utf8mb4"}
"authenticationMethod": "apikey"
```
### 6. Añade el archivo APIKEY.txt

Coloca un archivo llamado APIKEY.txt dentro de etherpad-lite/ con la clave correspondiente, por ejemplo:
```bash
ef4f7a8e7898cecaa0038e03faf63e9f8422a51e799919fb7036046ef1d5fb90
```
### 7. 🧠 Configuración del servidor

En config.js:
```bash
module.exports = {
  etherpad: {
    enabled: true,
    server: 'localhost',
    port: 9001,
    apiKey: 'TU_API_KEY'}};
```
### 8. 🚀 Ejecución del entorno

Puedes lanzar el entorno completo (servidor Node + Etherpad) con:
```bash
npm run dev
```
Esto ejecutará de forma concurrente:
- El servidor principal (app.js)
- Etherpad (etherpad-lite/bin/run.sh)
