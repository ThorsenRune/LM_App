<?php /* file:biteditor.php
    Generate content for bitediting windows
    */
    global $nModeFlags, $nErrFlags;

    $nModeFlags = [
        "ENPLW", "ENCHRGVCCS", "ENSWITCHES", "HVPS_ON", "DEBUGGING", "SINEGENERATOR", 
        "", "", "", "", "SR_FILTER", "ONECHSUM", "SAVECOUNT", 
        "RESETCOUNT", "", "", "", "", "", "", 
        "", "", "SAVESETTINGS", "THREEBATTERIES", "BATTLOW", "BATTFULL", 
        "INVALIDSETUP", "SHUTDOWN", "STIMENABLE", "KEY_DOWN", "KEY_SHORTPRESS", "KEY_LONGPRESS"
    ];

    $nErrFlags = [
        "bFifoOverflow", "bTXOverflow", "bTX32Overflow", "bRXOverflow", "Overflow_mVectorDotProduct", 
        "bReceiveError", "b12BitUnderflow", "b12BitOverflow", "ADCReadChError", "INA0LODPos", 
        "INA0LODNeg", "INA1LODPos", "INA1LODNeg", "BattLow", "TxBufferFull", 
        "", "", "", "", "", 
        "", "", "", "", "", 
        "", "", "", "", "", 
        "", ""
    ];

    function pWxBitEditor($WxId, $labelTexts) {
        /* Define a bit editor with id based on $WxId
            class="WxVarName" shows the current variable name
        */
        $html = '<div id="' . htmlspecialchars($WxId) . '" class="clsBitWidget clsWidget">';
        $html .= '<input class="WxVarName fullwidth" placeholder="Firmware Variable Name">';
        
        // Checkboxes for each bit with labels
        for ($i = 0; $i < count($labelTexts); $i++) {
            $html .= '<div>' . $i . '<input type="checkbox" id="bit' . $i . '" data-bit="' . $i . '">';
            $html .= '<label for="bit' . $i . '">' . htmlspecialchars($labelTexts[$i]) . '</label></div>';
        }
//TODO: change the IDs to be unique
        $html .= '</div>';
        
        return $html;
    }

?>