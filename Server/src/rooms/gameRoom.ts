import { Room, EntityMap, Client, nosync } from 'colyseus';
import * as faker from 'faker';
import { getReorderedPlayers } from '../utils';

export enum Actions {
  AddPlayer,
  RemovePlayer,
  CookieClick,
}

export class Action {
  type: Actions;
  data: any;
}

export class Player {
  id: string;
  clicks: number;
  nick: string;
  place: number;

  constructor(id: string, nick: string) {
    this.id = id;
    this.clicks = 0;
    this.nick = nick;
  }
}

export class State {
  players: EntityMap<Player> = {};

  @nosync
  actions: Action[] = [];

  runActions() {
    let mayPlacesChange = false;
    this.actions.forEach(action => {
      if (action.type === Actions.AddPlayer) {
        this._addPlayerAction(action.data);
      } else if (action.type === Actions.RemovePlayer) {
        this._removePlayerAction(action.data);
      } else if (action.type === Actions.CookieClick) {
        this._coolieClickAction(action.data);
        mayPlacesChange = true;
      }
    });

    this.actions = [];

    if (mayPlacesChange) {
      this._recalculatePlaces();
    }
  }

  addPlayer(playerId: string, playerNick: string) {
    this.actions.push({
      type: Actions.AddPlayer,
      data: {
        id: playerId,
        nick: playerNick,
      },
    });
  }

  removePlayer(playerId: string) {
    this.actions.push({
      type: Actions.RemovePlayer,
      data: playerId,
    });
  }

  cookieClicked(playerId: string) {
    this.actions.push({
      type: Actions.CookieClick,
      data: playerId,
    });
  }

  private _addPlayerAction(playerData: { id: string; nick: string }) {
    if (!this.players[playerData.id]) {
      this.players[playerData.id] = new Player(playerData.id, playerData.nick);

      this._recalculatePlaces();
    }
  }

  private _removePlayerAction(playerId: string) {
    if (this.players[playerId]) {
      delete this.players[playerId];
    }
  }

  private _coolieClickAction(playerId: string) {
    if (this.players[playerId]) {
      this.players[playerId].clicks += 1;
    }
  }

  private _recalculatePlaces() {
    this.players = getReorderedPlayers(this.players);
  }
}

export class GameRoom extends Room<State> {
  onInit(options) {
    this.setState(new State());

    this.clock.setInterval(() => {
      this.state.runActions();
    }, 1 / 30);
  }

  onJoin(client: Client, options, auth) {
    this.state.addPlayer(client.id, options.nick || faker.name.findName());
  }

  onLeave(client, consented) {
    this.state.removePlayer(client.id);
  }

  onMessage(client: Client, data: string) {
    if (data === 'click') {
      this.state.cookieClicked(client.id);
    }
  }
}
