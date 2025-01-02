<?php
/*	file:debug.php
	elements for debugging and testing purpose
	should be independent on the main application
*/
function pConsoleWindow(){	//Showing a debug messages panel
	?>
	<main>
		<span>
			<input type="text" class='left' id="idSerialMonitor"  
			placeholder="Commands for the ESP (?;m2...) [ENTER]"> 
			<input type="button" class='right' 	
				onclick="sendCmd()" 
				title="Commands for the ESP (?;m2...)" value="Send">
		</span>
		<textarea 
			id="idDebugText" 
			class='fullwidth' 
			title="idText" 
			placeholder="You will see debugger console messages here" 
		></textarea>		
	</main>

		<footer class="styButtonContainer">
			<button onClick="Channel_Start()">connect</button>
 

			<button onclick="debug.listProtocol()">Info</button>
			<button onclick='idDebugText.value=null' class='scrollHeight'>Clear</button>
		</footer>
	<?php
}
 
?>