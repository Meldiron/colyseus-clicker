using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class ValidateScript : MonoBehaviour
{
    void Start()
    {
        GameObject colyseus = GameObject.Find("ColyseusClient");

        if (!colyseus)
        {
            SceneManager.LoadScene(0);
        }
    }
}
