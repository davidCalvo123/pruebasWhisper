# 📝 Proyecto de Pruebas: Whisper + Etherpad

Este proyecto está diseñado como entorno de pruebas para integrar **transcripción automática con Whisper** y **edición colaborativa con Etherpad** en un backend Node.js. Incluye scripts para gestionar la transcripción de audios con anotaciones temporales y una instancia de Etherpad embebida para edición colaborativa básica.

## 🚀 Requisitos previos


Antes de ejecutar el proyecto, asegúrate de tener instaladas todas las dependencias necesarias.

- [Node.js](https://nodejs.org/) (versión 18 o superior) y [npm](https://www.npmjs.com/) 
- [pnpm](https://pnpm.io/) instalado globalmente

  ```bash
  npm install -g pnpm
  ```
- [MySQL](https://www.mysql.com/) (con base de datos creada)
- [Python](https://www.python.org/) (≥3.8) con [Whisper (openai-whisper)](https://github.com/openai/whisper)
- [Git](https://git-scm.com/)
- [FFmpeg](https://ffmpeg.org/download.html)


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

## 🛠️ Instalación y configuración del entorno

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
 pip install -U openai-whisper
```
Asegúrate de tener también ffmpeg instalado para procesar los audios.

### 3. Instala la instancia de etherpad-lite en el proyecto
```bash
git clone https://github.com/ether/etherpad-lite.git
cd etherpad-lite
bin/installDeps.sh
```
## 🔧  Configuración de Etherpad

### 1. Copia el archivo de configuración por defecto:
```bash
cp settings.json.template settings.json
```
###  ✨2. Edita el archivo settings.json:
- Cambia el método de autenticación:
```bash
"authenticationMethod": "apikey",
```
Crea un archivo llamado apikey.txt (en la raíz de etherpad-lite) con una clave segura de al menos 32 caracteres. Por ejemplo:
```bash
e7c1b8f2c1a84b3f93e0a7d53f5a1f4b
```
###  🛠️3. Configura la base de datos MySQL ejecutando estos comandos:
```bash
mysql -u root -p   

CREATE DATABASE (nombre_db) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER '(nombre_usuario)'@'localhost' IDENTIFIED BY '(Contraseña)';
GRANT ALL PRIVILEGES ON (nombre_db).* TO '(nombre_usuario)'@'localhost';
FLUSH PRIVILEGES;
EXIT;
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
