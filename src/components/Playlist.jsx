import { BookOpenIcon } from '@heroicons/react/24/solid'

function Playlist({ tracks, currentTrack, onTrackSelect }) {
  return (
    <div className="p-4"> 
      <div className="flex items-center gap-2 mb-4">
        <BookOpenIcon className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Biblioteca</h3>
      </div>
      <div className="space-y-2">
        {tracks.map(track => ( 
          <button
            key={track.id}
            onClick={() => onTrackSelect(track)}
            className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${
              currentTrack.id === track.id ? 'bg-gray-700' : ''
            }`}
          >
            <div className="relative w-16 h-16 mr-3">
              <img 
                src={track.cover} 
                alt={track.title}
                className="w-full h-full object-cover rounded" 
              />
              {track.type === 'video' && (
                <span className="absolute top-1 right-1 bg-primary text-xs px-1 rounded">
                  Video
                </span>
              )}
            </div>
            <div className="text-left">
              <p className="font-medium">{track.title}</p>
              <p className="text-sm text-light">{track.artist}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Playlist