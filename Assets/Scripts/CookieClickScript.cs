using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CookieClickScript : MonoBehaviour
{

    void OnMouseDown()
    {
        GameObject colyseus = GameObject.Find("ColyseusClient");

        if (colyseus)
        {
            colyseus.GetComponent<ColyseusClient>().sendClick();
        }
    }
}
