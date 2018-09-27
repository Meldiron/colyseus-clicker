using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ClickIndicatorScript : MonoBehaviour
{

    void Start()
    {
        StartCoroutine(StopAnimation());
    }

    IEnumerator StopAnimation()
    {
        yield return new WaitForSeconds(5);

        this.GetComponent<Animator>().SetBool("isPaused", true);
    }
}
