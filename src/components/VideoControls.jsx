import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, ArrowPathRoundedSquareIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";

export function VideoControls({
  isPlaying,
  isLooping,
  volume,
  handlePlay,
  handleTimeSkip,
  setIsLooping,
  handleVolumeChange,
  currentTime,
  duration,
  handleProgressChange,
  formatTime
}) {
  return (
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
}