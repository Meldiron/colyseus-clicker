import { Server } from 'colyseus';
import * as http from 'http';

import { GameRoom } from './rooms/gameRoom';

const port = Number(process.env.LISTEN_PORT) || 3000;

const gameServer = new Server({
  server: http.createServer(),
});

gameServer.register('game', GameRoom);

gameServer.listen(port);

console.log(`Listening on port ${port}`);

// TODO: Graphics in-game are from: By Roundicons, Freepik
