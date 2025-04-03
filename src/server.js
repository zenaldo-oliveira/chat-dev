const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("error", console.error);

  ws.on("message", (data) => {
    console.log(`Received: ${data.toString()}`);

    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
