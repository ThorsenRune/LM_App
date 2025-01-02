/*  File: wx_settings.js */

// Function to encapsulate panel elements
function GetSettingsPanel() {
    var thisWindow = document.getElementById('idWidgetSettings');
    return {
        thisWindow: thisWindow.closest('.clsWindow'),
        idWidgetId2: thisWindow.querySelector('#idWidgetId2'),
        idVarName2: thisWindow.querySelector('#idVarName2'),
        idIdx2: thisWindow.querySelector('#idIdx2'),
        idValue: thisWindow.querySelector('#idValue'),
        idDispMin2: thisWindow.querySelector('#idDispMin2'),
        idDispMax2: thisWindow.querySelector('#idDispMax2')
        ,idWidgetVisibility: thisWindow.querySelector('#idWidgetVisibility')
    };
}

// Function to populate widget settings based on active widget
function WxSettingsDisplay(WxId,bApplyValues) {
    var p = GetSettingsPanel();
    if (p.thisWindow.passive) return
    var elWidgetSel=p.idWidgetId2
    var elVarNameSel=p.idVarName2

    // Populate dropdowns with available widget and variable names
    var widgetNames = Object.keys(Widgets.WXList);
    lib.mFillDataList(elWidgetSel, widgetNames);
    lib.mFillDataList(elVarNameSel, protocol.NameList());
    if(WxId){   //Set the widget selector value
        elWidgetSel.value=WxId
    } else { 
        WxId=elWidgetSel.value //Use current widget id if none is given
    }
    var oWX=Widgets.GetWidgetById(WxId)


    if(bApplyValues){
        oWX.Visibility(idWidgetVisibility.checked)
    }
    idWidgetVisibility.checked=oWX.Visibility();

    elWidgetSel.onchange=function(){
        WxSettingsDisplay(elWidgetSel.value)
    }

    // Populate fields with current values if widget is active
    if (oWX&&oWX.VarObj) {
        p.idWidgetId2.value =  oWX.WidgetId()||p.idWidgetId2.value
        p.idVarName2.value = oWX.VarName()||p.idVarName2.value ;
        p.idIdx2.value = oWX.VectorIndex() || '0';
        p.idValue.value = oWX.UnitValue(oWX.VectorIndex()) || '0';
        if(!p.thisWindow.passive)        oWX.PeekData(true)
        var range = oWX.Range();
        p.idDispMin2.value = range[0] || '0';
        p.idDispMax2.value = range[1] || '100';
    }
    elVarNameSel.onchange =function(){
        SetWxVarElement(elVarNameSel.value)
        Watches_Redraw2(true)
    }
    function SetWxVarElement(sVarName){    //  Set the variable of the WX by name
      if (!sVarName) return Widgets.DeleteWidget(WxId);  //Remove invalid widgets
       if(!protocol.ProtElemByName(sVarName)) return; //Only valid variable names
       var oWX=Widgets.AssignWidget(WxId,sVarName)
       protocol_store(true);
    } 
}

// Function to update widget settings based on form inputs
function WxSettings_Apply() {
    var p = GetSettingsPanel();
    var WxId = p.idWidgetId2.value;
    var sVarName = p.idVarName2.value;

    // Ensure the WxId and varName are valid
    if (!WxId || !sVarName) {
        console.error('Widget ID or Variable Name is missing.');
        return;
    }
    var oWX=Widgets.AssignWidget(WxId,sVarName)
    
    // Update the widget settings
    oWX.VarName(sVarName);

    var idx = parseInt(p.idIdx2.value, 10);
    if (!isNaN(idx)) {
        oWX.VectorIndex(idx);
        oWX.UnitValue(idx,parseFloat(p.idValue.value)) ;
        oWX.PokeData(true)
    }

    var minRange = parseFloat(p.idDispMin2.value);
    var maxRange = parseFloat(p.idDispMax2.value);
    if (!isNaN(minRange) && !isNaN(maxRange)) {
        oWX.Range([minRange, maxRange]);
    }
    WxSettingsDisplay(WxId,true)
    protocol_store(true);
    Display_Redraw2(true)
}


function AutoRange2() {
    var p = GetSettingsPanel();
    var wxId = p.idWidgetId2.value;
    // Retrieve the protocol element by variable name
    var oVarElem = protocol.ProtElemByName(p.idVarName2.value);
    var oWX = Widgets.GetWidgetById(wxId);
    if (!oWX) return
    if(!oVarElem) return
    var vector = oVarElem.UnitArray();oVarElem.PeekData(true)
    var Range=[0,1]
    Range[0]=vector.min()
    Range[1]=vector.max()
    // Retrieve the widget by ID from the form field
    // Set the widget's range to the calculated minimum and maximum values
    oWX.Range(Range);
    WxSettingsDisplay()
}