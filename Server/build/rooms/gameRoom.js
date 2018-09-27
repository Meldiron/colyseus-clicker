"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const faker = require("faker");
const utils_1 = require("../utils");
var Actions;
(function (Actions) {
    Actions[Actions["AddPlayer"] = 0] = "AddPlayer";
    Actions[Actions["RemovePlayer"] = 1] = "RemovePlayer";
    Actions[Actions["CookieClick"] = 2] = "CookieClick";
})(Actions = exports.Actions || (exports.Actions = {}));
class Action {
}
exports.Action = Action;
class Player {
    constructor(id, nick) {
        this.id = id;
        this.clicks = 0;
        this.nick = nick;
    }
}
exports.Player = Player;
class State {
    constructor() {
        this.players = {};
        this.actions = [];
    }
    runActions() {
        let mayPlacesChange = false;
        this.actions.forEach(action => {
            if (action.type === Actions.AddPlayer) {
                this._addPlayerAction(action.data);
            }
            else if (action.type === Actions.RemovePlayer) {
                this._removePlayerAction(action.data);
            }
            else if (action.type === Actions.CookieClick) {
                this._coolieClickAction(action.data);
                mayPlacesChange = true;
            }
        });
        this.actions = [];
        if (mayPlacesChange) {
            this._recalculatePlaces();
        }
    }
    addPlayer(playerId, playerNick) {
        this.actions.push({
            type: Actions.AddPlayer,
            data: {
                id: playerId,
                nick: playerNick,
            },
        });
    }
    removePlayer(playerId) {
        this.actions.push({
            type: Actions.RemovePlayer,
            data: playerId,
        });
    }
    cookieClicked(playerId) {
        this.actions.push({
            type: Actions.CookieClick,
            data: playerId,
        });
    }
    _addPlayerAction(playerData) {
        if (!this.players[playerData.id]) {
            this.players[playerData.id] = new Player(playerData.id, playerData.nick);
            this._recalculatePlaces();
        }
    }
    _removePlayerAction(playerId) {
        if (this.players[playerId]) {
            delete this.players[playerId];
        }
    }
    _coolieClickAction(playerId) {
        if (this.players[playerId]) {
            this.players[playerId].clicks += 1;
        }
    }
    _recalculatePlaces() {
        this.players = utils_1.getReorderedPlayers(this.players);
    }
}
__decorate([
    colyseus_1.nosync
], State.prototype, "actions", void 0);
exports.State = State;
class GameRoom extends colyseus_1.Room {
    onInit(options) {
        this.setState(new State());
        this.clock.setInterval(() => {
            this.state.runActions();
        }, 1 / 30);
    }
    onJoin(client, options, auth) {
        this.state.addPlayer(client.id, options.nick || faker.name.findName());
    }
    onLeave(client, consented) {
        this.state.removePlayer(client.id);
    }
    onMessage(client, data) {
        if (data === 'click') {
            this.state.cookieClicked(client.id);
        }
    }
}
exports.GameRoom = GameRoom;
//# sourceMappingURL=gameRoom.js.map