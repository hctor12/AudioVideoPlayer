import { PlayIcon, PauseIcon, StopIcon, ArrowPathRoundedSquareIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";

export function PlayerControls({ 
  isPlaying,
  isLooping,
  volume,
  isLoaded,
  handlePlay,
  handleStop,
  handleTimeSkip,
  setIsLooping,
  handleVolumeChange,
  currentTime,
  duration,
  handleProgressChange,
  formatTime 
}) {
  return (
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
}