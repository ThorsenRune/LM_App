<?php
/*	file:widgets.php
	Layout file for the widgets used in this app
	Main section

	
*/

HTML_Head();
echo "<body>";
HTML_Heading();

HTML_wxConsole();

HTML_wxExpertWindow();

HTML_idSettingsPanel();

HTML_idWidgetSettings() ;

HTML_wxWatchWindow();

HTML_idVertSliders();

HTML_idSignal("wss1");

HTML_idSignal("wss2");

//HTML_idSettingsPanel();

//HTML_idWidgetSettings() ;

HTML_bitFlags('WxBit',$nModeFlags,'minimized');

HTML_bitFlags('WxBit2',$nErrFlags,'minimized');
?>
 



<?php 

echo "</body>";

function wxExpertWindow() {
    // Assign the HTML content to $s
    $s = '
        <div class="title">Expert Mode</div>
        <div>
            <button onclick="HandShakeSend()">Handshake</button>
            <button onclick="CommInitSend()">Init Protocol</button>
            <button onclick="debug.listProtocol()">Info</button>
            <button onclick="HTTP_Status()">Status</button>
        </div>';
    
    // Echo the HTML content
    return $s;
}


function HTML_Head(){		//echo HEADER HTML
?>
	<head>	
		<meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Proto WS RehApp LM</title>
	  <link rel="stylesheet" href="<?=ROOT?>./css/style.css">
		<link rel="stylesheet" href="<?=ROOT?>./css/slider.css">
		<link rel="stylesheet" href="<?=ROOT?>./css/popup.css">
	  <link rel="stylesheet" href="<?=ROOT?>./css/dark.css">  <!-- Selection of color theme -->
	</head>
<?php
}

function HTML_Heading(){		//echo Heading HTML
?>
		<section>
			<label id='idStatus' onclick="Channel_Start()" >disconnected</label>
            <button onclick="App.StartLMProtocol()">Start</button>
	
<?php
			//echo pWxVarSelector() ;
?>

      <input type="button" class='cRight' onclick="stackWindows()" title="Stack Window" value="🗗">
    </section> 
<?php
}

function HTML_Footer(){		//echo HEADER HTML
?>
 
<?php
}

function HTML_wxConsole() {
    // Assign the HTML content to $s
    $s = '<div class="clsWindow" id="idConsoleWindow">
        <div class="title">Console</div>
        <main>
            <span>
                <input type="text" class="left" id="idSerialMonitor"  
                       placeholder="Commands for the ESP (?;m2...) [ENTER]">
                <input type="button" class="right" 
                       onclick="sendCmd()" 
                       title="Commands for the ESP (?;m2...)" value="Send">
            </span>
            <textarea id="idDebugText" 
                      class="fullwidth" 
                      title="idText" 
                      placeholder="You will see debugger console messages here">
            </textarea>
        </main>
        <footer class="styButtonContainer">
            <button onclick="Channel_Start()">connect</button>
            <button onclick="App.StartLMProtocol()">Start</button>
            <button onclick="debug.listProtocol()">Info</button>
            <button onclick="idDebugText.value=null" class="scrollHeight">Clear</button>
        </footer>
    </div>';

    // Output the final HTML
    echo $s;
}

function HTML_wxExpertWindow() {
    // Capture the output of wxExpertWindow() into a variable
    $expertWindowContent = wxExpertWindow();
    $timer=wxTimingControl();
    // Assign the complete HTML content to $s
    $s = '<div id="idExpertMode" class="clsWindow">'
        . $expertWindowContent. "
        <div>
            <button onclick='Main_Loop(false);' >Step</button>
            <button onclick='Main_Loop(true);' >Run</button>
        </div>    "
        . '<input type="text" id="idFileSelector" class="fullwidth"
               onchange="APP.ProtFileName=this.value">'
        . '<div>
            <button onclick="mDataExchange(\'load\')">Load data</button>
            <button onclick="mDataExchange(\'save\')">Save data</button>
            <button onclick="mDataExchange(\'swap\')">Swap data</button>
            <button onclick="protocol_store(true)">Save Local copy</button>
            <button onclick="protocol_store(false)">Get local copy</button>
      
            <button hidden id="idUseServer" onclick="Use_Server();">Switch to Server</button>
            <button onclick="HTTP_Ping(ESP_IPAddr(), jDebugMsg);">PING</button>
            <button onclick="HTTP_DirectConnect()">Direct ESP Connect</button>
            <button onclick="ConnectViaWebSocket()">Websocket</button>
            <button onclick="ConnectViaBTC()">BT Classic (PC only)</button>
            <button onclick="ConnectViaUSB()">USB port (PC only)</button>
            <button><a href="serialterminal.html" target="_blank">USB Serial Terminal</a></button>
            <button onclick="protocol_store()" title="Load setup from localstorage (debugging)">Restore</button>
          </div>
           <footer class="styButtonContainer">
            <button onClick="Channel_Start()">connect</button>
            <button onclick="HandShakeSend()">Handshake</button>  
            <button onclick="CommInitSend()"> Start</button>
            <button onclick="debug.listProtocol()">Info</button>
            <button onclick="idDebugText.value=null" class="scrollHeight">Clear</button>
        </footer>';
        $s.=$timer;
        $s.='<label id="idLoopCount"  ></label>';

        $end='</div>'; // Close the outer div

    // Output the final HTML
    echo $s;
    $s='<select id="idWindowSelector"  >
            <option value="">Select a window</option>
      </select>';
    echo $s;

    echo $end;
}




 


function wxTimingControl(){
	$s=	'<label>Refresh Rate (ms)
	 	<input id="idRefreshRate" 
	 	type="number" 
	 	value="480"  
	 	step=10 
	 	onchange="mAcceptRefreshRate(oProtocol)">
		</label>
		';
	return $s;
}



function HTML_wxWatchWindow() {
    $s = '<div class="clsWindow minimized" id="idWatches">
        <div class="title">Watches</div>
        ' . pWxWatches(5) . ' <!-- Generate pWxWatch elements -->
        <footer class="styButtonContainer">
            <button onclick="Watches_Redraw2(true)">Ok</button>
        </footer>
    </div>';

    echo $s;
}

function HTML_idVertSliders() {
    // Capture the HTML content from 'sliders_vert.html'
    $slidersContent = generateRangeSliders(8);
    
    // Assign the complete HTML content to $s
    $s = '<div class="clsWindow" id="idVertSliders">
        <div class="title">Slider controls</div>'
        . $slidersContent .
    '</div>';

    // Output the final HTML
    echo $s;
}
function generateRangeSliders($count) {
    // Define themes to be used for the sliders
    $themes = [
        'theme1', 'theme2', 'theme3', 'theme4',
        'theme5', 'theme6', 'theme7', 'theme8'
    ];
    
    // Start building the HTML output
    $html = '<div class="stySliderBox">';
    
    for ($i = 1; $i <= $count; $i++) {
        // Determine the theme based on the slider index
        $themeBar = $themes[($i - 1) % count($themes)];
        $themeThumb = ($i % 2 == 0) ? $themes[1] : '';

        // Generate HTML for each slider
        $html .= '
        <div id="wvs' . $i . '" class="clsWidget range-slider" orient="vertical">
            <label>Label</label>
            <input type="range" orient="vertical" min="0" max="100" />
            <div class="range-slider__bar ' . $themeBar . '"></div>
            <div class="range-slider__thumb ' . $themeBar . '"></div>
        </div>';
    }
    
    // Close the outer div
    $html .= '</div>';
    
    return $html;
}

function HTML_idSignal($id) {
    // Capture the HTML content from pWxSignals("wss1")
    $signalsContent = pWxSignals($id);
    
    // Assign the complete HTML content to $s
    $s = '<div class="clsWindow" id="idSignal'.$id.'">
        <span class="title">Signal</span>'
        . $signalsContent .
    '</div>';

    // Output the final HTML
    echo $s;
}

function HTML_bitFlags($id,$nModeFlags,$class) {
    // Capture the HTML content from pWxBitEditor('WxBit', $nModeFlags)
    $bitEditorContent = pWxBitEditor($id, $nModeFlags);
    
    // Assign the complete HTML content to $s
    $s = '<div class="clsWindow $class" id="'.$id.'">
        <div class="title">Bit editor </div>'
        . $bitEditorContent .
    '</div>';

    // Output the final HTML
    echo $s;
}


function HTML_idSettingsPanel() {
    // Capture the HTML content from pWxVarSettings()
    $settingsContent = pWxVarSettings();
    
    // Assign the complete HTML content to $s
    $s = '<div class="clsWindow minimized" id="idSettingsPanel">
        <span class="title">Variable Settings</span>'
        . $settingsContent .
    '</div>';

    // Output the final HTML
    echo $s;
}

function HTML_idWidgetSettings() {
    // Capture the HTML content from pWxWidgetSettings()
    $widgetSettingsContent = pWxWidgetSettings();
    
    // Assign the complete HTML content to $s
    $s = '<div class="clsWindow minimized" id="idWidgetSettings">
        <span class="title">Widget Settings</span>'
        . $widgetSettingsContent .
    '</div>';

    // Output the final HTML
    echo $s;
}
 
?>

 