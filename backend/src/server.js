const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("🟢 New client connected..");

  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    // Se for uma mensagem de login
    if (message.type === "login") {
      const systemMessage = {
        system: true,
        content: `👋 ${message.userName} entrou no chat.`,
      };

      broadcast(systemMessage);
    }
    // Se for uma mensagem normal de chat
    else if (message.type === "message") {
      broadcast(message);
    }
  });
});

function broadcast(message) {
  const messageString = JSON.stringify(message);

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(messageString);
    }
  });
}

console.log(`✅ WebSocket server is up and running on ws://localhost:${PORT}`);
