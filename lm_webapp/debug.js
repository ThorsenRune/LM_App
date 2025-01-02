/*	file:debug.js
 	DEBUGGING FUNCTIONS 
	compagnion of debug.php
    debug.ChangeLevel toggles the bit for the debugging level
    bit:0  -  always
    bit:1  -  Verbose information
    bit:2-16  Selector for 
*/
var debug = debug || {};	//Instantiate a debug element
debug.DebugLevel =0;
document.addEventListener('DOMContentLoaded', function(){
	//On document ready plugin the debugger
	debug.disp=idDebugText;
	logConsoleErrorsToDocument();
});

debug.autscroll=true;
debug.msg= function (level, message) {
    if(!message) return (jMessage(level)); //only message was given
    if (debug.IsDebug(level)) {
        jMessage(message);
        if (level&&debug.IsDebug(1)) debugger
    }
    function jMessage(txt,clear){
        var el=idDebugText;
        if (clear) el.value='';
        el.value=el.value+txt+"\n";
        el.scrollTop = el.scrollHeight;
    }
}

/*
if (localStorage.debuglevel){
    debug.DebugLevel = localStorage.debuglevel;  // Verbosity level for debugging messages
}
*/
debug.ChangeLevel=function (ToggleBit) {
    let bitNumber = parseInt(ToggleBit);
    if (bitNumber > 0) {
        // Create a mask with only the bit at 'bitNumber' position set
        let mask = 1 << (bitNumber - 1);
        // Toggle the bit using bitwise XOR operation
        debug.DebugLevel ^= mask;
    }
//    console.log(formatAsBinary(debug.DebugLevel));
    debug.msg(0,formatAsBinary(debug.DebugLevel))
    localStorage.debuglevel=debug.DebugLevel
    return debug.DebugLevel;
}  //Change the debugging bitpattern by toggeling the bit
debug.IsDebug=function(bitNumber) {
    if (bitNumber === 0) {
        return true;  // Return true if bitNumber is zero
    }
    // Create a mask with only the bit at 'bitNumber' position set
    let mask = 1 << (bitNumber - 1);
    // Perform bitwise AND operation to check if the bit is set
    return (debug.DebugLevel & mask) !== 0;
} //Check debug level

 



 

/***************	END OF MAIN DEBUGGING FUNCTIONS **********************/

function logConsoleErrorsToDocument() {
    // Create a function to handle errors
    function handleError(message, source, lineno, colno, error) {
        // Create a new error message
        var errorMessage = "Error: " + message + " in " + source + " at line " + lineno;
        debug.msg(0,errorMessage);
    }
	// Assign the error handler function to the window.onerror event
	window.onerror = handleError;
}


 
 
debug.IdInfo=function addIdsToTitles() {
  const elements = document.querySelectorAll('*');
  
  elements.forEach(element => {
    const id = element.id;
    if (id) {
      element.setAttribute('title', id);
    }
    element.addEventListener('dblclick', function(event) {
	  // Get the target element
	  const target = event.target;

	  // Extract the first 30 characters of the outerHTML
	  const textToCopy = target.outerHTML.substring(0, 30);
	  debug.Text2Copy(textToCopy)
	});
  });
}

 
debug.Text2Copy=function(textToCopy){
	  // Create a temporary textarea element to copy the text to clipboard
  const textarea = document.createElement('textarea');
  textarea.value = textToCopy;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);

  // Select and copy the text
  textarea.select();
  document.execCommand('copy');

  // Remove the textarea from the DOM
  document.body.removeChild(textarea);
}


debug.listProtocol=function(){
	debug.msg(0,"************Protocol");
	var Names=protocol.NameList();	//Get an array of protocol variables
	for (var i = 0; i < Names.length; i++){
		obj=protocol.ProtElemByName(Names[i])
		debug.msg(0,obj.VarId()+":"+obj.VarName()+" Source:"+obj.ConnectedDevice())
	}
}

function prot_Variables(oProt){	//Convert the protocol to an array
	return Object.values(oProt.oData.oProtElemVar);
}
 