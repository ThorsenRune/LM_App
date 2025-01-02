/*		history.js
	Input history handler


*/

const lineHistory = [];
function AddHistory(element,acceptHandler){
    element.addEventListener("keyup", async function (event) {
        if (event.keyCode === 13) {
        	event.preventDefault();
        	lineHistory.unshift(element.value);
        	historyIndex = -1; // No history entry selected
           if(acceptHandler) acceptHandler(this.value);
           this.value=''
        } else if (event.keyCode === 38) { // Key up
        	event.preventDefault();
            scrollHistory(1);
        } else if (event.keyCode === 40) { // Key down
        	event.preventDefault();
            scrollHistory(-1);
        }
    })
    function scrollHistory(direction) {
        // Clamp the value between -1 and history length
        historyIndex = Math.max(Math.min(historyIndex + direction, lineHistory.length - 1), -1);
        if (historyIndex >= 0) {
            element.value = lineHistory[historyIndex];
        } else {
            element.value = "";
        }
    }
}