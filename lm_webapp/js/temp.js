


function prot_WidgetRefresh(){  //Todo: migrate as the unified widget updater by registring the widgets in prot.ActiveWidgets
    Object.values(Widgets.WXList).forEach(oWX => {
      if (!oWX.hasFocus()){
         oWX.WidgetRefresh()
      }
    });
}




function jTimingCheck(){
        timing[1]=Date.now();
        diff=timing[1]-timing[0];
        idTimingCheck.value=timing[1]+"  :  "
        idTimingCheck.value+=timing[1]-timing[0];
        timing[0]=timing[1]
}


 
 









 