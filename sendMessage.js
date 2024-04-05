export function sendMessage() {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = function () {
        console.log('Conectado al servidor');

        // Una vez que la conexión está abierta, enviar el mensaje
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value;
        ws.send(message);
        messageInput.value = '';
    };


    ws.onmessage = function (event) {
        console.log('Mensaje recibido del servidor:', event.data);
        displayMessage(event.data);
    };
}

function displayMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
}
