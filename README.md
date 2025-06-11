# 📝 Proyecto de Pruebas: Whisper + Etherpad

Este proyecto está diseñado como entorno de pruebas para integrar **transcripción automática con Whisper** y **edición colaborativa con Etherpad** en un backend Node.js. Incluye scripts para gestionar la transcripción de audios con anotaciones temporales y una instancia de Etherpad embebida para edición colaborativa básica.

## 🚀 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión recomendada: ≥14)
- [MySQL](https://www.mysql.com/) (con base de datos creada)
- [Python](https://www.python.org/) (≥3.8)
- `pip install openai-whisper` (o tu entorno con Whisper instalado)
- Sistema Unix (Linux/macOS) o WSL en Windows (para ejecutar `bin/run.sh` de Etherpad)

## 📁 Estructura del proyecto