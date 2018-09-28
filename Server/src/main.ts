import { Server } from 'colyseus';
import * as dotenv from 'dotenv';
import * as http from 'http';

import { GameRoom } from './rooms/gameRoom';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

const gameServer = new Server({
  server: http.createServer(),
});

gameServer.register('game', GameRoom);

gameServer.listen(port);

console.log(`Listening on port ${port}`);
