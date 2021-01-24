var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytPlayer = null ;

function getVideoIdFromYouTubeURL(url) {
	var urlParser = new URL(url) ;

	if (urlParser.searchParams.has("v")) {
		return urlParser.searchParams.get("v") ;
	}
	
	return "" ;
}

function loaVideo(width, height, videoId) {
	if (ytPlayer != null) {
		ytPlayer.destroy() ;
	}
	
	ytPlayer = new YT.Player(
		'target_video',
			{
			width: width,
			height: height,
			videoId: videoId,
			
			events: {
				'onReady': onPlayerReady,
				'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
				'onStateChange': onPlayerStateChange,
				'onError': onPlayerError
			}
		}
	);
}

function onYouTubeIframeAPIReady() {
  
}

function onPlayerReady(event) {
	//event.target.playVideo();
}

function onPlayerPlaybackQualityChange(event) {

}

var timer ;

function onPlayerStateChange(event) {
	var ytStatus = event.data;
	
	if (ytStatus == YT.PlayerState.ENDED) {
		console.log('ENDED');
		clearTimeout(timer);
		subtitleIndex = 0 ;
	} else if (ytStatus == YT.PlayerState.PLAYING) {
		console.log('PLAYING');
		timer = setInterval(onPlaying, 200);
	} else if (ytStatus == YT.PlayerState.PAUSED) {
		console.log('PAUSED');
		clearTimeout(timer);
		subtitleIndex = 0 ;
	} else if (ytStatus == YT.PlayerState.BUFFERING) {
		console.log('BUFFERING');
	} else if (ytStatus == YT.PlayerState.CUED) {
		console.log('CUED');
	} else {
		console.log(ytStatus);
	}	
}

function onPlayerError(event) {

}

function onPlaying() {
	//document.getElementById("currentTime").innerText = ytPlayer.getCurrentTime() ;
	document.getElementById("currentSubtitle").innerText = getCurrentSubtitle(ytPlayer.getCurrentTime()) ;
}

var subtitleIndex = 0 ;
var data = [] ;

function timeToMillisec(time) {
	var elements = time.split(':') ;
	var millisec = 0 ;

	millisec += Number(elements[0] * 60 * 60) ;
	millisec += Number(elements[1] * 60) ;
	millisec += Number(elements[2]) ;

	return millisec ;
}

function loadSbvFileFromURL(url) {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) { 
				loadSbvFile(xmlhttp.responseText)
			} else {
				console.log("status = " + xmlhttp.status);
			} 
		}
	}

	var host = location.hostname ;
	var path = location.pathname ;
	var protocol = location.protocol ;

	var path = protocol + "//" + host + path + "dl.php?url=" + encodeURIComponent(url) ;

	console.log(path) ;

	xmlhttp.open("GET", path);
	xmlhttp.send();
}

function loadSbvFile(contents) {
	data = []
	subtitleIndex = 0 ;

	contents.replace(
		/^(\d:.*)\n((?:(?!\d+:\d+:\d+).*\n*)+)$/gm,
		(string, time, text) =>
		data.push({
			time: {
			start: timeToMillisec(time.split(',')[0]),
			end: timeToMillisec(time.split(',')[1])
			},
			//text: text.replace(/\n/g, ' ').trim()
			text: text.trim()
		})
	)
}

function getCurrentSubtitle(currentTime) {
	// Implementing...
	var subtitle = "" ;

	for (var i=subtitleIndex; i<data.length; i++) {
		if (data[i]["time"]["start"] < currentTime && currentTime < data[i]["time"]["end"]) {
			subtitle = data[i]["text"] ;
			subtitleIndex = i ;
			break ;
		}
	}

	return subtitle ;
}