import { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { PlayerControls } from "./PlayerControls";
import { VideoControls } from "./VideoControls";

export function MediaPlayer({ currentTrack, activeTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showClickIcon, setShowClickIcon] = useState(false);
  const mediaRef = useRef(null);

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

  const commonProps = {
    isPlaying,
    isLooping,
    volume,
    currentTime,
    duration,
    handlePlay,
    handleTimeSkip,
    setIsLooping,
    handleVolumeChange,
    handleProgressChange,
    formatTime
  };

  return (
    <>
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
              <VideoControls {...commonProps} />
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

      {currentTrack.type !== "video" && (
        <PlayerControls {...commonProps} isLoaded={isLoaded} handleStop={handleStop} />
      )}
    </>
  );
}