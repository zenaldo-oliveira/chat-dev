const { WebSocketServer } = require("ws");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;

// Cria servidor HTTP padrão
const server = http.createServer();

// Agora passa o HTTP para o WebSocket
const wss = new WebSocketServer({ server });

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

// Agora o HTTP server escuta na porta correta (que o Render define)
server.listen(PORT, () => {
  console.log(`✅ Servidor WebSocket rodando em ws://localhost:${PORT}`);
});
