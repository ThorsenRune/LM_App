/*	file:app.js
	Application specific constants and variables

*/
"use strict";
if (!APP) var APP={};

 
APP.CloudServer=APPRoot+"/data.php";



APP.DefaultLayout=function(){ //Default layout
  document.querySelector('#idConsoleWindow').style.cssText = 'top: none; ;bottom:0';
  document.querySelector('#idConnectWindow').classList.add('minimized');
  document.querySelector('#idConsoleWindow').style.cssText = 'left:0; width: auto;height: auto;';

}
 