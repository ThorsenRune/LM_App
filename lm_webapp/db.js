/*  File:db.js - lm_webapp
	Connects to |data.php| for storage of data and relaying to other clients
	
	handles the prot object
*/
document.addEventListener('DOMContentLoaded', function(){
    //On document ready plugin the debugger
});


 

function mDataExchange(mode,callback){
    /*Get the protocol from a datafile 
    and execute the callback on completion*/
    var oData=oProtocol.oData||{}
    var sFileName=APP.ProtFileName
    //mode=='swap' , will exchange data through the server
    //Sets the datafile and returns previous datafile on the server
    maincallback=function (oRetData){
        oProtocol.oData=oRetData.data;
        APP.ProtFileName=sFileName
        requestRedraw()
    if (callback) callback()
    }
    
    if (mode=='swap'){
      mPHPCall(APP.CloudServer,'swap',sFileName,oData,maincallback);   //Get previos data and write these
    } else if (mode=='save')  {
        mPHPCall(APP.CloudServer,'save',sFileName,oData,maincallback);
    } else if (mode=='load') {       //Load
        mPHPCall(APP.CloudServer,'load',sFileName,oData,maincallback);
    } else {
        alert('Invalid mode for mDataExchange ')
    }
}

function protocol_store(store){
    if (store){
        var s=JSON.stringify(oProtocol.oData)
        localStorage.setItem('protocol',s)
    } else {
        s=localStorage.getItem('protocol')
        if (s) {
            oProtocol.oData=JSON.parse(s)
            setTimeout(requestRedraw,100);
        }
    }
}
var mPHPCall = function(url,cmd,filename,data,callback) {
    //cmd ={save,load,swap}
    return   new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();         //Stuff using the str
        var sending={}
        sending.cmd=cmd;            //
        sending.data=data;
        sending.data.sFileName=filename     //Rev 210209 Set filename
        var sending=JSON.stringify(sending);
        xhr.open('POST', url, true);
        xhr.timeout = 4000;         //See https://stackoverflow.com/questions/23725085/failed-to-load-resource-neterr-network-io-suspended
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=ISO-8859-1');
        xhr.onreadystatechange = function(){
            if(this.readyState==4)
            if(this.status == 200 ){
                try{
                    var s= this.responseText;
                    try{
                        oRetData=JSON.parse(s);     //All good
                    }
                    catch(er){  //Cant parse the params;
                        oRetData={};
                        oRetData.errors=s;
                    }
                }catch(e){
                    oRetData={};
                    oRetData.errors=e;
                    reject(e);          //What do we do with reject?
                }
                if(oRetData.err) alert("Fatal error, please correct. "+oRetData.err)
                if(callback) callback(oRetData);        //Report the result
            } else {
                oRetData={};
                oRetData.errors="No connection"+this.statusText+this.responseText;
                if(callback) callback(oRetData);
            }
        }
        xhr.send("data=" + sending);
        })
}
