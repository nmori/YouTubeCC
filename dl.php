<?php
	//$url = "https://service.udtalk.jp/sbv/M097Kht0ld4.sbv" ;

	if(isset($_GET['url'])) {
		$url = $_GET['url'];
	}

	echo file_get_contents($url, false, null) ; 
?>