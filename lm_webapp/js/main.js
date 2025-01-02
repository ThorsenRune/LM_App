/*	File:main.js
	This is the main entrypoint
*/
'use strict';	//Require variable declarations
document.addEventListener("DOMContentLoaded", jMain_Init);
var App=App||{}
App.ServerURL="%BASEPATH%/lm_webapp/index.php"
/*
DOMContentLoaded->jMain_Init
	->StartProtocolProcessing  //Setup
	->Main_Loop 
		Display_Redraw2
		DoTransmissions
	->Main_Loop

*/

function Button_UseServer(){
	var btn=document.getElementById('idUseServer')
	if (location.href.includes(App.ServerURL)){
		btn.hidden=false
	}else{
		btn.hidden=true
	}
	btn.onclick=function(){
		location.href="https:"+App.ServerURL
	}
}
	function togglePlainParameter() {	//serve unencrypted or Secure (HTTP/HTTPS)
    // Get the current URL
    const url = new URL(window.location.href);
    
    // Get the search parameters
    const params = new URLSearchParams(url.search);
    
    // Toggle the 'plain' parameter
    if (params.has('plain')) {
        // If 'plain' exists, remove it
        params.delete('plain');
    } else {
        // If 'plain' does not exist, add it
        params.set('plain', 'true');
    }
    
    // Update the URL with the new parameters
    url.search = params.toString();
    
    // Navigate to the new URL
    window.history.replaceState({}, '', url.toString());
}

/***********************	INITIALIZATION		***********************************/
function jMain_Init() {
    if (typeof display === 'undefined') return;
   	display_init(); // display_init 
//    APP.DefaultLayout();
    Button_UseServer();
    WindowActiveElementListener()
    AutoselectOnFocus(document)
    jWidgetFocusListener(document)
    APP.ProtFileName = utils.GetDataFileName(); 
    mDataExchange('load', callback);
    jWindows.windows_init()				//Setup the windows system

    function callback() {
//        Channel_Start();
        setTimeout(Main_Loop, 3000);
    }
}
App.StartLMProtocol=function(){
	setTimeout(HandShakeSend, 500);
	setTimeout(CommInitSend, 1000);
    setTimeout(function(){        
	Main_Loop(true)
    } , 3000);
}
/***********************	MAIN PROCESSING		***********************************/
 

let intervalId; // Declare intervalId outside the function
var Main_Loop = function(bRunning) { //Setup the loop, must be user initiated
  bRunning=protocol.isRunning(bRunning)     //Update the running state if bRunning is given as param
  if (intervalId){	//Clear previous interval
  	clearInterval(intervalId);
  	intervalId=null;
  }
  if (bRunning) { // Start looping interval
    var refreshRate=Number(protocol.state.currentSpeed)
    if(refreshRate<60) refreshRate=2000
    intervalId = setInterval(jMainLoopProcessing, refreshRate);
  } else {	//send-return cycle)
    DoTransmissions( );
    Display_Redraw2(true);
    setTimeout(jMainLoopProcessing, 200);
  }
	function jMainLoopProcessing(){			//This is the looping processes
		DoTransmissions( )
		DoAppDebugTests();
		Display_Redraw2(protocol.state.doRedraw)
	}      
};

 

function jServerFile(){
    /*  Dispatch the update of the protocol data
        //mode=='swap' , will exchange data through the server
    */
   // oProtocol.mDataExchange('swap');
    //oProtocol.mDataExchange('save');
    if(oProtocol.DataLoad) oProtocol.mDataExchange('load'); 
}

 
function Millis(){
	return Date.now()
 }
