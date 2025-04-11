const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permite acesso de qualquer origem
  },
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected..", socket.id);

  socket.on("login", ({ userName }) => {
    const systemMessage = {
      system: true,
      content: `👋 ${userName} entrou no chat.`,
    };

    // Envia para todos os conectados
    io.emit("chatMessage", systemMessage);
  });

  socket.on("message", (data) => {
    // data já pode ser um objeto com userName, content, etc.
    io.emit("chatMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuário desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(
    `✅ Socket.IO server is up and running on http://localhost:${PORT}`
  );
});
