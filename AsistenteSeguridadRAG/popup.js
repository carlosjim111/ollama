let documentContext = "";

document.getElementById('file-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            documentContext = e.target.result;
            addMessage("Bot", "✅ Documento cargado correctamente.");
        };
        reader.readAsText(file);
    }
});

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    if (!userText) return;

    addMessage("Tú", userText);
    inputField.value = "";
    
    const systemPrompt = `Eres un asistente experto en ciberseguridad. 
    Responde basándote ÚNICAMENTE en este contexto: 
    --- INICIO CONTEXTO ---
    ${documentContext}
    --- FIN CONTEXTO ---
    Si la respuesta no está en el contexto, usa tu conocimiento general.`;

    const requestBody = {
        model: "qwen3.5:4b",
        stream: true, // Activamos el streaming para recibir datos en vivo
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userText }
        ]
    };

    try {
        const chatBox = document.getElementById('chat-box');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg bot';
        msgDiv.textContent = "Procesando...";
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        const response = await fetch("http://127.0.0.1:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.trim() === '') continue;
                try {
                    const data = JSON.parse(line);
                    if (data.message && data.message.content) {
                        fullResponse += data.message.content;
                        
                        // 1. Borra bloques de pensamiento que ya se han cerrado
                        let displayText = fullResponse.replace(/<think>[\s\S]*?<\/think>/gi, '');
                        // 2. Oculta el bloque de pensamiento activo (mientras lo está generando)
                        displayText = displayText.replace(/<think>[\s\S]*/gi, '');
                        
                        msgDiv.textContent = displayText || "Pensando internamente...";
                        chatBox.scrollTop = chatBox.scrollHeight;
                    }
                } catch (e) {
                    // Ignorar fragmentos JSON partidos por el stream
                }
            }
        }

    } catch (error) {
        addMessage("Bot", "⚠️ Error de conexión: " + error.message);
    }
}

function addMessage(sender, text) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg ' + (sender === 'Tú' ? 'user' : 'bot');
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}