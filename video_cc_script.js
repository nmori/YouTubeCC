var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytPlayer ;

function getVideoIdFromYouTubeURL(url) {
	var urlParser = new URL(url) ;

	if (urlParser.searchParams.has("v")) {
		return urlParser.searchParams.get("v") ;
	}
	
	return "" ;
}

function loaVideo(width, height, videoId) {
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
	} else if (ytStatus == YT.PlayerState.PLAYING) {
		console.log('PLAYING');
		timer = setInterval(onPlaying, 200);
	} else if (ytStatus == YT.PlayerState.PAUSED) {
		console.log('PAUSED');
		clearTimeout(timer);
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
	document.getElementById("currentTime").innerText = ytPlayer.getCurrentTime() ;
}