import { useState, useRef } from "react";
import ReactPlayer from "react-player";

export const VideoPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [lastEvent, setLastEvent] = useState("");

  const playerRef = useRef(null);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = String(date.getUTCSeconds()).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Event handlers
  const handlePlay = () => {
    setPlaying(true);
    setLastEvent("onPlay");
  };

  const handlePause = () => {
    setPlaying(false);
    setLastEvent("onPause");
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setProgress(state);
      setLastEvent("onProgress");
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
    setLastEvent("onDuration");
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
    setLastEvent("onSeekMouseDown");
  };

  const handleSeekChange = (e) => {
    setProgress({ ...progress, played: parseFloat(e.target.value) });
    setLastEvent("onSeekChange");
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value));
    setLastEvent("onSeekMouseUp");
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    setLastEvent("onVolumeChange");
  };

  const handleToggleMute = () => {
    setMuted(!muted);
    setLastEvent("onToggleMute");
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    setLastEvent("onPlaybackRateChange");
  };

  const handleReady = () => {
    setLastEvent("onReady");
  };

  const handleStart = () => {
    setLastEvent("onStart");
  };

  const handleBuffer = () => {
    setLastEvent("onBuffer");
  };

  const handleBufferEnd = () => {
    setLastEvent("onBufferEnd");
  };

  const handleEnded = () => {
    setPlaying(false);
    setLastEvent("onEnded");
  };

  const handleError = (error) => {
    console.error("Player error:", error);
    setLastEvent(`onError: ${error}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <ReactPlayer
          ref={playerRef}
          url="https://www.youtube.com/watch?v=NDtyKKbRbjc"
          width="100%"
          height="auto"
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onStart={handleStart}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onEnded={handleEnded}
          onError={handleError}
        />
      </div>

      <div className="p-4 bg-gray-900 text-white">
        {/* Progress bar */}
        <div className="flex items-center mb-4">
          <span className="mr-2">{formatTime(progress.playedSeconds)}</span>
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={progress.played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="w-full mx-2"
          />
          <span className="ml-2">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button
              onClick={() => setPlaying(!playing)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
            >
              {playing ? "Pause" : "Play"}
            </button>

            <div className="flex items-center ml-4">
              <button
                onClick={handleToggleMute}
                className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded mr-2"
              >
                {muted ? "Unmute" : "Mute"}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="mr-2">Speed:</span>
            {[0.5, 1, 1.5, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => handlePlaybackRateChange(rate)}
                className={`px-2 py-1 mx-1 rounded ${
                  playbackRate === rate
                    ? "bg-blue-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Event tracking */}
        <div className="mt-4 p-2 bg-gray-800 rounded">
          <h3 className="text-lg font-semibold mb-2">Event Tracking</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p>
                Last Event: <span className="text-green-400">{lastEvent}</span>
              </p>
              <p>
                Playing:{" "}
                <span className="text-green-400">{playing ? "Yes" : "No"}</span>
              </p>
              <p>
                Volume:{" "}
                <span className="text-green-400">
                  {Math.round(volume * 100)}%
                </span>
              </p>
              <p>
                Muted:{" "}
                <span className="text-green-400">{muted ? "Yes" : "No"}</span>
              </p>
            </div>
            <div>
              <p>
                Current Time:{" "}
                <span className="text-green-400">
                  {formatTime(progress.playedSeconds)}
                </span>
              </p>
              <p>
                Duration:{" "}
                <span className="text-green-400">{formatTime(duration)}</span>
              </p>
              <p>
                Loaded:{" "}
                <span className="text-green-400">
                  {Math.round(progress.loaded * 100)}%
                </span>
              </p>
              <p>
                Playback Rate:{" "}
                <span className="text-green-400">{playbackRate}x</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
