// Selectors
var videoElement   = document.querySelector('video');
var playbackButton = document.querySelector('#playback-button');

// Element streams
var videoElStream = Rx.Observable.create(function(observer) {
    observer.next(document.querySelector('video'));
});

var playbackButtonStream = Rx.Observable.create(function(observer) {
    observer.next(document.querySelector('#playback-button'));
});

// Video element event streams
var playingStream    = Rx.Observable.fromEvent(videoElement, 'playing');
var pauseStream      = Rx.Observable.fromEvent(videoElement, 'pause');
var endedStream      = Rx.Observable.fromEvent(videoElement, 'ended');
var timeUpdateStream = Rx.Observable.fromEvent(videoElement, 'timeupdate');
var changeStream     = playingStream.merge(pauseStream).merge(endedStream);

// Control streams
var playbackButtonClickStream = Rx.Observable.fromEvent(playbackButton, 'click');

// Video element state change streams
var isPlayingStream = changeStream.map(function(changeEvent) {
                                            return changeEvent.type === 'playing';
                                        });

var currenTimeStream = videoElStream.combineLatest(timeUpdateStream, function(videoEl, currentTimeEvent) {
    return videoEl.currentTime;
});

// Control elements action subscriptions
playbackButtonClickStream.combineLatest(videoElStream).subscribe(function(event) {
    var videoEl = event[1];
    if(videoEl.paused) {
        videoEl.play();
    } else {
        videoEl.pause();
    }
});

// Video element state change subscriptions
isPlayingStream.combineLatest(playbackButtonStream).subscribe(function(event){
    var playerState    = event[0];
    var playbackButton = event[1];

    playbackButton.innerHTML = (playerState) ? "Pause" : "Play";
});

currenTimeStream.subscribe(function(time) {
    console.log(time);
});
