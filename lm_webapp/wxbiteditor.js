/*	file:wxbiteditor.js
    Shows the bits of a 32bit value
    https://chatgpt.com/c/57c8257e-fe80-43e4-95cc-9596605d4f34
    rev 1:240704
    Use object.WidgetRedraw=BitEditor(oWX) to enrich the widget as a biteditor
    WidgetRedraw.Labels get/sets labels
    redraw(boolean) to refresh/complete redraw
*/
function BitEditor(oWX) {   //Newer version 240704
    var win;
    var chkboxes = [];
    oWX.type = "BitEditor";

    function redraw(full) {
        if (full){   
            win = oWX.Window;
            oWX.input = win.querySelector('.clsBitWidget');
            var TitleElem=win.querySelector('.WxVarName')
            TitleElem.value=oWX.VarName()
            oWX.input.onclick = function () { jFocus(oWX.input); }; // Onfocus listener
            chkboxes = Array.from(win.querySelectorAll('[id^="bit"]'));
            chkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', disp2val);
                checkbox.label=checkbox.parentElement.querySelector('label')
                checkbox.parentElement.hidden=(checkbox.label.textContent=='')
            });
        }
        val2disp(oWX.WidgetRawValue());
        if(!oWX.Window.passive){            //Dormant window?
            oWX.PeekData(true)
        }
    }
    function Labels(Newlabels) {   //Get/set 32 labels
        var labels=[]
        for (let i = 0; i < 32; i++) {
            if (chkboxes[i]) {
                var lblelement=chkboxes[i].parentElement.querySelector('label')
                if(Newlabels&&Newlabels[i]) lblelement.innerHTML=Newlabels[i]
                labels[i]=lblelement.textContent
                chkboxes[i].label=lblelement
            }
        }
        return labels
    }
    function val2disp(Int32BitVal) {
        for (let i = 0; i < 32; i++) {
            if (chkboxes[i]) {
                chkboxes[i].checked = (Int32BitVal & (1 << i)) !== 0;
            }
        }
    }

    function disp2val() {
        let value = 0;
        for (let i = 0; i < 32; i++) {
            if (chkboxes[i] && chkboxes[i].checked) {
                value |= (1 << i);
            }
        }
        oWX.WidgetRawValue(value)
        oWX.PokeData(true)
    }

    redraw(true); //Initializa with a full redraw    
    return {
        redraw
        ,type:oWX.type
        ,oWX
        ,Labels
    };
}


 