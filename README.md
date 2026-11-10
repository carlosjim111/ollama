# 🛡️ Qwen Security RAG - Extensión de Chrome

Una poderosa extensión para Google Chrome que actúa como tu asistente personal experto en ciberseguridad. Conectada de forma 100% local a **Ollama** utilizando el modelo **Qwen3.5:4b**, esta herramienta garantiza una privacidad absoluta (cero envíos a la nube) e implementa un sistema **RAG** (Retrieval-Augmented Generation) ligero para consultar tus propias normativas y manuales de seguridad.

## ✨ Características

- 🔒 **Privacidad Total**: Todo el procesamiento de IA se realiza en tu propia máquina (Localhost).
- 📄 **RAG Integrado**: Sube documentos `.txt`, `.md` o `.json` y el modelo responderá basándose estrictamente en ese contexto.
- ⚡ **Respuestas en Tiempo Real (Streaming)**: Las respuestas se generan en vivo. El código filtra automáticamente las etiquetas internas de razonamiento (`<think>`) para ofrecer un chat rápido y directo.
- 🎨 **Diseño Moderno y Responsivo**: Interfaz "Dark Mode" estilo ciberseguridad, ampliada al tamaño máximo permitido por Chrome (800x600px), con campos de texto redondeados y botones estilizados.

## 🛠️ Requisitos Previos

Necesitas tener [Ollama](https://ollama.com/) instalado en tu sistema Windows. Si no lo tienes, el proceso de instalación te guiará.

## 🚀 Instalación y Configuración

### 1. Configurar Ollama (Motor de IA Local)

Abre **PowerShell como Administrador** y ejecuta los siguientes comandos para instalar Ollama, descargar el modelo y habilitar los permisos CORS (necesarios para que la extensión de Chrome pueda comunicarse con tu PC):

```powershell
# Instalar Ollama (si no lo tienes)
irm [https://ollama.com/install.ps1](https://ollama.com/install.ps1) | iex

# Habilitar CORS de forma permanente para la extensión
setx OLLAMA_ORIGINS "*"

# Descargar y ejecutar el modelo de seguridad
ollama run qwen3.5:4b
