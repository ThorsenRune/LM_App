/*	File:widgets.js - lm_webapp
	Handling widgets abstraction layer for the protocol

	a WX has 
	1. Redraw -	Initialize and redraw the widget
	2. Update	-	Update widget with VarElement
	3. Commit	- Callback to write value to VarElement
    Governed by seting .VarName
*/
"use strict"; //declare vars
const Widgets = {
  WXList: [], // List of all widgets

  GetWidgetById(WxId) {
    if(this.WXList[WxId]){
      return this.WXList[WxId];
    } else {    //Just register it as an available GUI element
      this.WXList[WxId]= new _ProtWidget(oProtocol, WxId);;
    }
    return this.WXList[WxId];
  },

  ResetWidgets() {
    // Initialize the protocol with ProtWidget instances
    this.WXList=[]
    const widgetIds = Object.keys(oProtocol.oData.wx);
    for (let i = 0; i < widgetIds.length; i++) {
      const WxId = widgetIds[i];
      if (!this.WXList[WxId]) {
      	this.WXList[WxId] = new _ProtWidget(oProtocol, WxId);
      }
      var oWX = this.WXList[WxId];
      oWX.VarName(oWX.VarName())	//Realign to protocol element
    }
  },

  AssignWidget(WxId,sVarName) {
    /* Assign (create new if needed) VarName to widgets
        NOTICE - there is a risk of orphaned objects VarObj that are not aligned to WXList
    */
    if (!sVarName) return Widgets.DeleteWidget(WxId); 
    this.WXList[WxId] = new _ProtWidget(oProtocol, WxId);
    if(this.WXList[WxId]._WX!=oProtocol.oData.wx[WxId])debugger
    this.WXList[WxId].VarName(sVarName);  //Assign the var element
    setTimeout(requestRedraw,2000);
    return this.WXList[WxId];
  },

  DeleteWidget(WxId) {
    // Delete a widget
    if (this.WXList[WxId]) {
      delete this.WXList[WxId];
      console.log(`Widget with ID ${WxId} deleted.`);
    }
  },
  
  ActiveWidget(){ //Return the current active widget id
    return display.ActiveWidget.id
  }
};

// Helper for GetWidgetById
function _ProtWidget(oProtocol, idWX) {
  // Ensure the widget is defined in settings
  var MyObj = {};         //The return object getters/setters for protocol elements
  MyObj.Type = "_ProtWidget:" + idWX;
  if (!oProtocol.oData.wx[idWX]) {
    oProtocol.oData.wx[idWX] = { varname: "", Index: 0, Range: [0, 100] };
  }
  const oWX = oProtocol.oData.wx[idWX]; // Object in control settings
  oWX.id = idWX; // Ensure id
  var oVarObj = protocol.ProtElemByName(oWX.varname);
  MyObj._WX=oWX;
  function AssignProperties(oVarObj) {
    if (oVarObj) {
      MyObj.Alias = oVarObj.Alias;
      MyObj.Units = oVarObj.Units;
    
      MyObj.WidgetElement = null //Get set the visible HTML element of the widget

      MyObj.VarObj = oVarObj;
      MyObj.PeekData=oVarObj.PeekData
      MyObj.PokeData=oVarObj.PokeData
      MyObj.VarId=oVarObj.VarElem.nVarId
      
      MyObj.UnitArray=oVarObj.UnitArray //Scaled data//240620
      MyObj.UnitValue=oVarObj.UnitValue//240620
      MyObj.RawArray=oVarObj.RawArray   //Raw data//240620
      MyObj.RawValue=oVarObj.RawValue//240620

      MyObj.Window=document.getElementById(idWX).closest('.clsWindow')
      MyObj.active=function(NewValue){  //A widget can be active listening to data 
        if(MyObj.Window.classList.contains('minimized')){
          return false        //If it is minimized no need to update
        } else {
          return true
        }
      }
      MyObj.WidgetValue = function (NewValue) {
        const idx = MyObj.Index || 0;
        return oVarObj.UnitValue(idx,NewValue)
      };
      MyObj.WidgetRawValue = function (NewValue) {
        const idx = MyObj.Index || 0;
        return oVarObj.RawValue(idx,NewValue)
      };
    }
  }


  MyObj.VarName = function (NewVarName) {
    if (NewVarName !== undefined) {
      oWX.varname = NewVarName;
      oVarObj = protocol.ProtElemByName(NewVarName);		//Align widget varname with ProtocolElement Variable by name
      AssignProperties(oVarObj);
    }
    return oWX.varname;
  };
  AssignProperties(oVarObj); // Initial assignment of properties
  MyObj.WidgetId = function(){return idWX};

  MyObj.hasFocus = function () {
    const b = display.ActiveInput === MyObj.myElement;
    return b;
  };
  MyObj.Range = function (aNew) {
    if (aNew !== undefined) {
      oWX.Range = [Math.round(aNew[0]), Math.round(aNew[1])];
    }
    return oWX.Range||[-32000,32000];
  };
  MyObj.VectorIndex = function (idx) {
    if (idx !== undefined) oWX.Index = idx;
    return oWX.Index;
  };

  MyObj.Visibility =function (bVisible){
    if(!MyObj.WidgetElement) return false;
    var WidgetElement=MyObj.WidgetElement
    if (WidgetElement) return false;
    if(bVisible!== undefined){
      if(MyObj._WX)MyObj._WX.visible=bVisible
      if (bVisible)      WidgetElement.style.display=''
      else               WidgetElement.style.display='none'
    }
    return WidgetElement.style.display!='none'
  }


  MyObj.InputElem = function (inputElem) {
    if (inputElem !== undefined) {
      inputElem.onFocus(function (value) {
        jFocus(inputElem);
      });
      MyObj._inputElem = input;
    }
    return MyObj._inputElem;
  };
  MyObj.InputConfirm = function () {
    const data = MyObj.input.value;
    const vector = utils.String2Array(data);
    MyObj.RawArray(vector);
    MyObj.PokeData(true)
  };
  MyObj.WidgetRefresh = function (callback) {
    if (callback) {
      MyObj.RefreshFunction = callback;
    }
    if (display.ActiveInput === MyObj.input) return;
    if (MyObj.RefreshFunction) {
      MyObj.RefreshFunction();
    }
  };
  MyObj.WidgetRedraw = function () {
    debugger
    // Redraw logic
  };
  MyObj.hasFocus=function(){
    var ret=(Widgets.ActiveWidget()==idWX)
    return ret;
  }
  return MyObj;
}
