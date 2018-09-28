"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const dotenv = require("dotenv");
const http = require("http");
const gameRoom_1 = require("./rooms/gameRoom");
dotenv.config();
const port = Number(process.env.PORT) || 3000;
const gameServer = new colyseus_1.Server({
    server: http.createServer(),
});
gameServer.register('game', gameRoom_1.GameRoom);
gameServer.listen(port);
console.log(`Listening on port ${port}`);
//# sourceMappingURL=main.js.map