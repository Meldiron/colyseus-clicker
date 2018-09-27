using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Colyseus;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using System;
using GameDevWare.Serialization;

public class ColyseusClient : MonoBehaviour
{
    private static bool created = false;
    public GameObject loginCanvas;
    public GameObject connectingCanvas;
    public InputField inputNick;


    private Client client = null;
    private Room room = null;
    private IndexedDictionary<string, Player> players = new IndexedDictionary<string, Player>();

    // Use this for initialization
    void Start()
    {
        if (!created)
        {
            DontDestroyOnLoad(this.gameObject);
            created = true;
        }
    }

    public void JoinGame(string name)
    {
        loginCanvas.SetActive(false);
        connectingCanvas.SetActive(true);

        string nick = inputNick.text;
        StartCoroutine(ConnectToServer(nick));
    }


    private IEnumerator ConnectToServer(string nick)
    {
        if (this.room != null)
        {
            this.room.Leave();
        }

        if (this.client != null)
        {
            this.client.Close();
        }


        client = new Client("ws://localhost:3000");
        yield return StartCoroutine(client.Connect());

        Dictionary<string, object> joinData = new Dictionary<string, object>();
        joinData.Add("nick", nick);

        room = client.Join("game", joinData);
        room.OnReadyToConnect += (sender, e) =>
        {
            StartCoroutine(room.Connect());
        };

        SceneManager.LoadScene(1);

        room.Listen("players/:playerId", (DataChange change) =>
        {
            IndexedDictionary<string, object> player = (IndexedDictionary<string, object>)change.value;
            Player p = new Player();

            if (change.operation == "add")
            {
                p.clicks = Convert.ToInt16(player["clicks"]);
                p.id = Convert.ToString(player["id"]);
                p.nick = Convert.ToString(player["nick"]);
                p.place = Convert.ToInt16(player["place"]);

                players.Add(p.id, p);
            }
            else if (change.operation == "remove")
            {
                players.Remove(p.id);
            }

            RenderLeaderboard();
        });

        room.Listen("players/:playerId/clicks", (DataChange change) =>
        {
            players[change.path["playerId"]].clicks = Convert.ToInt16(change.value);
            RenderLeaderboard();
        });

        room.Listen("players/:playerId/place", (DataChange change) =>
        {
            players[change.path["playerId"]].place = Convert.ToInt16(change.value);
            RenderLeaderboard();
        });

        while (true)
        {
            client.Recv();
            yield return 0;
        }
    }

    private void RenderLeaderboard()
    {
        GameObject gameScripts = GameObject.Find("GameScripts");

        if (gameScripts)
        {
            gameScripts.GetComponent<ScoreboardScript>().RenderLeaderboard(players, client);
        }
    }


    public void sendClick()
    {
        if (room != null)
        {
            room.Send("click");
        }
    }
}
