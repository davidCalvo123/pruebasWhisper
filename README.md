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
git clone https://github.com/davidCalvo123/pruebasWhisper.git
cd pruebasWhisper
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

### 4. Instala la instancia de etherpad-lite en el proyecto
```bash
git clone https://github.com/ether/etherpad-lite.git
cd etherpad-lite
bin/installDeps.sh
```
## 🔧  Configuración de Etherpad

### 🗂️1. Copia el archivo de configuración por defecto:
```bash
cp settings.json.template settings.json
```
###  ✨2. Edita el archivo settings.json:
Cambia el método de autenticación:
```json
"authenticationMethod": "apikey",
```
Esto permite el acceso mediante API key desde tu aplicación Node.js sin necesidad de configurar autenticación externa.

Crea un archivo llamado apikey.txt (en la raíz de etherpad-lite) con una clave segura de al menos 32 caracteres. Por ejemplo:
```bash
e7c1b8f2c1a84b3f93e0a7d53f5a1f4b
```
###  🛠️3. Configura la base de datos MySQL ejecutando estos comandos:
```sql
mysql -u root -p   

CREATE DATABASE (nombre_db) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER '(nombre_usuario)'@'localhost' IDENTIFIED BY '(contraseña)';
GRANT ALL PRIVILEGES ON (nombre_db).* TO '(nombre_usuario)'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
Después, en tu settings.json, configura la conexión así:

```json
"dbType" : "mysql",
"dbSettings" : {
  "user"    : "(nombre_usuario)",
  "host"    : "localhost",
  "password": "(contraseña)",
  "database": "(nombre_db)",
  "charset" : "utf8mb4"}
"authenticationMethod": "apikey"
```
### 💻4. Activa el usuario administrador de la interfaz web (en el mismo settings.json):
```json
"users": {
  "admin": {
    "password": "(contreseña_para_la_interfaz_web)",
    "is_admin": true
  }
}
```

## 🧠  Configuración del servidor

En config.js de pruebasWhisper:
```bash
module.exports = {
  etherpad: {
    enabled: true,
    server: 'localhost',
    port: 9001,
    apiKey: 'TU_API_KEY'}};
```
## 🚀  Ejecución del entorno

Puedes lanzar el entorno completo (servidor Node + Etherpad) desde pruebasWhisper con:
```bash
npm run dev
```
Esto ejecutará de forma concurrente:
- El servidor principal (app.js)
- Etherpad (etherpad-lite/bin/run.sh)

#### 🎨Activar colores en los pads
Para que funcionen los colores en los pads, se debe acceder a la interfaz de administración de Etherpad:
👉http://localhost:9001/admin 
Usa la contraseña que configuraste en el archivo settings.json, y desde ahí instala el plugin ep_font_color.

####  📍Acceso a la interfaz principal de la aplicación
Una vez lanzado todo, puedes acceder a la interfaz web de la aplicación desde:

👉 http://localhost:3000

Ahí podrás subir audios, asignar niveles, y generar transcripciones enriquecidas automáticamente.
