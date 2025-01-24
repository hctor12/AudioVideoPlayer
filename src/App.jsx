import { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathRoundedSquareIcon,
  BackwardIcon,
  ForwardIcon,
  SpeakerWaveIcon,
  PlayCircleIcon,
  QueueListIcon,
  MicrophoneIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import Playlist from "./components/Playlist";
import AudioRecorder from "./components/AudioRecorder";
import { demoTracks } from "./data/tracks";

function App() {
  const [currentTrack, setCurrentTrack] = useState(demoTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState("player");
  const [isLoaded, setIsLoaded] = useState(false);
  const [wasPlayingBeforeRecording, setWasPlayingBeforeRecording] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [showClickIcon, setShowClickIcon] = useState(false);
  const mediaRef = useRef(null);
  const progressRef = useRef(null);

  const initializeMedia = () => {
    if (!mediaRef.current) return;

    const media = mediaRef.current;

    setIsLoaded(false);
    setCurrentTime(0);
    setDuration(0);

    media.volume = volume;
    media.load();
  };

  useEffect(() => {
    let media = mediaRef.current;
    if (!media) return;

    const handleLoadedData = () => {
      if (media.duration && !isNaN(media.duration)) {
        setDuration(media.duration);
        setIsLoaded(true);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(media.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(media.duration);
    };

    const handleDurationChange = () => {
      if (media.duration && !isNaN(media.duration)) {
        setDuration(media.duration);
      }
    };

    media.addEventListener("loadeddata", handleLoadedData);
    media.addEventListener("durationchange", handleDurationChange);
    media.addEventListener("timeupdate", handleTimeUpdate);
    media.addEventListener("play", handlePlay);
    media.addEventListener("pause", handlePause);
    media.addEventListener("ended", handleEnded);

    initializeMedia();

    return () => {
      media.removeEventListener("loadeddata", handleLoadedData);
      media.removeEventListener("durationchange", handleDurationChange);
      media.removeEventListener("timeupdate", handleTimeUpdate);
      media.removeEventListener("play", handlePlay);
      media.removeEventListener("pause", handlePause);
      media.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack.url]);

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlay = async () => {
    if (mediaRef.current && isLoaded) {
      try {
        if (isPlaying) {
          await mediaRef.current.pause();
        } else {
          await mediaRef.current.play();
        }
      } catch (error) {
        console.error("Error reproduciendo medio:", error);
      }
    }
  };

  const handleVideoClick = async () => {
    await handlePlay();
    setShowClickIcon(true);
    setTimeout(() => setShowClickIcon(false), 500);
  };

  const handleStop = () => {
    if (mediaRef.current) {
      mediaRef.current.pause();
      mediaRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleTimeSkip = (seconds) => {
    if (mediaRef.current && isLoaded) {
      const newTime = mediaRef.current.currentTime + seconds;
      mediaRef.current.currentTime = Math.max(
        0,
        Math.min(newTime, mediaRef.current.duration)
      );
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  const formatTime = (time) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (e) => {
    if (mediaRef.current && isLoaded) {
      const newTime = parseFloat(e.target.value);
      mediaRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTrackSelect = (track) => {
    const wasPlaying = isPlaying;
    
    if (mediaRef.current) {
      mediaRef.current.pause();
      mediaRef.current.currentTime = 0;
    }
    
    setCurrentTrack(track);
    setIsLoaded(false);
    setCurrentTime(0);
    setDuration(0);
    
    setTimeout(() => {
      if (mediaRef.current) {
        mediaRef.current.load();
        if (wasPlaying) {
          mediaRef.current.play().catch(console.error);
        }
      }
    }, 50);
  };

  const handleRecordingPlay = () => {
    setWasPlayingBeforeRecording(isPlaying);
    
    if (mediaRef.current && isPlaying) {
      setPausedTime(mediaRef.current.currentTime);
      mediaRef.current.pause();
    }
  };

  const handleRecordingEnd = () => {
    if (mediaRef.current && wasPlayingBeforeRecording) {
      mediaRef.current.currentTime = pausedTime;
      mediaRef.current.play().catch(console.error);
      setWasPlayingBeforeRecording(false);
      setPausedTime(0);
    }
  };

  const handleRecordingStart = () => {
    setWasPlayingBeforeRecording(isPlaying);
    
    if (mediaRef.current && isPlaying) {
      setPausedTime(mediaRef.current.currentTime);
      mediaRef.current.pause();
    }
  };

  const handleRecordingStop = () => {
    if (mediaRef.current && wasPlayingBeforeRecording) {
      mediaRef.current.currentTime = pausedTime;
      mediaRef.current.play().catch(console.error);
      setWasPlayingBeforeRecording(false);
      setPausedTime(0);
    }
  };

  const renderPlayerControls = () => (
    <>
      <div className="mb-6">
        <div className="flex justify-between mb-1 text-sm text-light">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full cursor-pointer"
          disabled={!isLoaded}
          style={{
            backgroundSize: `${(currentTime * 100) / (duration || 100)}% 100%`,
          }}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={() => handleTimeSkip(-10)}
            className="p-2 transition-colors hover:text-primary"
            disabled={!isLoaded}
          >
            <BackwardIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          <button
            onClick={handlePlay}
            className="p-3 transition-colors rounded-full bg-primary hover:bg-opacity-80"
            disabled={!isLoaded}
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            ) : (
              <PlayIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </button>

          <button
            onClick={handleStop}
            className="p-2 transition-colors hover:text-primary"
            disabled={!isLoaded}
          >
            <StopIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          <button
            onClick={() => handleTimeSkip(10)}
            className="p-2 transition-colors hover:text-primary"
            disabled={!isLoaded}
          >
            <ForwardIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2 ${
              isLooping ? "text-primary" : ""
            } hover:text-primary transition-colors lg:hidden`}
          >
            <ArrowPathRoundedSquareIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>

        <div className="hidden lg:flex items-center justify-center gap-4">
          <div className="flex items-center flex-1 gap-2">
            <SpeakerWaveIcon className="w-5 h-5" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 cursor-pointer"
            />
          </div>
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2 ${
              isLooping ? "text-primary" : ""
            } hover:text-primary transition-colors`}
          >
            <ArrowPathRoundedSquareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );

  const renderVideoControls = () => (
    <div className="video-controls-overlay">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlay}
            className="text-white hover:text-primary transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            ) : (
              <PlayIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </button>
          <button
            onClick={() => handleTimeSkip(-10)}
            className="text-white hover:text-primary transition-colors"
          >
            <BackwardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => handleTimeSkip(10)}
            className="text-white hover:text-primary transition-colors"
          >
            <ForwardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`text-white hover:text-primary transition-colors lg:hidden ${
              isLooping ? "text-primary" : ""
            }`}
          >
            <ArrowPathRoundedSquareIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SpeakerWaveIcon className="w-5 h-5 text-white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`text-white hover:text-primary transition-colors ${
              isLooping ? "text-primary" : ""
            }`}
          >
            <ArrowPathRoundedSquareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-white">
        <span>{formatTime(currentTime)}</span>
        <div className="flex-1 relative h-1 bg-white/20">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
          <div
            className="h-full bg-primary"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen text-white bg-dark">
      <div className="fixed top-0 left-0 right-0 z-50">
        {currentTrack.type === "video" ? (
          <div className={`${activeTab === "player" ? "lg:pt-8" : ""}`}>
            <div className={`${activeTab === "player" ? "lg:max-w-4xl lg:mx-auto" : ""}`}>
              <div className="video-container">
                <video
                  ref={mediaRef}
                  src={currentTrack.url}
                  className={`w-full ${activeTab === "player" ? "relative" : "opacity-0 h-0"}`}
                  loop={isLooping}
                  playsInline
                  preload="auto"
                  controls={false}
                  onClick={handleVideoClick}
                />
                {renderVideoControls()}
                <div className={`video-click-icon ${showClickIcon ? 'show' : 'hide'}`}>
                  {isPlaying ? (
                    <PauseIcon className="w-10 h-10" />
                  ) : (
                    <PlayIcon className="w-10 h-10" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <audio
            ref={mediaRef}
            src={currentTrack.url}
            className="hidden"
            loop={isLooping}
            preload="auto"
            controls={false}
          />
        )}
      </div>

      <div className="flex-1">
        {activeTab === "player" ? (
          <div className="flex flex-col p-4 lg:max-w-4xl lg:mx-auto">
            {currentTrack.type === "video" ? (
              <>
                <div className="aspect-video" />
                <div className="mt-4 lg:mt-6">
                  <h2 className="text-xl font-bold">{currentTrack.title}</h2>
                  <p className="text-light">{currentTrack.artist}</p>
                </div>
              </>
            ) : (
              <div className="mb-4">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="object-cover w-full rounded-lg shadow-lg aspect-video"
                />
                <div className="mt-4">
                  <h2 className="text-xl font-bold">{currentTrack.title}</h2>
                  <p className="text-light">{currentTrack.artist}</p>
                </div>
              </div>
            )}

            {currentTrack.type !== "video" && renderPlayerControls()}
          </div>
        ) : activeTab === "playlist" ? (
          <div>
            <div className="pb-[200px] lg:max-w-4xl lg:mx-auto">
              <Playlist
                tracks={demoTracks}
                currentTrack={currentTrack}
                onTrackSelect={handleTrackSelect}
              />
            </div>
            <div className="fixed bottom-[72px] left-0 right-0 bg-secondary">
              <div className="p-4 lg:max-w-4xl lg:mx-auto">
                {currentTrack.type !== "video" && renderPlayerControls()}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="pb-[200px] lg:max-w-4xl lg:mx-auto">
              <AudioRecorder
                onRecordingPlay={handleRecordingPlay}
                onRecordingEnd={handleRecordingEnd}
                onRecordingStart={handleRecordingStart}
                onRecordingStop={handleRecordingStop}
              />
            </div>
            <div className="fixed bottom-[72px] left-0 right-0 bg-secondary">
              <div className="p-4 lg:max-w-4xl lg:mx-auto">
                {currentTrack.type !== "video" && renderPlayerControls()}
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-secondary">
        <div className="flex justify-around lg:max-w-4xl lg:mx-auto">
          <button
            onClick={() => setActiveTab("player")}
            className={`p-2 flex flex-col items-center ${
              activeTab === "player" ? "text-primary" : "text-light"
            }`}
          >
            <PlayCircleIcon className="w-5 h-5" />
            <span className="mt-1 text-xs">Player</span>
          </button>
          <button
            onClick={() => setActiveTab("playlist")}
            className={`p-2 flex flex-col items-center ${
              activeTab === "playlist" ? "text-primary" : "text-light"
            }`}
          >
            <BookOpenIcon className="w-5 h-5" />
            <span className="mt-1 text-xs">Biblioteca</span>
          </button>
          <button
            onClick={() => setActiveTab("recorder")}
            className={`p-2 flex flex-col items-center ${
              activeTab === "recorder" ? "text-primary" : "text-light"
            }`}
          >
            <MicrophoneIcon className="w-5 h-5" />
            <span className="mt-1 text-xs">Recorder</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;