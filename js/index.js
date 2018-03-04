// Selectors
var videoEl = document.querySelector('video');

// Element Streams
var videoElStream = Rx.Observable.create(function(observer) {
    observer.next(document.querySelector('video'));
});

// Video Element Event Streams
var playingStream    = Rx.Observable.fromEvent(videoEl, 'playing');
var pauseStream      = Rx.Observable.fromEvent(videoEl, 'pause');
var endedStream      = Rx.Observable.fromEvent(videoEl, 'ended');
var timeUpdateStream = Rx.Observable.fromEvent(videoEl, 'timeupdate');
var changeStream     = playingStream.merge(pauseStream).merge(endedStream);

// Composed streams
var isPlayingStream  = changeStream.map(function(changeEvent) {  
    return changeEvent.type === 'playing';
});

var currenTimeStream = videoElStream
                        .combineLatest(timeUpdateStream)
                        .map(
                            function(videoTimeUpdateStream) {
                                return videoTimeUpdateStream[0].currentTime;
                            }
                        );

// Subscriptions
isPlayingStream.subscribe(function(playerState){
    console.log(playerState);
});


currenTimeStream.subscribe(function(evt) {
    console.log(videoEl.currentTime);
});