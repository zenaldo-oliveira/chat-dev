const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("🟢 New client connected");

  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message = data.toString();

    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });
});

console.log(`✅ WebSocket server is up and running on ws://localhost:${PORT}`);
