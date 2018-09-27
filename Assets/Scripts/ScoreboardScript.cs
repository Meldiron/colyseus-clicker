using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Colyseus;
using GameDevWare.Serialization;
using UnityEngine.UI;
using System;

public class ScoreboardScript : MonoBehaviour
{
    public GameObject firstPlaceObj;
    public GameObject secondPlaceObj;
    public GameObject thirdPlaceObj;
    public GameObject youPlaceObj;
    public Text gameDescription;

    public void RenderLeaderboard(IndexedDictionary<string, Player> players, Client client)
    {
        int totalClicks = 0;

        bool isFist = false;
        bool isSecond = false;
        bool isThird = false;

        foreach (KeyValuePair<string, Player> playerData in players)
        {
            Player p = playerData.Value;

            totalClicks += p.clicks;
            bool isTop3 = false;

            if (p.place == 1)
            {
                isFist = true;
                isTop3 = true;
                UpdateScoreboard(firstPlaceObj, p);
            }
            else if (p.place == 2)
            {
                isSecond = true;
                isTop3 = true;
                UpdateScoreboard(secondPlaceObj, p);
            }
            else if (p.place == 3)
            {
                isThird = true;
                isTop3 = true;
                UpdateScoreboard(thirdPlaceObj, p);
            }

            if (p.id == client.id)
            {
                if (isTop3 == true)
                {
                    youPlaceObj.SetActive(false);
                }
                else
                {
                    youPlaceObj.SetActive(true);
                    UpdateScoreboard(youPlaceObj, p);
                }
            }
        }

        Player emptyPlayer = new Player();
        emptyPlayer.clicks = -1;
        emptyPlayer.nick = "...";

        if (isFist == false)
        {
            UpdateScoreboard(firstPlaceObj, emptyPlayer);
        }

        if (isSecond == false)
        {
            UpdateScoreboard(secondPlaceObj, emptyPlayer);
        }

        if (isThird == false)
        {
            UpdateScoreboard(thirdPlaceObj, emptyPlayer);
        }

        gameDescription.text = Convert.ToString(totalClicks) + " total clicks";
    }

    private void UpdateScoreboard(GameObject gameObj, Player p)
    {
        gameObj.GetComponent<Text>().text = p.nick;
        Transform scoreObj = gameObj.transform.Find("Score");
        if (scoreObj)
        {
            scoreObj.GetComponent<Text>().text = p.clicks == -1 ? "..." : Convert.ToString(p.clicks);
        }
    }
}
