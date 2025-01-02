<?php
/*	File:settings.php
	Widgets handling the settings and associations between protocol and widgets
*/




function pWxVarSelector(){
	/*	Producing a protocol variable selector. 
		When you select a widget the variable name will apper here
		When you select a variable, it will be assigned to the widget. 
		*/
	$s='<input type="text" id="idVarName1" /
	 placeholder="VarName"  /
	 onclick="this.select()">
     <button onclick="jSetWidget(idVarName1.value)" 
     >Set Widget Variable</button>
     ';
	return $s;
}

function pWxIPSelector(){
	$s='<label>IP Addr</label> 
		<input type="text" id="uriWebSocketServer"  placeholder="Address reported in serial monitor"> 		
		<input type="button" value="Set IP and PING" onclick="ConnectViaWebSocket(\'uriWebSocketServer\')">';
	return $s;
}

function pWxVarSettings() {
    $s = '   
    <div class="form1">
        <small>Firmware variable name</small>
        <label>FW Var Name</label>
        <input id="idSetVarName" placeholder="Firmware Variable Name"><br>
 

        <small>Shown on the control</small>
        <label>Descriptive name</label>
        <input id="idAlias" type="text" placeholder="Alias">
        
        <small>FW units</small>
        <label>RAW Value</label>
        <input id="idRAWValue" type="number" placeholder="real number">
        <hr>
        <small>Zero of firmware data</small>
        <label>RAW Offset</label>
        <input id="idOffset" type="number"   placeholder="">

        <small>Conversion from raw firmware data to display values (units)</small>
        <label>RAW Factor</label>
        <input id="idFactor" type="number"   placeholder="">

  
        <small>In units</small>
        <label>Value</label>
        <input id="idValue" type="number" placeholder="real number">

        <small>Units of displayed values</small>
        <label>Unit</label>
        <input id="idUnit" type="text" placeholder="uV, mA etc">
    </div>

     <footer class="styButtonContainer">
        <button  onclick="Display_Redraw2(true);">Refresh </button>
        <button  onclick="mDisp2Var()">SET </button>
    </footer>
    ';
    return $s;
}

function pWxWidgetSettings() {
    $s = '
 
    <div class="form1">
        <small>Widget name</small>
        <label>Widget name</label>
        <input id="idWidgetId2" placeholder="Identificatore del widget">
      
        <label>Visible</label>
        <input type="checkbox" id="idWidgetVisibility" >

        <small>Firmware variable name</small>
        <label>FW Var Name</label>
        <input id="idVarName2" placeholder="Firmware Variable Name">

        <small>Which element in the vector to show</small>
        <label>Index</label>
        <input id="idIdx2" type="number" min="0" max="100"  >

        <small>In units</small>
        <label>Value</label>
        <input id="idValue" type="number" placeholder="real number">

        <small>Minimum and maximum value of the widget</small>
        <label>Range </label>
        <span  ">
            <label>min <input id="idDispMin2" type="number" step="100" placeholder=""></label>
            <label> max <input id="idDispMax2" type="number" step="100" placeholder=""></label>
        </span> 
    </div>
 
    <footer class="styButtonContainer">
        <button id="idRefreshSettings2" onclick="WxSettingsDisplay();">Show </button>
        <button id="idAutorange" onclick="AutoRange2();">Autorange </button>
        <button id="idSetSettings2" onclick="WxSettings_Apply();Display_Redraw2(true);">SET </button>
    </footer>
    ';
    return $s;
}

/*
    Widgets are of clsWidget

*/
$WatchId=0;
function pWxWatches($count) {
    $watches = '';
    for ($i = 0; $i < $count; $i++) {
        $watches .= _pWxWatch();
    }
    return $watches;
}
function _pWxWatch(){
    global $WatchId;$WatchId++;
    $s='<div id="watch'.$WatchId.'" 
        class="clsWidget" style="display: flex;">
            <input type="text" name="VarName" 
                placeholder="VarName" 
                >
            <textarea type="text" name="VarVal"    
                placeholder="comma separated values"
                value=""  style="flex: 1;"></textarea>
            <button name="ok">ok</button>
        </div>
        ';
    return $s;
}

 
function pWxSignals($wxId) {
 /*Uses a HEREDOC syntax (<<<HTML) to define a string containing the HTML markup for the signal panel.
Interpolates $wxId directly into the HTML using {} syntax, ensuring each signal panel has unique IDs and labels.
Returns the generated HTML string ($html), which can be directly echoed or embedded into other PHP scripts or HTML templates.
*/
    $html = <<<HTML
    <!-- Signal panel inserted by PHP -->
    <main id="{$wxId}" class="clsWidget signal">
        <div>
            <span id='idSignalLegend' class='cLeft'>{$wxId} Legend</span>
            <b class='SignalTitle'>Title {$wxId} </b>
            <span id='idMaxVal' class="right"> max </span>
        </div>

        <svg viewBox="0 0 100 2">
            <path id="idSignal" stroke="white" d="M0,1 L100,1"></path>
            <path id="idMidLine" stroke="black" d="M0,1 L100,1"></path>
        </svg>     

        <div  >
            <span id='idMinVal' class="right"> min </span>
        </div>
    </main>
HTML;

    return $html;
}
 



function pWxFileButtons(){
    $s='
<input type="text" id="idFileSelector" class="fullwidth"
    onchange="APP.ProtFileName=this.value"
>
<div>
    <button onclick="mDataExchange(\'load\')">Load data</button>
    <button onclick="mDataExchange(\'save\')">Save data</button>
    <button onclick="mDataExchange(\'swap\')">Swap data</button>
    <button onclick="protocol_store(true)">Save Local copy</button>
    <button onclick="protocol_store(false)">Get local copy</button>
    </div>
    <footer class="styButtonContainer">         
    </footer>';
    return $s;   
}