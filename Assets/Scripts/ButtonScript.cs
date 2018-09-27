using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ButtonScript : MonoBehaviour {

	public void OnJoinClicked() {
		GameObject colyseus = GameObject.Find("ColyseusClient");

		if(colyseus) {
			colyseus.GetComponent<ColyseusClient>().JoinGame("aa");
		}
	}
}
