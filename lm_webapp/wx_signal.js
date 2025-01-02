/* 
 * file: wx_signal.js
 * Purpose: A widget for plotting signals
 * Premises: Requires a 'signal.html' file with the following elements:
 *   - wss1: Container element
 *   - idSignalTitle: Title element
 *   - idMaxVal, idMinVal: Y axis limits
 */

"use strict";

function Signals_Redraw2(WxId, redraw) {
  //  const WxId = SignalWidget.DataWX.id
    const oWX = Widgets.WXList[WxId];
    // Check for valid data and if the window is minimized
    if (!(oWX && oWX.VarObj) ) return;
    if(! oWX.Widget)redraw=true
    if (redraw) {
        oWX.Widget=GetSignalWidget(WxId)    //Get the methods for the widget
        // Full redraw of the signal
        oWX.Widget.Title(
            oWX.Alias(),
            oWX.Range(),
            oWX.Units()
        );
    } 
    // Just refreshing
    const Xvals = oWX.UnitArray(); // Display value
    if(oWX.active()) oWX.PeekData(true);

    const Unit = oWX.Units(); // Units
    const Range = oWX.Range();

    oWX.Widget.mPlotVector(Xvals, Range[0], Range[1], Unit);
}




// Initialize the signal plot
function GetSignalWidget(WxId) {    //Initialize a signal object
    const mySignalObj = {};
    let eSVG, path1, lMidline;
    var thisWindow=document.getElementById(WxId)
    /*      Retrieve elements in the thisWindow */
    mySignalObj.window=thisWindow
    mySignalObj.elTitle = thisWindow.querySelector('.SignalTitle');
    mySignalObj.elMaxLbl = thisWindow.querySelector('#idMaxVal');
    mySignalObj.elMinLbl = thisWindow.querySelector('#idMinVal');
    mySignalObj.elLegend = thisWindow.querySelector('#idSignalLegend');
    eSVG                = thisWindow.querySelector("svg");
    path1               = eSVG.querySelector('#idSignal');
    lMidline            = eSVG.querySelector('#idMidLine');

    lMidline.style.strokeDasharray = "10 30";

    eSVG.ontouchstart = () => jFocus(eSVG);
    eSVG.onclick = () => jFocus(eSVG);

 
    mySignalObj.legend = thisWindow.querySelector('#idSignalLegend');
    mySignalObj.legend.style.background = 'black';
  

    // Initialize the signal's title and related information
    mySignalObj.Title = function(str, Range = [0, 100], Units = 'raw', Legend = 'Y') {
        mySignalObj.elTitle.innerHTML = str;
        mySignalObj.Units = Units;
        mySignalObj.Range = Range;
        mySignalObj.Legend = Legend;

        mySignalObj.elMinLbl.textContent = `${Range[0]}${Units}`;
        mySignalObj.elMaxLbl.textContent = `${Range[1]}${Units}`;
        eSVG.setAttribute('preserveAspectRatio', 'none');
        mySignalObj.elLegend.textContent = mySignalObj.Legend;
    };

    // Plot a vector of data points
    mySignalObj.mPlotVector = function(Y, min = mySignalObj.Range[0], max = mySignalObj.Range[1], units = mySignalObj.Units) {
        const len = Y.length;
        if (len < 2) return;

        eSVG.setAttribute('preserveAspectRatio', 'none');
        const range = max - min;
        eSVG.setAttribute('viewBox', `0 0 ${len} ${range}`);

        const top = max; // Flip y-axis
        lMidline.setAttribute("d", `M0,${top} L${len},${top}`); // Centerline

        let path = `M0,${top - Y[0]}`;
        for (let i = 1; i < len; i++) {
            path += ` L${i},${top - Y[i]}`; // Flip y-axis
        }
        path1.setAttribute("d", path);
    };

    return mySignalObj;
}
