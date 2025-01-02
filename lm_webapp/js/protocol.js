/*  File:protocol.js - lm_webapp
    object of the communication, its values
    The protocol as the data packages which can be exchanged with the device

VarDataObj: Stores information about individual data elements exchanged with the device, using variable names as keys.
variableDescriptors: Stores conversion factors and unit information for variables, using variable names as keys.
widgets: Stores references to HTML elements used to display the data, using widget IDs as keys.

    For the datastructure see: dataformat.html
-------------------
*/

"use strict"; //declare vars
// Memory spaces 
const DSP_ID_RANGE_START = 64; // '@' in ASCII
const DSP_ID_RANGE_END   = 90; // 'Z' in ASCII
const ESP_ID_RANGE_START = 97; // 'a' in ASCII
const ESP_ID_RANGE_END   =122; // 'z' in ASCII
var CommLink=CommLink||{isConnected:function(){return false}};     //Link for communication

const oProtocol={}  //The dataobject
 
const protocol = {  //The protocol functionality
  state:{         //Current status
    update(){     //Call when something may have changed protocol state
      if(protocol.state.isConnected()==false){ //Disconnected?
        protocol.state.kHandshake=false     //Need to handshake
        protocol.state.kCommInit=false      //Need to reset protocol
        protocol.state.currentSpeed=2000    //Slow update
      } else if (protocol.state.kHandshake==false){
        protocol.state.kCommInit=false      //Need to reset protocol
        protocol.state.currentSpeed=2000    //Slow update
      } else if (protocol.state.kCommInit==false){
        protocol.state.currentSpeed=Number(protocol.settings.refreshRate())
      }
    }
    ,isConnected() {       //A connection is live?
      if(!CommLink) return false
      return CommLink.isConnected(); // Always reflect the current state
    },
    kHandshake  :false,     //Handshake was ok, 
    kCommInit   :false,     //Variables have been exchanged
    ready       :false,     //No errors and protocol is running fine
    currentSpeed:2000,      //Slow refresh until running
    _running    :false      //Running state of the protocol
    ,doRedraw    :true      //Something has changed so redraw all
  }

  ,settings: {     //Setup and mode of operation
    refreshRate: function (aNew) {
      if (aNew !== undefined) oProtocol.oData.nPeriod = aNew;
      if(!CommLink) return 0;       //No communication made
      if( protocol.state._running)   return oProtocol.oData.nPeriod;  //Full running speed

    }
  ,sFileName   :'data.txt'     //Filename on the server
  ,Title:'Application name and version' //Default string overwritten by JSON data in setup file
  }

  ,sFirmwareInfo(NewValue){
    //Firmware information returned by the kHandshake
    if (NewValue){
      oProtocol.oData.sFirmwareInfo=NewValue
    }
    if(!oProtocol.oData.sFirmwareInfo) oProtocol.oData.sFirmwareInfo='Pending Info'     
    return oProtocol.oData.sFirmwareInfo;
  } 

  ,isRunning(enable){
    if (enable !== undefined) {
      protocol.state._running=enable
      requestRedraw()
    }
   // if (!protocol.state.ready) return false
    return protocol.state._running
  }
 
  ,oProtElems: {}, // The live list of enhanced protocol elements

  ProtElemByName(sVarName) {
    if (!this.oProtElems[sVarName]) {
      // Create a new ProtElemObj if it does not exist
      if (oProtocol.oData.oProtElemVar[sVarName]){
        this.oProtElems[sVarName] = new ProtElemObj(oProtocol, sVarName);
      }
    }
    return this.oProtElems[sVarName];
  },

  NameList() {
    return Object.keys(this.oProtElems);
  },

  ProtReset() {
    // Initialize the protocol with ProtElemVar instances
    // ALL registered variables
    const varNames = Object.keys(oProtocol.oData.oProtElemVar);

    this.oProtElems = {}; // Reset the oProtElems
    for (let i = 0; i < varNames.length; i++) {
      const varName = varNames[i];
      this.oProtElems[varName] = new ProtElemObj(oProtocol, varName); // The live list of enhanced protocol elements
    }
  },

  NewVarElement(oVarData) {
    const oProtElemVar = oProtocol.oData.oProtElemVar;
    const VarName = oVarData.VarName;
    const VarId= oVarData.nVarId
    // Delete old variable with the same name if it exists
    if (oProtElemVar[VarName]) {
      delete oProtElemVar[VarName];
      delete this.oProtElems[VarName]
    }

    // Delete old variable with the same ID if it exists
    const oldVarName = this.getVarNameById(VarId);
    if (oldVarName) {
      delete oProtElemVar[oldVarName];
      delete this.oProtElems[oldVarName]
    }

    // Add the new variable element to the protocol data
    oProtElemVar[VarName] = oVarData;
    oVarData = this.ProtElemByName(VarName);
    return oVarData; // Return the newly created variable element
  },

  getVarNameById(VarId) {
    if(!VarId) debugger //Check nVarId name
    const VarData = oProtocol.oData.oProtElemVar;
    for (const VarName in VarData) {
      if (VarData[VarName].nVarId === VarId) {
        return VarName;
      }
    }
    return null;
  },

  info: {
    source: {} // info[sVarName]
  }, // Local volatile data for processing
};

function ProtElemObj(oProt, VarName) {
  const MyObj = {};
  MyObj.Type = "ProtElemObj:" + VarName;
  let bConnected = false;
  var oVarElem = oProtocol.oData.oProtElemVar[VarName];
  var oVarDesc = oProtocol.oData.oVarDesc[VarName]||{};
  oProtocol.oData.oVarDesc[VarName]=oVarDesc; //Ensure existence
  MyObj.VarElem = oVarElem; // Just while debugging
  MyObj.VarDesc = oVarDesc;

  MyObj.VarId = function () {
    return oVarElem.nVarId;
  };

  MyObj.VarName = function () {
    return VarName;
  };

  MyObj.PokeData = function (NewValue) {
    if (MyObj.VarId() < DSP_ID_RANGE_START) return  false;   //Can't operate if not connected
    if (NewValue !== undefined) {
      oVarElem.bPokeElem = NewValue;
    }
    return oVarElem.bPokeElem || false;
  };

 
  MyObj.PeekData = function (NewVal) {
    if (MyObj.VarId() < DSP_ID_RANGE_START) return false;   //Can't operate if not connected
    if (NewVal !== undefined) {
      oVarElem.bPeekElem = NewVal;
    }
    return oVarElem.bPeekElem || false;
  };

  MyObj.Connected = function (NewValue) {
    if (NewValue !== undefined) {
      bConnected = NewValue;
    }
    let id = bConnected || 0;
    if (!id) {
      if (MyObj.VarId() < 20) id = MyObj.VarId();
    }
    if (!id) return 0; // Invalid
    if (id < DSP_ID_RANGE_START) return 1; // Local
    if (id < DSP_ID_RANGE_END) return 3; // DSP
    if (id < ESP_ID_RANGE_START) return 0; // Invalid
    if (id < ESP_ID_RANGE_END) return 2; // ESP
    return 0; // Invalid
  };

  MyObj.ConnectedDevice = function () {
    const bConnected = MyObj.Connected();
    if (bConnected === 0) return "undefined";
    if (bConnected === 1) return "Local";
    if (bConnected === 2) return "ESP";
    if (bConnected === 3) return "DSP";
  };

  MyObj.RawArray = function (NewVector) { //240620
    if (NewVector !== undefined) {
      oVarElem.Vector = NewVector;
    }
    return oVarElem.Vector;
  };  //Vector of unscaled data
  MyObj.RawValue = function (idx,NewValue) {//240620
    if(idx==undefined) debugger //Must be given
      if (NewValue !== undefined) {
            oVarElem.Vector[idx] = NewValue;
      }
      return  oVarElem.Vector[idx];;
  }; //Scalar

  MyObj.UnitArray = function (newVector) {
    const offset = oVarDesc.Offset;
    const factor = oVarDesc.Factor;
    if (newVector !== undefined) {
      for (let idx = 0; idx < newVector.length; idx++) {
        oVarElem.Vector[idx] = u2raw(newVector[idx], offset, factor);
      }
    }
    let unitVector = [];
    for (let idx = 0; idx < oVarElem.Vector.length; idx++) {
      unitVector[idx] = raw2u(oVarElem.Vector[idx], offset, factor);
    }
    return unitVector;
  };

  MyObj.UnitValue = function (idx,NewValue) {
    if(idx==undefined) debugger //Must be given
      const offset = oVarDesc.Offset;
      const factor = oVarDesc.Factor;
      if (NewValue !== undefined) {
        oVarElem.Vector[idx] =u2raw(NewValue, offset, factor);
      }
      return  raw2u(oVarElem.Vector[idx], offset, factor);
  }; //Scalar of scaled data
  
  MyObj.PokeVector = function (NewVector) {
    if (NewVector !== undefined) {
      oVarElem.Vector = NewVector;
      MyObj.PokeData(true);
    } else {
      debugger // Must have argument
    }
  };

  MyObj.GetVector = function () {
    return oVarElem.Vector;
  };

  MyObj.SetVector = function (NewVector) {
    if (NewVector !== undefined) {
      oVarElem.Vector = NewVector;
    } else {
      debugger // Must set with a value
    }
  };



  MyObj.Offset = function (s) {
    if (s !== undefined) oVarDesc.Offset = s;
    return Number(oVarDesc.Offset)||0;
  };

  MyObj.Factor = function (s) {
    if (s !== undefined) oVarDesc.Factor = s;
    return oVarDesc.Factor||1;
  };

  MyObj.Alias = function (aNew) {
    if (aNew !== undefined) oVarDesc.Alias = aNew;
    return oVarDesc.Alias;
  };

  MyObj.Units = function (s) {
    if (s !== undefined) oVarDesc.Unit = s;
    return oVarDesc.Unit;
  };

  function u2raw(value, offset, gain) {
    return offset+(value  / gain);
  }

  function raw2u(value, offset, gain) {
    return (value-offset) * gain ;
  }
  return MyObj;
}

 