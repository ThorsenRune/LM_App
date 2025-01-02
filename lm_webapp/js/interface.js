/*	File: interface.js
	The ESP object communicating with ESP32 via Websocket
	Database communication
	todo: save localstorage CommLink.type and set automatically on restart
*/
"use strict";
var CommLink={isConnected:function(){return false}};			//Link for communication
var RX0FIFO={byteArray:[]}	//FIFO object for incoming datastream

function DoTransmissions() {
  /* data transmissions
      set or get requests, started by flagging the    
  */
 	const objList = protocol.oProtElems;
	for (const VarName in objList) {
		if (objList.hasOwnProperty(VarName)) {
			    _exhange(VarName, objList[VarName]);
		}
	}

	while (
    	RXDataDecode()
	){}

	function _exhange(VarName,varObj){
		  //Connection level 3:DSP, 2:ESP, 1:Local
	  if (varObj.Connected() < 2) return
	  // Only transmit to DSP or ESP memory space
	  const VarId = varObj.VarId();
	  if (varObj.PokeData()) {
	    const vector = varObj.GetVector();
	    for (let j = 0; j < vector.length; j++) {
	      SetReqSend(VarId, vector[j], j);
	    }
	    varObj.PokeData(false); // Reset poke flag after sending
	  }

	  if (varObj.PeekData()) {
	    GetReqSend(VarId);
	    varObj.PeekData(false); // Reset peek flag after requesting
	  }
	}

	function SetReqSend(VarId,Value,Offset){	//Set a 32bit word at offset of VarId
		var data=[]
	     data.push(konst.kSetReq);
	     data.push(VarId);
	     data.push(Offset);
	     var b=utils.mInt2ByteArray(Value)
	     data.push(b[0]);
	     data.push(b[1]);
	     data.push(b[2]);
	     data.push(b[3]);
	  Channel_SendData(data);
	}

	function GetReqSend(VarId) {
		var data=[]
		data.push(konst.kGetReq);
		data.push(VarId);
		Channel_SendData(data);
	}
}


RX0FIFO.push=function(byteArray){
	var byteCount=0;
	if (byteArray instanceof ArrayBuffer) {
   		const typedArray = new Uint8Array(byteArray);
	    typedArray.forEach(byte => {
	        RX0FIFO.byteArray.push(byte);
	    });  	 
	    byteCount=byteArray.byteLength
	} else if (byteArray instanceof Uint8Array) { 
	 	byteArray.forEach(byte => {
	        RX0FIFO.byteArray.push(byte);
	    });      
  	    byteCount=byteArray.byteLength
	} else {
		byteArray.forEach(byte => {
	        RX0FIFO.byteArray.push(byte);
	    });      
  	    byteCount=byteArray.length
	}
	RX0FIFO.calcByteRate(byteCount);
} //Channel for receiving data and monioting data flow

RX0FIFO.pop=function(){
	var ret=RX0FIFO.byteArray[0]
	RX0FIFO.byteArray= RX0FIFO.byteArray.slice(1) 
	return ret;
}

RX0FIFO.PopTerminatedString=function(){
	var data=RX0FIFO.byteArray
	var pos=data.indexOf(0);
	if (pos<0) return false;
    var str = bytesToStringPrintable( data.slice(0, pos))
    RX0FIFO.byteArray=data.slice(pos+1);	//Remove 
    return(str)
}

RX0FIFO.getByteRate=function(){		//Get baud rate in bytes/sec
	return `Speed: ${RX0FIFO._byteRate.toFixed(2)} bytes/ms`;	
}

RX0FIFO._byteRate = 0;
RX0FIFO._history=new Array(50).fill(0);
RX0FIFO._lastTimestamp = performance.now();
RX0FIFO.calcByteRate=function(byteCount){
	if (byteCount==0) debugger
	RX0FIFO.byteCount+=byteCount
	var currentTime = performance.now();		//Microseconds better than milis()
	if (currentTime>(RX0FIFO._lastTimestamp+5000)){
		RX0FIFO._byteRate=RX0FIFO.byteCount/(currentTime-RX0FIFO._lastTimestamp)
		RX0FIFO.byteCount=0;
		RX0FIFO._lastTimestamp =currentTime;
	}
}
RX0FIFO.count=function(){
	return RX0FIFO.byteArray.length;
}

/*********** FIRMWARE specific COMMUNICATION PREAMBLE CONSTANTS    ********************/
var konst = {
    // Communication preamble constants specific to firmware
    kMessage:   62,  // '>' passing   textmessage as non-printable terminated string (/r,/n)
	kHandshake: 104, // 'h' 0x68 - Indicates waiting for the protocol to settle and get firmware version info in return
	kCommInit: 	101, // 'e' 0x65 - Indicates a request to initialize protocol and send request to target (R170314)
	kSetReq: 	102, // 'f' 0x66 - Indicates client write to device memory
	kGetReq: 	111, // 'o' 0x6f - Indicates request to read variable from server; this will increase a pointer in the target causing a send of the variable
	kErrMsg: 	113, // 'q' 0x71 - A string of error messages will follow
	kSend32Bit:	232, // 'è' (0xE8) - 32bit (4byte) data format is transmitted
};


var cmdInput=document.getElementById("idSerialMonitor")
AddHistory(cmdInput,sendCmd);
/*
document.getElementById("idSerialMonitor").addEventListener("keyup", async function (event) {
	var cmd
    if (event.keyCode === 13) {
    	event.preventDefault();
    	cmd=this.value
        Cmd_sendSerialLine(cmd);
        mMessage('<'+cmd)
        jMainLoopProcessing()
    } 
})
*/
function sendCmd(cmd){
	if(!cmd) {
		cmd=cmdInput.value
		cmdInput.value=''
	}
    Cmd_sendSerialLine(cmd);
    mMessage('<'+cmd)
    Main_Loop()
}

function ChannelSaveType(){
	localStorage.CommLink=CommLink.type
}
function SerialAvailabilityCheck(){
	if ('serial' in navigator){ 
		return true;
	} else {
		if('http:'==location.protocol){
			alert("Requires HTTPS protocol, redirecting")
			location.href=location.href.replace("http:","https:")
		} else {
			alert("The connection is not available on this device")
		}
	}
}
function ConnectViaBTC(){	//This is actually a serial port connection
	if (SerialAvailabilityCheck()) {
	  CommLink=new BTClassic(); 
	  CommLink.start()
	  ChannelSaveType()
	}
}
function ConnectViaUSB(){	//A serial port connection
	if (SerialAvailabilityCheck()) {
	  alert("Select something like USB serial")
	  CommLink=new BTClassic(); 
	  CommLink.start()
	  ChannelSaveType()
	} 
}



function ConnectViaWebSocket(){
	var IPAddr=ESP_IPAddr()
	IPAddr=ESP_IPAddr()
	CommLink=new Socket(); 
	debug.msg(1,"WebSocket starting")
	CommLink.start();//Channel_Start()
    ChannelSaveType()
}

function Channel_Start(callback){  //Used by buttons to start a communication
	var callback=function (data){debug.msg(data)}
	debug.msg(0,"connection starting")
	if(isWebViewViaApp()){
		CommLink=new BTViaWebView(); 
	} else 	if(!CommLink.type) {
		if(localStorage.CommLink==BTClassic.type){
			ConnectViaBTC()		
		} else {
			ConnectViaWebSocket()
		}
	}else if (CommLink.isConnected()){
		CommLink.closeMe();
	} else {
		CommLink.start(callback) // mWebSocketStart BlueToothClassic_Start
	}
	setTimeout(requestRedraw,2000);
	Main_Loop(true)
}

function Channel_SendData(data,callback){	//Universal connection to sending data
	if (!CommLink.sendData) debugger
	CommLink.sendData(data,callback)
}

function Channel_ReceiveData(byteArray){ //Universal connection to receive data
    if(typeof byteArray=='string'){
    	//Treat as a textmessage
       	var s=byteArray
        if (s[0]=='>'){   //Msg2Client was sent from ESP
        	debug.msg('ESP'+s);
        } else if (s.startsWith('113')){   //Msg2Client was sent from ESP
            debug.msg('ESP>:'+s.substr(3));
        } else {
            debug.msg(">RESPONSE: '" + s );
        }
   	} else {
    // Push each byte from byteArray into RX0FIFO.byteArray
   		RX0FIFO.push(byteArray)
   	} 
   	//Data will be decoded in the DoTransmissions
}
function RXDataDecode(){
	/*	Decode of data from device via CommLink (websocket/BT/serial etc) 					
	*/
    if (RX0FIFO.count() < 1) return false	//Only on data
    var ret=false;
    var kmd = RX0FIFO.byteArray[0];// Extract the command byte from the byteArray
    var bufcount=RX0FIFO.count()
    // Decode commands if possible
    switch (kmd) {
        case konst.kHandshake:
            ret=HandshakeRcv(RX0FIFO);
            protocol.state.kHandshake=ret
            requestRedraw()
            break;
        case konst.kCommInit: 					//This repeats for each exposed variable
            ret=jCommInitRcv(RX0FIFO);
            protocol.state.kCommInit=ret
            protocol.state.ready=ret
            requestRedraw()
            break;
    
        case konst.kGetReq: 		//Backwards compatibility
        case konst.kSend32Bit: 		//Alternative Readback 
        case konst.kSetReq: 		//A Get is answered by a Set to client
            var ret = SetReqRcv(RX0FIFO);
            protocol.state.ready=ret
            break;
        case konst.kErrMsg:   //An subsystem message
        	var data=RX0FIFO.byteArray
        	if (bufcount<3||data[1]>bufcount-2) return false; //Pack not ready yet
        	var nBytes=data[1]
        	var str = bytesToStringPrintable( data.slice(2, nBytes))
        	mMessage(str)
        	debugger
        	RX0FIFO.byteArray=data.slice(nBytes+2);	//Remove cmd,length,payload
        	return false
        case konst.kMessage:   //An \r\n\; terminated string
			var str = RX0FIFO.PopTerminatedString();
			if(str){
				mMessage(str);
        		ret=true
			} else {			//Wait for transmission to complete or timeout
				setTimeout(DoTransmissions,500)
			}
        	break;
        default:
            // This should not happen but if data gets scrambled it does, let watchdog take care
            mMessage("*****ERRROR*****");
        	var data = RX0FIFO.byteArray;
            mMessage(bytesToStringPrintable(data));
            RX0FIFO.byteArray = [];
            ret= false;
            break;
    } //END SWITCH

	// Check and handle watchdog timer
    if (jWatchDog(0,ret)) {  // Packet processed or processing
        return ret;
    } else {
        debug.msg('---Protocol Timeout---');
        var str = bytesToStringPrintable(RX0FIFO.byteArray)
        mMessage(str)
		RX0FIFO.byteArray = [];
    	jWatchDog(0,true)	//reset the timeout
        return false;
    }

    function jCommInitRcv(RX0FIFO){
		/*Register element in protoco as 'oProtocol.oData.oProtElemVar'
		    A konst.kCommInit is encountered - create a new element
		    and decode data as element name 'VarName','nVarId','nDataLength','nVarType'
		    serial element is : cmd[byte],len[byte],sElementName[len*byte],bVarId[byte],bDataLength[byte],bVarType[byte]
			  Requires stringlength+4 bytes
		*/
			var byteArray=RX0FIFO.byteArray
			if (byteArray[1]+5>RX0FIFO.count()) return false; //Pack not ready yet
				var idx=1;
				var nBytes=byteArray[idx]; //Length of element name
				var sVarName=''
				for ( idx=2;idx<nBytes+2;idx++) {
					sVarName=sVarName+ String.fromCharCode(byteArray[idx])
		        }
		        if(!isValidCVariableName(sVarName)) return false;
				var VarId=byteArray[idx++]
		
				var oProtElemVar={ VarName: sVarName, nVarId: VarId }
				oProtElemVar.nDataLength=byteArray[idx++];//Length of data array
				oProtElemVar.nVarType=byteArray[idx++];//Length of data array
				oProtElemVar.Vector=Array(oProtElemVar.nDataLength).fill(0);      //Create vector it not preinitialized in setup sFileName
	//Get an element slot in the protocol		
				var oVarData=protocol.NewVarElement(oProtElemVar);	//Register the element in the protocol and get a refernce to the protocol element
				oVarData.Connected(VarId)
				//Pop FIFO
	 			RX0FIFO.byteArray=byteArray.slice(idx);	//Remove cmd & payload
	 			jDebugMsg1(0,"Registered:"+sVarName);
	 		return true		
	}

	function HandshakeRcv(RX0FIFO){
		if (RX0FIFO.count()<2) return false
		var data=RX0FIFO.byteArray
		if (data[1]>RX0FIFO.count()-2) return false; //Pack not ready yet
		var nBytes=data[1]
		var str="";
		for (var i=0;i<nBytes;i++) {
			var chr=String.fromCharCode(data[i+2])
			str= str+ chr
	    }
		protocol.sFirmwareInfo(str);
		debug.msg(protocol.sFirmwareInfo())
		//Pop FIFO
		RX0FIFO.byteArray=data.slice(nBytes+2);	//Remove cmd,length,payload
		return true
	}

	function GetErrMsg(RX0FIFO){	//Receive an error message
		var data=RX0FIFO.byteArray
		if (data[1]>data.length-2) return false; //Pack not ready yet
		var nBytes=data[1]
		var str="";
		for (var i=0;i<nBytes;i++) {
			var chr=String.fromCharCode(data[i+2])
			str= str+ chr
	    }
	    debugger
		RX0FIFO.byteArray=data.slice(nBytes+2);	//Remove cmd,length,payload
		return true
	}

	function SetReqRcv(RX0FIFO){   
	//The response to sending konst.kGetReq to 
		//cmd,id,bDataLength,bataLength*data
		//Requires stringlength+4 bytes
		var byteArray=RX0FIFO.byteArray
			if (6>byteArray.length){ //Insufficient length return false wait for more data or timeout
				return false; //Pack not ready yet, minimum pack is cmd,id,data = 6bytes
			} 
			var idx=1;
			var data=[];
			var nId=byteArray[idx++];		//Identfier
			var nBytes=byteArray[idx++]; //Length of data array
			if (3+(4*nBytes)>byteArray.length) return false; //Pack not ready yet, minimum pack is cmd,id,data = 6bytes

			for (var i = 0; i< nBytes; i++) {   //Perform bitwise or with the data shifted
				var b=[]
				b.push(byteArray[idx++])
				b.push(byteArray[idx++])
				b.push(byteArray[idx++])
				b.push(byteArray[idx++])
				data.push(utils.ByteArray2Long(b))
			}
			var sVarName=protocol.getVarNameById(nId)
			var oVarData=protocol.ProtElemByName(sVarName)
			if (oVarData) {
		      oVarData.SetVector(data); //Not PokeVector
			}
 
			//Pop FIFO
			RX0FIFO.byteArray=byteArray.slice(idx);	//Remove cmd & payload
	  	return true		
	}
};


 
function Cmd_sendSerialLine(cmd){	//Send the command line to the device
	var cmd=cmd.trim();
	let asciiArray = cmd.split('').map(char => char.charCodeAt(0));
	if(CommLink.type==BTClassic.type){
		CommLink.sendData(asciiArray)
	} else if (CommLink instanceof BTViaWebView){
		CommLink.sendData(asciiArray)
	} else if (CommLink.type==Socket.type){
		CommLink.sendData(asciiArray)
	} else {
		ESP_HTTPSendCommand(cmd)
		debugger
	}
}
 

/*			COMMUNICATION INTERFACE 				*/
  


//----------------------   SERVER
var oRetData={};	//Create a permanent copy

//	****************************	SERVER INTERFACE	***************


function HandShakeSend(){
	if(CommLink.isConnected()){
		debug.msg(0,'Handshake sent, expecting Firmware ID & Compiledate');
		protocol.sFirmwareInfo('Handshaking');
		var data=[]
		data.push(konst.kHandshake);
		Channel_SendData(data);
	} else {
		mMessage("Please open channel")
		HTTP_Ping(ESP_IPAddr(),jDebugMsg);
	}
}



function CommInitSend(){		//Sending a request to the 
	if(CommLink.isConnected()){
		debug.msg(0,'CommInitSend');
		protocol.ProtReset()	//Resetting the protocols memory status
		var data=[]
		data.push(konst.kCommInit);
		Channel_SendData(data);
	} else {
		mMessage("Please open channel first")
	}
}








