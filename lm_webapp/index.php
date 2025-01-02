<!doctype html>		<!-- LM WEBAPP -->
<html lang="en">
<?PHP 
// Get the root of the served document, use for ESP as a proxy server (relaying the HTML)
define('ROOT',(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF'])."/");
 
	include_once 'header.php';
	include_once 'debug.php';
	include_once 'settings.php';
	include_once 'biteditor.php';
	include_once 'widgets.php';	//Layout of the APP
	include_once 'prototype.html' ;
//	<script src="/lib/conzole.js" defer>/* debugging only*/</script>
?>
	<script src="<?=ROOT?>./debug.js" defer>/* debugging only*/</script>
	<script src="<?=ROOT?>./app.js" defer>		/* Application data*/</script>
	<script src="<?=ROOT?>./js/history.js" defer></script>
	<script src="<?=ROOT?>./js/main.js" defer>	/*Main programe and entry*/		</script>
	<script src="<?=ROOT?>./db.js" defer>			/*Database related */		</script>
	<script src="<?=ROOT?>./js/websocket.js" defer></script>
	<script src="<?=ROOT?>./js/bt_classic.js" defer></script>
	<script src="<?=ROOT?>./js/testing.js" defer></script>
	<script src="<?=ROOT?>./js/temp.js" defer></script>

	<script src="<?=ROOT?>./js/utils.js" defer></script>
	<script src="<?=ROOT?>./js/display.js" defer></script>
	<script src="<?=ROOT?>./js/utils.js" defer>	/*	math etc*/</script>
	<script src="<?=ROOT?>./js/interface.js" 	defer>	/*	GUI related*/	</script>
	<script src="<?=ROOT?>./js/protocol.js" 	>/* variables */</script>
	<script src="<?=ROOT?>./js/slider.js" defer></script>
	<script src="<?=ROOT?>./settings.js" defer>		/* Application data*/</script>
	<script src="<?=ROOT?>./wx_signal.js" defer>/*	handling the signal plotting */</script>
	<script src="<?=ROOT?>./widgets.js" defer></script>
	<script src="<?=ROOT?>./watches.js" defer></script>
	<script src="<?=ROOT?>./js/filter.js" defer></script>
	<script src="<?=ROOT?>./wx_settings.js" defer></script>
	<script src="<?=ROOT?>./wxbiteditor.js" defer></script>
	<script src="<?=ROOT?>./js/index.js" defer></script>
	<script src="<?=ROOT?>./js/lib.js" defer></script>
	
	 <script src="<?=ROOT?>./js/movesize.js" defer></script>
	<?php /* HANDLING WINDOWS RESIZING AND MOVING	*/ ?>
    <link  href="<?=ROOT?>./js/windows.css" rel="stylesheet">
    <script src="<?=ROOT?>./js/windows.js" defer></script>
	</body>
<script> APPRoot="<?=ROOT?>"</script>
</html> 
<!--- LM_WEBAPP END-->
 