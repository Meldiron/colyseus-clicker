"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const http = require("http");
const gameRoom_1 = require("./rooms/gameRoom");
const port = Number(process.env.LISTEN_PORT) || 3000;
const gameServer = new colyseus_1.Server({
    server: http.createServer(),
});
gameServer.register('game', gameRoom_1.GameRoom);
gameServer.listen(port);
console.log(`Listening on port ${port}`);
// TODO: Graphics in-game are from: By Roundicons, Freepik
//# sourceMappingURL=main.js.map