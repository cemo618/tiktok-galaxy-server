const WebSocket = require('ws');
const { WebcastPushConnection } = require('tiktok-live-connector');

// TikTok Benutzername hier eintragen
const tiktokUsername = "DEIN_TIKTOK_NAME"; // <--- HIER ANPASSEN!

// WebSocket-Server auf Port 8080 starten
const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

// TikTok Verbindung starten
const tiktokConnection = new WebcastPushConnection(tiktokUsername);

tiktokConnection.connect().then(() => {
  console.log(`✅ Verbunden mit TikTok Benutzer: @${tiktokUsername}`);
}).catch(err => {
  console.error("❌ Verbindung zu TikTok fehlgeschlagen:", err);
});

// Auf neue WebSocket-Clients warten
wss.on('connection', ws => {
  clients.push(ws);
  console.log("🟢 Client verbunden");

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
    console.log("🔴 Client getrennt");
  });
});

// Nur GALAXY-Geschenke verarbeiten
tiktokConnection.on('gift', data => {
  if (data.giftName.toLowerCase().includes("galaxy")) {
    const message = JSON.stringify({
      user: data.uniqueId,
      count: data.repeatCount || 1,
      avatar: data.profilePictureUrl
    });
    clients.forEach(ws => ws.send(message));
    console.log("✨ Galaxy gesendet von:", data.uniqueId);
  }
});