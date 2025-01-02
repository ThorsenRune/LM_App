/*	File:bt.js			all bluetooth related stuff, make it compatible with websocket.js
*/
var bWiFi_BT_State=true;	//todo:refactor name temporary
var bUseBluetooth=function(newstate){
	/*
		args: true=>use BT, false=>use WiFI, null=> return current state
		returns true if BT is used flase if WiFi
		@author:RT210128 toggle bluetoot/WiFi
	*/
	if (typeof newstate==='undefined') return bWiFi_BT_State;
	bWiFi_BT_State=newstate;
	if (bWiFi_BT_State){		//Use bluetooth
		connectviaBT()	//Start a connection todo: refactor to InitiazeBT
		//TODO:startBTnotifications should be in a callback of connectviaBT
		setTimeout(function(){
			mMessage('Waiting for pairing');
			startBTnotifications();//Start the communication
			mMessage('BT transmission started');
		},15000);
	} else {
		mWebSocket_InitAsync();			//Setup the websocket
	}
	//Todo business logic to enable disable wifi/bluetooth

};
//Todo: call somewhere when selecting bluetooth if (isWebBluetoothEnabled() {...}
 function isWebBluetoothEnabled() {
	 if (!navigator.bluetooth) {
		 debug.msg(0,'Web Bluetooth API is not available in this browser!')
		 //
		 return false
	 }

	 return true
 }

 //ESTABLISH BT CONNECTION
 function getDeviceInfo() {
	 //Filter devices by Service UUID and Name
	 let options = {
		 optionalServices: [bleService],
		 filters: [ { "name": deviceName } ]
	 }
	 mMessage('Requesting any Bluetooth Device...')
	 return navigator.bluetooth.requestDevice(options).then(device => {
		 bluetoothDeviceDetected = device
	 }).catch(error => {
		 //Todo:
		 mMessage('Cannot connect to bluetooth'+ error.message);
		 //Todo : add type of error. handleChangedValue
	 })
 }



 //SEND A MESSAGE TO THE ESP32
 //Todo: pass data as parameter send2LMviaBT(data)
  function send2LMviaBT(value) {   //value is an arry of bytes
  //let encoder = new TextEncoder('utf-8');
  debug.msg(0,'Setting Characteristic User Description...');
  gattCharacteristic.writeValue(value)
  .then(_ => {
 	 debug.msg(0,'> Characteristic User Description changed to: ' + value);
  })
  .catch(error => {
		//todo9: userfriendly message
 	 debug.msg(0,'Argh! ' + error);
  });


 }

//??NOW TO UPDATE DATA??//
//START NOTIFICATIONS
 function startBTnotifications() {
	 gattCharacteristic.startNotifications()
	 .then(_ => {
		 console.log('Start reading...');
		 debug.msg(0,'Start reading...');
	 })
	 .catch(error => {
		 console.log('[ERROR] Start: ' + error);
		  debug.msg(0,'[ERROR] Start: ' + error);

	 })
 }
//STOP NOTIFICATIONS
 function stopBTnotifications() {
	 gattCharacteristic.stopNotifications()
	 .then(_ => {
		 console.log('Stop reading...');
		  debug.msg(0,'Stop reading...');
	 })
	 .catch(error => {
		 console.log('[ERROR] Stop: ' + error);
		debug.msg(0,'[ERROR] Start: ' + error);
	 })
 }


//	BT_InitBluetoot - setup addEventListener BTReceiveEvent
//	*--->	BTReceiveEvent (data on BT) ->read data -> serial.onReceive(data)


function connectviaBT() {
	// initialize bluetooth and  setup an event listener
	//todo: refactor name mWebSocket_InitAsync
	oProtocol.connected=true
	//returns data from BT as Uint8Array [1..20]
	//Todo: write what this does in a comment is this the Ternary Operator? (variable = (condition) ? expressionTrue : expressionFalse)
	return (bluetoothDeviceDetected ? Promise.resolve() : getDeviceInfo() && isWebBluetoothEnabled())
	.then(connectGATT)  //todo:@FC please explain what is happening here
	.then(_ => {
		console.log('Evaluating signal of interest...')
		return gattCharacteristic.readValue()	//receiving data from BT - Uint8Array [1..20]
	})
	.catch(error => {
		jDebugMsg('Waiting to start reading: ' + error)
	})
}

function connectGATT() {  // works like ws.onmessage
	 //When the user has paired the bluetooth this will set the isBTConnected flag
	 // CONNECT TO A GENERIC ATTRIBUTE
	 if (bluetoothDeviceDetected.gatt.connected && gattCharacteristic) {
		 return Promise.resolve()
	 }
	 return bluetoothDeviceDetected.gatt.connect()
	 .then(server => {
		 console.log('Getting GATT Service...')
		 return server.getPrimaryService(bleService)
	 })
	 .then(service => {
		 console.log('Getting GATT Characteristic...')
		 return service.getCharacteristic(bleCharacteristic)
	 })
	 .then(characteristic => {			//Similar to ws.onmessage
		 gattCharacteristic = characteristic
		 gattCharacteristic.addEventListener('characteristicvaluechanged',
				 handleChangedValue) //Like serial.onReceive
		 document.getElementById( "idStatus").innerHTML="CONNECTED";
		 alert('Bluetooth connected');
		 isBTConnected = true;
	 })

 }

  //HANDLE RECEIVED MESSAGES (STORE THEM AND CONVERT THEM)
 //Read data from BT
  function handleChangedValue(event) {
 	 let decoder = new TextDecoder('utf-8');
 	 let value = event.target.value
 	 var now = new Date()
 	 console.log('> ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ' Received message is: ' + decoder.decode(value) );
	  debug.msg(0,'> ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ' Received message is: ' + decoder.decode(value) );
 	 receivedValue=value;
 	 copy WebSocket_received
 //	 MessageReceived = receivedValue;
   debug.msg(0,"CONNECTED, Acquiring data");
 	 isBTConnected = true;
  }

/////////////////// WEB BT

var deviceName = 'MeCFES'  //BT name
var bleService = '783b26f8-740d-4187-9603-82281d6d7e4f' 			//UUID for the Service - generated for the LM project
var bleCharacteristic = '1bfd9f18-ae1f-4bba-9fe9-0df611340195' //UUID for the received characteristic - generated for the LM project - Receiving data
var bleCharacteristicWrite = 'bb99a060-6fa8-4bba-9ef0-731634e96e88' //UUID for the characteristic to send - generated for the LM project - Used for writing
var bluetoothDeviceDetected //Characteristics of the connected BT device
var gattCharacteristic //Generic ATTribute (GATT) characteristic
let receivedValue = "";
let isBTConnected = false;
var MessageReceived = "";
