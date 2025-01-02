/* File: settings.js
   GUI for setting protocol and pairing widgets
*/

/* For setting the information related to variable and widget */
//display.ActiveVar=jWidgetVarName('')
function Settings_Redraw(oProt){
    if(!oProt) oProt = oProtocol;
    VarSettingsShow();
}

function mDisp2Var(oProt){
    VarSettingsSet( );
}

function GetPane(){
    var MyWindow = document.querySelector('#idSettingsPanel');
    var idDisplaySettings = document.querySelector('#idDisplaySettings');
    idSettingsPanel = MyWindow;

    var pane = {
        isActive:true,
        VarName: MyWindow.querySelector('#idSetVarName'),
        Alias: MyWindow.querySelector('#idAlias'),
        RawValue: MyWindow.querySelector('#idRAWValue'),        // The integer value in firmware
        UnitValue: MyWindow.querySelector('#idValue'),          // The value in units
        Units: MyWindow.querySelector('#idUnit'),
        Factor: MyWindow.querySelector('#idFactor'),
        Offset: MyWindow.querySelector('#idOffset'),
    };
    if(MyWindow.minimized&&MyWindow.minimized()) pane.Active=false
    return pane;
}
/*
    Object.values(pane).forEach(function(element) {
        element.addEventListener('focus', function() {
            this.onchange = function(){ mDisp2Var() }
        });
    });
*/

function VarSettingsShow(sVarName) { 
    function callback(VarName){
        VarSettingsShow(VarName);
    }
    var pane = GetPane();
    lib.mFillDataList(pane.VarName, protocol.NameList());
    pane.VarName.onchange =function(){Settings_Redraw()}

    pane.Alias.onchange=function(){       VarSettingsSet()    }
    pane.RawValue.onchange=function(){       VarSettingsSet()    }
    pane.UnitValue.onchange=function(){       VarSettingsSet()    }
    pane.Factor.onchange=function(){       VarSettingsSet()    }
    pane.Offset.onchange=function(){       VarSettingsSet()    }
    pane.Units.onchange=function(){       VarSettingsSet()    }

    var idx = 0;
    var mVar = protocol.ProtElemByName(pane.VarName.value);
    if (!mVar) return null;
    updateValueIfNotFocused(pane.VarName, mVar.VarName());
    updateValueIfNotFocused(pane.Alias, mVar.Alias());
    updateValueIfNotFocused(pane.RawValue, mVar.RawValue(idx));
    updateValueIfNotFocused(pane.UnitValue, mVar.UnitValue(idx));
    updateValueIfNotFocused(pane.Units, mVar.Units());
    updateValueIfNotFocused(pane.Factor, mVar.Factor());
    updateValueIfNotFocused(pane.Offset, mVar.Offset());
    function updateValueIfNotFocused(element, value) {
        if(ActiveElement.INPUT==element) return;
        element.value = value;
    }
}

function VarSettingsSet(){
    var pane = GetPane(); // Settings elements
    var sVarName=pane.VarName.value
    var idx = 0;
    var mVar = protocol.ProtElemByName(sVarName);
    if(!mVar) return //No valid variable name
    mVar.Alias(pane.Alias.value);

    display.ActiveInput=ActiveElement.INPUT
    if(display.ActiveInput == pane.RawValue){
        mVar.RawValue(idx,parseInt(pane.RawValue.value))
         mVar.PokeData(true)
    } else if (display.ActiveInput == pane.UnitValue){
        mVar.UnitValue(idx,parseInt(pane.UnitValue.value))
        mVar.PokeData(true)
    }

    mVar.Units(pane.Units.value);
    mVar.Factor(Number(pane.Factor.value));
    mVar.Offset(Number(pane.Offset.value));
    VarSettingsShow(sVarName);
}

/**************** VARIABLE SELECTOR WIDGETS *******/

function jSetVarSelector(oProt, elemInput, ActionOnSelect){
    /* The dropdown variable name selector used by pWxVarSelector 
       Assign a protocol to a variable selector widget
       GUI Setup and debugging purpose
    */    
    var list = protocol.NameList();
    lib.mFillDataList(elemInput, list); // To GUI
    if(ActionOnSelect){
        elemInput.onchange = function(){
            display.activeElement = elemInput.value;
            ActionOnSelect(elemInput.value);
        };
    }
}

function jSetWidget(sVarName){
    /* Assign a Variable to the last selected Widget */
    if (!sVarName) return;

    var WidgetElement = display.ActiveWidget;
    if (WidgetElement){
        // Associate widget with VarName
        jWidgetVarName(WidgetElement, sVarName); // The control element holds the variable name
        requestRedraw();
    }
}

function jBindVar2Wx(){ // 240531
    /* Associate a variable to the widget */
    var sVarName = display.activeElement;
    var Wxid = display.ActiveWidget.id;

    if (Wxid && sVarName){
        if (confirm("Associate " + sVarName + " to " + Wxid)){
            var oWX = Widgets.GetWidgetById(Wxid);
            oWX.VarName(sVarName);
        }
    }
    requestRedraw();
}

function mVar2DropSel(ctrl, elemInput){ // Show the currently selected control
    /* Widget and Widget setup controller */    
    ctrl = ctrl.closest('[id]'); // Closest WX with an ID
    display.ActiveWidget = ctrl;
    prot.ActiveVar = jWidgetVarName(ctrl);
    elemInput.value = prot.ActiveVar;
    prot.ActiveWx = ctrl;

    if (!prot.ActiveWx.id) prot.ActiveWx = prot.ActiveWx.parentElement;
}

/**********************************************/

function APPLayoutTexts(){
    
}