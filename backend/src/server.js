const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get("/", (req, res) => {
  res.send("Servidor WebSocket está rodando!");
});

wss.on("connection", (ws) => {
  console.log("✅ Novo cliente conectado");

  ws.on("message", (data) => {
    console.log("📨 Mensagem recebida:", data.toString());

    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.on("error", (err) => console.error("❌ Erro WebSocket:", err));
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
