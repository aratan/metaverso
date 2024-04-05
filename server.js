const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('Cliente conectado');

    ws.on('message', function incoming(message) {
        // Verificar si el mensaje recibido no está vacío
        if (message.trim() !== '') {
            console.log('Mensaje recibido: %s', message);

            // Convertir el mensaje a cadena de texto si no lo es
            const stringMessage = typeof message === 'string' ? message : message.toString();

            // Envía un eco del mensaje recibido más ">>" al cliente que envió el mensaje
            ws.send(">>" + stringMessage);

            // Reenviar el mensaje a todos los clientes excepto al que lo envió originalmente
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(stringMessage);
                }
            });
        } else {
            console.log('Mensaje vacío recibido, ignorando...');
        }
    });
});
