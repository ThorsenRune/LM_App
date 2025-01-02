/*	File:display.js - lm_webapp
	Display updating functions
	mostly as callbacks

	1. Redraw 	-	Initialize and redraw the widget
	2. Update	-	Update widget with VarElement
	3. Commit	-  Write value to VarElement

*/
'use strict';	//Require variable declarations

var display=display||{};		//Entry Methods doing GUI update
var myWx=[] 
document.addEventListener("DOMContentLoaded", display.init);

function display_init(){
	display.idStatus	=window.idStatus;
	display.idDispMax	=window.idDispMax
	display.idDispMin	=window.idDispMin;
	display.idFactor	=window.idFactor;
	display.idUnit		=window.idUnit;
	display.idDescr		=window.idDescr
	display.idValue		=window.idValue
	display.idIdx		=window.idIdx
	display.idSettings  =window.idSettings
	display.idPopUp		=window.idPopUp
	display.idText		=window.idText
	display.idIdx=window.idIdx
	display.ActiveWidget=document.activeElement;			//Active control
	display.ActiveInput =null
	/*//-
	document.onkeydown=function(event){
		mKeyDown(event)
	}*/
	utils.persistDetailsState();
 
	return display
}

function Display_Redraw2(redraw){		//Redraw is a full redraw
	if(redraw||protocol.state.doRedraw){
		_redrawWindows()


		protocol.state.doRedraw=false
		display.showConnectionStatus(CommLink.isConnected())
		Widgets.ResetWidgets();	//Refresh widget references 
 		Settings_Redraw(oProtocol)
		WxSettingsDisplay() 		//Widget association settings		
		FileSelector_Redraw();
		//-devpanel.redraw();	//Redraw development panel
		myWx[0]=Widgets.GetWidgetById('WxBit')
		myWx[0].WidgetRedraw=BitEditor(myWx[0])
		myWx[1]=Widgets.GetWidgetById('WxBit2')
		myWx[1].WidgetRedraw=BitEditor(myWx[1])
		if (protocol.state.isConnected()){
			protocol.state.currentSpeed=Number(protocol.settings.refreshRate())
		}else {
			protocol.state.currentSpeed=2000;
		}
		redraw=true;		//Make sure to redraw controls
	} 
	Signals_Redraw2("wss1",redraw)
	Signals_Redraw2("wss2",redraw)
	Watches_Redraw2(redraw)
	Sliders_Redraw2(redraw)
	myWx[0].WidgetRedraw.redraw(redraw)
	myWx[1].WidgetRedraw.redraw(redraw)
	Display_Update();      //Update screen widgets and get userinput
	function _redrawWindows(){
		var idExpertMode=document.getElementById('idExpertMode')
		if(idExpertMode.minimized)
		App.ExpertMode=!idExpertMode.minimized()
		var idSettingsPanel=document.getElementById('idSettingsPanel')
		var idWidgetSettings=document.getElementById('idWidgetSettings')
		if(!App.ExpertMode) idSettingsPanel.style.display='none'	//Variable settings
		if(!App.ExpertMode) idWidgetSettings.style.display='none'	//Widget attachment settings
	}
}

function Display_Update(){			//Will refresh controls in the display
//	const sliders = Slider.getAllSliders(); // Get all slider instances
    if(idLoopCount){
    	idLoopCount.textContent=RX0FIFO.getByteRate()
    }
};//Updating the widgets

function requestRedraw(){	//Call this on a change of state
	protocol.state.doRedraw=true;
}  //Non blocking request

function FileSelector_Redraw(){
	var idFileSelector=document.getElementById('idFileSelector')
	if (idFileSelector){
		idFileSelector.value=APP.ProtFileName
	}
}

function mWidgetSet(sliderInstance,oWX) {
    if (!oWX){ 
    	debugger;
    	return
    }
    if (oWX.VarName()) {	//Check if a variable is assigned
        const r = oWX.Range();
        const u = oWX.Units(); // Unit text
        const l = oWX.Alias(); // Set the slider range in units
        sliderInstance.setRange(r, u, l);
//-        sliderInstance.setValue(oWX.WidgetValue());
        sliderInstance.onFocus(function(elem){
        	jFocus(elem)
        });
        sliderInstance.onInput(sliderChangeCallback);
        function sliderChangeCallback(value){	//User has slided
            oWX.WidgetValue(value);	
            oWX.PokeData(true)
        };
    }
}

/**
 * Attaches a focus event listener to all input elements within a given element.
 * @param {HTMLElement} element The container element to search within.
 */
function jWidgetFocusListener(element) {
    element.querySelectorAll('.clsWidget').forEach(widget => {
        // Add a focus event listener to each focusable element
        widget.addEventListener('click', function() {
                jFocusWidget(widget);
            });
        const elements = widget.querySelectorAll('input, textarea, select, button, [contenteditable]');
        elements.forEach(focusableElement => {
            focusableElement.addEventListener('focus', function() {
                jFocusWidget(widget);
            });
        });
    });
}

function jFocusWidget(ActiveWidget) {		//Highlight the widget
    if (display.ActiveWidget) {
        display.ActiveWidget.classList.remove('clsActiveWidget'); // Remove previous highlighting
    }
    if (ActiveWidget) {
        ActiveWidget.classList.add('clsActiveWidget');
        WxSettingsDisplay(ActiveWidget.id)
    }
    display.ActiveWidget = ActiveWidget;
}

function jFocus(element) {  // Call by selecting an element
	/*	Window - clsWindow				Widget window
		Widget - clsWidget				Widget input
		VarElem - clsVarElem			Element selector

	*/
    // Clear previous active states
    if (display.ActiveWidget) {  // Remove previous highlighting
        display.ActiveWidget.classList.remove('clsActiveWidget');
        jFocusInput(null);  // Clear active input
    }

    // Find the closest element with an ID
    var WXElement = element.closest('[id]');
    if (!WXElement) {
        WXElement = element.querySelector('[id]');  // Fallback to find any child element with an ID
    }

    // If we found a valid WXElement
    if (WXElement) {
        display.ActiveWidget = WXElement;  // Set the new active widget
//-        mVar2DropSel(WXElement, idVarName1);  // Update the variable selector
       
        // Set and highlight the new active widget
        display.ActiveWidget.classList.add('clsActiveWidget');

        // Find and set the active input within the widget, if it exists
        var inputElement = WXElement.querySelector('input');
        if (inputElement) {
            jFocusInput(inputElement);  // Highlight the input and set as active
        }

        // Set the active variable name for the new widget
        display.ActiveVarName = jWidgetVarName(WXElement);
    }

function jFocusInput(element) {
    if (display.ActiveInput) {  // Remove previous highlighting
        display.ActiveInput.classList.remove('clsActiveInput');
    }
    if (element) {  // Set highlighting
        element.select();
        element.classList.add('clsActiveInput');
    }
    display.ActiveInput = element;
}
}

function jWidgetVarName(ctrl,newname){	//Get/set  the varname of a control
	ctrl=ctrl.closest('[id]'); //Closest WX with an ID
	if (!ctrl) return ''
	var id=ctrl.id
	if (!id) debugger;
	var oWX=Widgets.GetWidgetById(id) ;
	if (newname!==undefined){		//A newname has been given
		if (!oWX) {	//Create widget data object if not defined
			oWX=Widgets.GetWidgetById(id);
		}
		//New association widget-variable
		Widgets.GetWidgetById(id).VarName(newname);
	}
	if (oWX&&oWX.VarName)	return oWX.VarName();
	return "VarName";
}

var mToggleRFMode=function(){
	bUseBluetooth(!bUseBluetooth());		//Toggle the current state of RF
	if (bUseBluetooth()) {
		mMessage('Switching to BT mode');
	} else {
		mMessage('Switching to WiFi mode');
	}
}

const popup={
	 mMessage:function(str){
		this.mShow(true,display.idText,mAccept)
		display.idSettings.hidden=true;		//Hide the settings window
		var e=document.getElementById('idText');
		e.readOnly=true									//Disable input, ie. no keyboard
		if (!e) alert('Missing message window');			//No message window present
		if (!str){e.value='';this.mShow(false)}			//191114 Close the window if message is null
		else e.value=str+'\n'+e.value ;// Show the command
		function mAccept(){
			e.value=''
		}
	}
 
	,mShow:function(bVis,elActive,callback){
		var that=this;
		if (bVis==false) {
			display.idPopUp.hidden=true
		}else if (display.idPopUp.hidden){
			document.onkeydown=function(event){mKeyDown(event)}
			window.idText.hidden=true;
			window.idSettings.hidden=true;
			window.idPopUp.hidden=false
			elActive.hidden=false
			elActive.focus()
			window.idTextClose.ontouchstart=
			window.idTextClose.onclick=function(){
				callback();
				that.mShow(false);
			}
		}
	}
}
var nSubCounter=10;
var mKeyDown=function(evnt){			//Envent handler for keyboard strokes
/*
	if (mIsVisible(idTextClose)){	//Close settings winndow on cancel
		if(evnt.keyCode==27)	idPopUp.hidden=true
	}
	*/
}

display.showConnectionStatus=function(bFlag){
	//Indicate the connection status
	var e=document.getElementById( "idStatus")
	if (bFlag){
		e.style.background='green'
		if (protocol.isRunning()) {
			e.textContent='<=> *'
		}else {
			e.textContent='<=>'
		}
	} else {
		e.style.background='red'
		e.textContent='Connect'
	}
}

 

 
function RunProtocol(enable) {
	protocol.isRunning(enable)
	Main_Loop(enable);
}//24-05-30

function Sliders_Redraw2(redraw  ) {	//Refresh and redraw (initialize) sliders 
    const sliders = Slider.getAllSliders();
    if (sliders.length === 0) return;

    display.WindowSliders = sliders[0].input.closest('.clsWindow');

    if (redraw) {
        sliders.forEach(sliderInstance => {
            const sId = sliderInstance.id();
            const oWX = Widgets.GetWidgetById(sId);

            //The widget is the container element of the input element
            oWX.WidgetElement=sliderInstance.input.parentElement
            if(!oWX.VarName())            oWX.Visibility(false);	//Hide unassigned sliders
            mWidgetSet(sliderInstance, oWX);

            if( oWX.VarName) sliderInstance.VarName = oWX.VarName;
        });
    }

    sliders.forEach(sliderInstance => {
        const sId = sliderInstance.id();
        const oWX = Widgets.GetWidgetById(sId);
        if (!oWX.VarName()) return;
        const value = oWX.WidgetValue();
        if (oWX.active()){
        	oWX.PeekData(true)
        }
        sliderInstance.setValue(value);
    });
}

function mAcceptRefreshRate(oProtocol){
	protocol.settings.refreshRate(idRefreshRate.value||480);
	requestRedraw()
}

function mShowRefreshRate(oProtocol,newrate){
	idRefreshRate.value=protocol.settings.refreshRate()||idRefreshRate.value;
}

