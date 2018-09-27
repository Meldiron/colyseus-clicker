"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReorderedPlayers = (players) => {
    const playerIdsArr = Object.keys(players);
    const playersArr = [];
    playerIdsArr.forEach(playerId => {
        const player = players[playerId];
        playersArr.push(player);
    });
    const orderedPlayersArr = playersArr.sort(exports.sortArrByScore);
    orderedPlayersArr.forEach((player, index) => {
        players[player.id].place = index + 1;
    });
    return players;
};
exports.sortArrByScore = (a, b) => {
    if (a.clicks > b.clicks)
        return -1;
    if (a.clicks < b.clicks)
        return 1;
    return 0;
};
//# sourceMappingURL=utils.js.map