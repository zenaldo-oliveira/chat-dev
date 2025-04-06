const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

console.log(
  `✅ Servidor WebSocket rodando em ws://localhost:${process.env.PORT || 8080}`
);

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(data.toString());
      }
    });
  });

  console.log("🟢 Novo cliente conectado");
});
