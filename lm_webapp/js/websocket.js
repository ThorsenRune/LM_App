/*	File:websocket.js
 	This is a module of prototype.html used for websocket.ino to interface with LM from browser (client)
	Handles serial communication between lm and client using websocket(browser)
*/
"use strict";
class Socket {
    static type = "WebSocket";
    static instance = null;

    constructor() {
        if (Socket.instance) {
            return Socket.instance;
        }

        this.WS = null;
        this.isOpen = false;
        this.type=Socket.type;
        Socket.instance = this;
        requestRedraw()
    }

    onOpen(evt) {
        this.isOpen = WebSocket.OPEN;
        mMessage("Opening");
        requestRedraw();
        App.StartLMProtocol();      //Auto setup
    }

    isConnected() {
        if (!this.isOpen) return false;
        if (!this.WS) return false;
        if (this.WS.readyState !== WebSocket.OPEN) return false;
        return true;
    }

    async sendData(TXdata) {
        try {
            if (this.isConnected()) {
                const binaryData = new Uint8Array(TXdata);
                this.WS.send(binaryData);  // Send the data through WebSocket
            } else {
                debug.msg(0, "Please connect first");
            }
        } catch (e) {
            debug.msg(0, 'Error sending data:', e);
        }
    }

    receiveData(evt) {
        Channel_ReceiveData(evt.data);  // Pass the received data
    }

    onError(evt) {
        debug.msg(0, "WebSocket error: ", evt);
    }

    async start() {
        debug.msg(2, "WebSocket start");
        if (this.isConnected()) {
            return mMessage('ALREADY CONNECTED');
        }
        const IPAddr = ESP_IPAddr();
        const uri = "ws://" + IPAddr + ":80";
        mMessage("Connecting to: " + uri);
        this.WS = new WebSocket(uri);
        this.WS.binaryType = 'arraybuffer';

        this.WS.onmessage = (evt) => { 
            this.receiveData(evt); 
        };
        this.WS.onopen = (evt) => {
            debug.msg(2, "WebSocket opening");
            this.onOpen(evt);
        };
        this.WS.onclose = (evt) => {
            console.log("WebSocket connection closed");
            debug.msg(0, `WebSocket closed. Code: ${evt.code}, Reason: ${evt.reason}, Clean: ${evt.wasClean}`);
            this.WS = null;
            requestRedraw();
        };
        this.WS.onerror = (evt) => {
            this.onError(evt);
            requestRedraw();
        };
        requestRedraw()
    }

    async closeMe() {
        if (this.isConnected()) {
            this.isOpen = false;
            this.WS.close();  // Close the WebSocket connection
        } else {
            debug.msg(0, "No active WebSocket connection to close");
        }
        requestRedraw()
    }
}

 

/*************************** HTTP ***********************/
 

function HTTP_Ping(IPAddr,callback){
    var IPAddr=prompt("Connect via WIFI. Provide IP addr of ESP (check same network)",ESP_IPAddr())
    if(IPAddr) ESP_IPAddr(IPAddr)

    var url = "http://"+ESP_IPAddr(IPAddr) + "/hello";
    debug.msg(0,"GET Request to : " + url);
    fetch(url)
        .then(response => response.text())
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error('Error:', error)
            jDebugMsg("Cannot connect");
            jDebugMsg(error.message);
        });
}

function HTTP_DirectConnect(){
    var serverurl="%BASEPATH%/lm_esp/dev/lm_webapp/index.php"
    var s="http://"+ESP_IPAddr()
    s=s+"?url="+serverurl
    alert("Connecting to "+s+"\n remember to be on the same network")
    jDebugMsg("Connecting to "+s);
    location.href=s
}

function HTTP_Status(){
    var url = "http://"+ ESP_IPAddr() + "/status";
   fetch(url)
        .then(response => response.text())
        .then(data => {
            debug.msg(0,data);
        })
        .catch(error => console.error('Error:', error));
}


function HTTP_Command(IPAddr, command, callback) {
    var url = "http://" + IPAddr + "/command?cmd=" + encodeURIComponent(command); // Assuming command is passed as a query parameter
    debug.msg(6,"JS:HTTP Request: " + url+" Sending:"+command);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            if(callback){
                callback(data);
            } else {
                debug.msg(0,data)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

var ESP_IPAddr =function(IPAddr){
    if(IPAddr)  {

        // Define a regular expression pattern to match an IP address
        const ipPattern = /(?:http:\/\/|https:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;

        // Use the regular expression to search for the IP address in the URL
        const match = IPAddr.match(ipPattern);

        // Return the IP address if found, otherwise return null
        IPAddr= match ? match[1] : null;
     
        utils.Location('ws',IPAddr) 
        localStorage.IPAddr=IPAddr  
    }
    IPAddr= utils.Location('ws')||localStorage.IPAddr||"192.168.198.133";
    return IPAddr;
};


function ESP_HTTPSendCommand(value){
    if(!value) return
    HTTP_Command(ESP_IPAddr(),value)
}


  
 
 
function onError(evt) {
  debug.msg(0,"*** WebSocket Error ***");

  // 1. URL: Get the attempted connection URL
  debug.msg(0,"WebSocket URL:"+ evt.target.url);

  // 2. binaryType: Get the configured binary data type
  debug.msg(0,"WebSocket binaryType:"+ evt.target.binaryType);
 // 3. bufferedAmount: Get the amount of data queued for sending (optional)
  if (typeof evt.target.bufferedAmount !== 'undefined') {
    debug.msg(0,"WebSocket bufferedAmount:", evt.target.bufferedAmount);
  } else {
    debug.msg(0,"WebSocket bufferedAmount: Not supported by this browser.");
  }

  // 4. readyState: Explain the connection state
  debug.msg(0,"WebSocket readyState:", evt.target.readyState);
  switch (evt.target.readyState) {
    case 0:
      debug.msg(0,"  - CONNECTING: The connection is being established.");
      break;
    case 1:
      debug.msg(0,"  - OPEN: The connection is open and ready to communicate.");
      break;
    case 2:
      debug.msg(0,"  - CLOSING: The connection is in the process of closing.");
      break;
    case 3:
      debug.msg(0,"  - CLOSED: The connection is closed.");
      break;
  }
}   



 
