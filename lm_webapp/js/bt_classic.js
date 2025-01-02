/* File: bt_classic.js
   Equivalent to websocket.js, module for prototype.html used for websocket.ino to interface with LM from browser (client)
   Handles serial communication between LM and client using Bluetooth Classic

    here is how a webview could be implemented in android using b4a
    https://chatgpt.com/c/d8922827-6ea7-4fb3-9da1-a499cd871485


the class is assigned to CommLink providing the following methods
    CommLink.type= "BTClassic"
    CommLink.isConnected()
    CommLink.start()
    CommLink.closeMe();
    CommLink.sendData(data);        //Data is an array of bytes convertible by  Uint8Array(data)
*/
"use strict";
class BTClassic {
    static type = "BTClassic";
    static instance = null;
    static port = null;
    static reader = null;
    static writer = null;


    constructor() {
        if (BTClassic.instance) {
            return BTClassic.instance;
        }
        this.isOpen = false;
        this.type=BTClassic.type;
        BTClassic.instance = this;
        requestRedraw();
    }

    isConnected() {
        if (!this.isOpen) return false; //Several conditions must be met
        if (!BTClassic.port) return false;
        if (!BTClassic.port.readable) return false
        if (!BTClassic.port.writable) return false 
        return true 
    }
    async sendData(data) {
        if (!this.isConnected()) return false;

        try {
            // Write data using the assigned writer
            let dataArray = new Uint8Array(data);
            await BTClassic.writer.write(dataArray);

            return true;
        } catch (e) {
            console.error('Error sending data:', e);
            return false;
        }
    }
    async receiveData() {
        try {
            while (true) {
                const { value, done } = await BTClassic.reader.read();
                if (done) {
                    console.log('[listenToPort] DONE', done);
                    BTClassic.reader.releaseLock();
                    this.closeMe();
                    break;
                }
                if (value) {
                    Channel_ReceiveData(value);
            } else {
                    console.error('Received unexpected data type:', typeof value);
                }
            }
        } catch (e) {
            console.error('Error reading from port:', e);
            mMessage('Bluetooth error ');
            mMessage(JSON.stringify(e.stack))
            await this.closeMe();
        }
    }

    async start() {
        if (this.isConnected()) {
            return mMessage('Already Connected');
        }
        try {
          //  await this.closeMe();
            if (BTClassic.port&&BTClassic.port.connected){  //A reconnection

            } else if (false){
                //If you want to remember the port we could do it by its index
                var  ports = await navigator.serial.getPorts();
                var lastportindex=ports.indexOf(BTClassic.port)
                BTClassic.port =ports[lastportindex]
                //Think about this solution would be userfriendly?
            } else {
                mMessage("Look for something starting with LM_ ....")
                BTClassic.port = await navigator.serial.requestPort();

            }
            BTClassic.port.onconnect=function(){
                mMessage("onconnect fired");
            }
            BTClassic.port.ondisconnect=function(){
                mMessage("ondisconnect fired");
            }
            mMessage('Setting up communication, please wait');
            await BTClassic.port.open({ baudRate: 115200, bufferSize: 1000 });
            BTClassic.reader = BTClassic.port.readable.getReader();
            BTClassic.writer = await BTClassic.port.writable.getWriter(); // Assign the writer here
            mMessage("Ready to communicate");
            this.isOpen = true;
            requestRedraw()
            App.StartLMProtocol();      //Auto setup
            await this.receiveData();       //This function stops here with infinite loop
        } catch (e) {
            mMessage("Serial Connection Failed:");
            mMessage(e);
            this.closeMe();
        }
        requestRedraw()
    }

async closeMe() {
    if (this.isOpen) {
        try {
            // Release writer lock if it exists
            if (BTClassic.writer) {
                await BTClassic.writer.releaseLock();
                BTClassic.writer = null; // Reset writer
            }
            
            // Release reader lock if it exists
            if (BTClassic.reader) {
                await BTClassic.reader.releaseLock();
                BTClassic.reader = null; // Reset reader
            }
            
            // Close the port
            if (BTClassic.port ) {
                await BTClassic.port.close();
// Keep the port reference                BTClassic.port = null; // Reset port
            }
        } catch (e) {
            console.error('Failed to close port or release locks:', e);
        }
    }
    this.isOpen=false;
    requestRedraw();
  }
}

class BTViaWebView {    //Using an Android application to connect a WebView to bluetooth
    static type = "BTViaWebView";
    static isOpen=true;       //Has been opened by WebView application
    isConnected() {
        return true 
    }


    sendData(data) {
        var str=utils.ByteArray2String(data)
        str=btoa(str)
        B4X.CallSub("WebView2BT", true, str);
    }

}
function jBT2WebView(msg) {     //Function name defined in B4A APK
    msg=atob(msg)
    var value=utils.String2ByteArrayg(msg)
     Channel_ReceiveData(value);
}
 



function isWebViewViaApp(){
     if(B4X&&B4X.CallSub){
        return true
    }
} 