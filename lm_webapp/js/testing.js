//testing.js		only for testing purpose


var bRelay2Server=false;            //Flag. Send data to server for remote observation
var mode='';
var diff;                   //see flowchart above

var timing=[Date.now(), 0]
var decimate=3;


var elemVarSelector=document.getElementById('idVarSelector3')
//	todo:	Part of this is going to be a textinput widget

devpanel={}	;			//Panel for testing and Development
test={};			//Static variables for testing
var DebugLevel=0;


devpanel.redraw=function(){  
	jSetVarSelector(oProtocol,idVarSelector3)	//Update the dropdown variable selector
	mShowRefreshRate(oProtocol);
}

function testGetData(){
	var idValue=document.getElementById('idInput')
	var VarName=elemVarSelector.value.trim();
	var oElem=protocol.ProtElemByName( VarName)
	if(!oElem) return
	var VarId=oElem.nVarId
	if (oElem)	oElem.bPeekElem=true  //Correct way to request the variable
	setTimeout(function(){
		var s=utils.Array2String (oElem.GetVector())
		idValue.value=s;
	},1000);		
}
function testSetData(){
	var idValue=document.getElementById('idInput')
	var VarName=elemVarSelector.value.trim();
	var data=idValue.value.trim()
	var oElem=protocol.ProtElemByName(VarName)
	var VarId=oElem.nVarId
	var Vec=utils.String2Array(data);
	oElem.RawArray(Vec);	//Local copy of the set data
	oElem.PokeData(true)
	for (var i=0;i<Vec.length;i++){
		SetReqSend(VarId,Vec[i],i);
	}
	//mShowDropDownValue();
}
function testSwapData(){
	mDataExchange('swap')
}
function testLoadData(){
	mDataExchange('load')
}
function testSaveData(){
	mDataExchange('save')
}
function writeButton() {
	var a=idInput.value.split(',');
	for (var i=0;i<a.length;i++){
		var  senddata =parseInt(a[i])
		serial.send(senddata);
	}
}


var mMessage=function(txt,clear){
	return debug.msg(0,txt)
	var el=idDebugText;
	if (clear) el.value='';
	el.value=el.value+txt+"\n";
	el.scrollTop = el.scrollHeight;
}


var jDebugMsg=mMessage;
var jDebugMsg1=function(treshold,txt,clear){ //To replace jDebugMsg
	/*Display critical errors, stop if below a threshold
	Au:RT210128*/
	if (DebugLevel&&(DebugLevel<treshold)) debugger;		//Catch critical errors below given treshold
	var el=idDebugText;
	if (clear) el.value='';
	el.value=el.value+txt+"\n";
}
 
var mIsVisible=function(el){		//Determines if the widget is visible
	var vis=el.clientHeight>10
	return vis
}

function test_getHello(){
    HTTP_Request()
}

function generateSinewave(samples, periods, amplitude=300, phase = 0, offset = 500) {
  const signal = new Int32Array(samples); // Use   for efficiency
  for (let i = 0; i < samples; i++) {
    signal[i] = amplitude * Math.sin(2 * Math.PI * i * periods / samples + phase) + offset;
  }

  return signal;  // Return the generated signal data
}

test.phase=0
function DoAppDebugTests(){
	var obj=protocol.ProtElemByName('Art_signal')
	if (!obj){	//Create a new 
		debugger
		obj=protocol.NewVarElement({VarName:'Art_signal',nVarId: 200,nDataLength: 120 })
	} 
	var gain=protocol.ProtElemByName("Gain")
	var phase=test.phase++
	var amp=gain.RawArray()[0]
	var offset=amp;
	var periods=5;
	var vec=generateSinewave(120,periods,amp,phase,offset)
	obj.RawArray(vec)
} //Generate a signal
