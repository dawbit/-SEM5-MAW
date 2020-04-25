"use strict";
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
let obejcts = {};
const express = require("express");
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on("connection", ws => {
  ws.send(JSON.stringify(obejcts));
  ws.on("message", message => {
    obejcts = JSON.parse(message);
    sendBroadcast(ws);
  });
});
const sendBroadcast = sender => {
  wss.clients.forEach(ws => {
    if (ws !== sender && ws.readyState === WebSocket.OPEN)
      ws.send(JSON.stringify(obejcts));
  });
};
server.listen(process.env.PORT || 2137, () => {
  console.log(`Server started on port ${server.address().port}`);
});
