import { WebSocketServer } from "ws";
import { TikTokConnection } from "tiktok-live-connector";

// TikTok Username
const tiktokUsername = "01minclips";

// 👉 Nutze dynamischen Port (für Render)
const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

let connection = new TikTokConnection(tiktokUsername);

wss.on("connection", function (ws) {
  console.log("WebSocket verbunden");
});

connection.connect().then(() => {
  console.log(`✅ Verbunden mit TikTok-Stream: ${tiktokUsername}`);
});

connection.on("gift", (data) => {
  if (data.giftId === 5655) {
    const message = {
      user: data.uniqueId,
      avatar: data.profilePictureUrl,
      count: data.repeatCount,
    };
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
    console.log("🌌 Galaxy empfangen:", message);
  }
});
