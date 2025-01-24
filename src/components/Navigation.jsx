import { PlayCircleIcon, BookOpenIcon, MicrophoneIcon } from "@heroicons/react/24/solid";

export function Navigation({ activeTab, setActiveTab }) {
  return (
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
  );
}