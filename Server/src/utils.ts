import { Player } from './rooms/gameRoom';
import { EntityMap } from 'colyseus';

export const getReorderedPlayers = (
  players: EntityMap<Player>,
): EntityMap<Player> => {
  const playerIdsArr = Object.keys(players);

  const playersArr: Player[] = [];

  playerIdsArr.forEach(playerId => {
    const player = players[playerId];
    playersArr.push(player);
  });

  const orderedPlayersArr = playersArr.sort(sortArrByScore);

  orderedPlayersArr.forEach((player, index) => {
    players[player.id].place = index + 1;
  });

  return players;
};

export const sortArrByScore = (a, b) => {
  if (a.clicks > b.clicks) return -1;
  if (a.clicks < b.clicks) return 1;
  return 0;
};
