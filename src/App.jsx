import { useState } from "react";
import { UserLibrary } from "./components/UserLibrary";
import AudioRecorder from "./components/AudioRecorder";
import { Navigation } from "./components/Navigation";
import { MediaPlayer } from "./components/MediaPlayer";
import { Auth } from "./components/Auth";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [activeTab, setActiveTab] = useState("player");
  const [wasPlayingBeforeRecording, setWasPlayingBeforeRecording] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const { user } = useAuth();

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setActiveTab("player");
  };

  const handleRecordingPlay = () => {
    setWasPlayingBeforeRecording(false);
    setPausedTime(0);
  };

  const handleRecordingEnd = () => {
    setWasPlayingBeforeRecording(false);
    setPausedTime(0);
  };

  const handleRecordingStart = () => {
    setWasPlayingBeforeRecording(false);
    setPausedTime(0);
  };

  const handleRecordingStop = () => {
    setWasPlayingBeforeRecording(false);
    setPausedTime(0);
  };

  if (!user) {
    return (
      <>
        <Auth />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-white bg-dark">
      {currentTrack?.type === "video" && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <MediaPlayer currentTrack={currentTrack} activeTab={activeTab} />
        </div>
      )}

      <div className="flex-1">
        {activeTab === "player" ? (
          <div className="flex flex-col p-4 lg:max-w-4xl lg:mx-auto">
            {currentTrack ? (
              currentTrack.type === "video" ? (
                <>
                  <div className="aspect-video" />
                  <div className="mt-4 lg:mt-12">
                    <h2 className="text-xl font-bold">{currentTrack.title}</h2>
                    <p className="text-light">
                      {new Date(currentTrack.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <img
                    src={currentTrack.cover || currentTrack.url}
                    alt={currentTrack.title}
                    className="object-cover w-full rounded-lg shadow-lg aspect-video"
                  />
                  <div className="mt-4">
                    <h2 className="text-xl font-bold">{currentTrack.title}</h2>
                    <p className="text-light">
                      {new Date(currentTrack.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center text-light">
                Selecciona un archivo de tu biblioteca
              </div>
            )}
          </div>
        ) : activeTab === "playlist" ? (
          <div>
            <div className="pb-[200px] lg:max-w-4xl lg:mx-auto">
              <UserLibrary onTrackSelect={handleTrackSelect} />
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
          </div>
        )}
      </div>

      {currentTrack && currentTrack.type !== "video" && (
        <div className="fixed bottom-[72px] left-0 right-0 bg-secondary">
          <div className="p-4 lg:max-w-4xl lg:mx-auto">
            <MediaPlayer currentTrack={currentTrack} activeTab={activeTab} />
          </div>
        </div>
      )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;