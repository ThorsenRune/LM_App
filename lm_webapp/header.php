<?php
// Check if the 'plain' parameter is present in the URL
$isPlain = isset($_GET['plain']);
if($isPlain){
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        $http_url = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        header("Location: $http_url", true, 301);
        exit();
    }
}  //Redirect to insecure connection
if(false){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");    
}
?>