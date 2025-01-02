/*	file:watches.js
	Handeling the idWxWatch window
*/
function Watches_Redraw2(redraw) {
    function _WatchRedraw(element) {
        const WxId = element.id;
        const elVarNameSel = element.querySelector('[name="VarName"]');
        const elVarValue = element.querySelector('[name="VarVal"]');
        const elVarValConfirm = element.querySelector('[name="ok"]');
        lib.mFillDataList(elVarNameSel, protocol.NameList());

        elVarNameSel.onchange = function() {
            SelectVar(elVarNameSel.value);
            Watches_Redraw2(true);
        };

        const oWX = Widgets.GetWidgetById(WxId);
        if (oWX&&oWX.VarObj) {
            const info = "Memory:" + oWX.VarObj.ConnectedDevice() + "(" + oWX.VarId + ")";
            elVarNameSel.value = oWX.VarName();
            oWX.VarValInput = elVarValue;
            elVarNameSel.title = info;
            elVarValue.title = info;
        } else {
            elVarNameSel.value = '';
            elVarValue.value = '';
        }

        elVarValConfirm.onclick = function() {
            SetValue(WxId);
        };

        function SelectVar(sVarName) {
            sVarName=sVarName.trim()
            if (!sVarName) return Widgets.DeleteWidget(WxId); // Remove invalid widgets
            if (!protocol.ProtElemByName(sVarName)) return; // Only valid variable names
            Widgets.AssignWidget(WxId, sVarName);
            protocol_store(true);
        }

        function SetValue(WxId) {
            const oWX = Widgets.GetWidgetById(WxId);
            if(!oWX)return false        //Invalid widget
            const data = oWX.VarValInput.value;
            const vector = utils.String2Array(data);
            if (!oWX) debugger;
            if (oWX) {
                oWX.RawArray(vector);
                oWX.PokeData(true);
            }
        }
    }

    function WatchRefresh(element) {
        const oWX = Widgets.GetWidgetById(element.id);
        if (!oWX || !oWX.VarObj || !oWX.VarValInput) return;

        const vector = oWX.RawArray();
        if(oWX.hasFocus()) {return}                     //Dont update if has focus, (freeze)
        if (Widgets.ActiveWidget()==oWX.WidgetId()){return} //Same thing

        oWX.VarValInput.value = utils.Array2String(vector);
        if(oWX.active())        oWX.PeekData(true);     
    }

    display.WindowWatches = document.getElementById('idWatches');
    const watchElements = display.WindowWatches.querySelectorAll('.clsWidget');
    watchElements.forEach(element => {
        if (redraw) _WatchRedraw(element);
        WatchRefresh(element);
    });
}


 


