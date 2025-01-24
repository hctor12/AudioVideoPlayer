import { useState, useRef } from 'react'
import { MicrophoneIcon, StopIcon, TrashIcon } from '@heroicons/react/24/solid'

function AudioRecorder({ onRecordingPlay, onRecordingEnd, onRecordingStart, onRecordingStop }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState([])
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const activeAudioRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const timestamp = new Date().toLocaleString()
        setRecordings(prev => [...prev, { url, timestamp }])
        chunksRef.current = []
        onRecordingStop()
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      onRecordingStart()
    } catch (err) {
      console.error('Error al iniciar la grabación:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const deleteRecording = (index) => {
    setRecordings(prev => prev.filter((_, i) => i !== index))
  }

  const downloadRecording = (url, timestamp) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `recording-${timestamp.replace(/[/:]/g, '-')}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleAudioPlay = (audio) => {
    if (activeAudioRef.current && activeAudioRef.current !== audio) {
      activeAudioRef.current.pause()
      activeAudioRef.current.currentTime = 0
    }
    
    activeAudioRef.current = audio
    onRecordingPlay()
  }

  const handleAudioEnd = () => {
    activeAudioRef.current = null
    onRecordingEnd()
  }

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Recorder</h3>

      <div className="flex justify-center mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-4 rounded-full ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-primary hover:bg-opacity-80'
          }`}
        >
          {isRecording ? (
            <StopIcon className="w-8 h-8" />
          ) : (
            <MicrophoneIcon className="w-8 h-8" />
          )}
        </button>
      </div>

      <div className="space-y-3">
        {recordings.map((recording, index) => (
          <div key={index} className="bg-secondary rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-light">{recording.timestamp}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadRecording(recording.url, recording.timestamp)}
                  className="text-primary hover:text-opacity-80"
                >
                  Download
                </button>
                <button
                  onClick={() => deleteRecording(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <audio 
              controls 
              src={recording.url} 
              className="w-full"
              onPlay={(e) => handleAudioPlay(e.target)}
              onEnded={handleAudioEnd}
              onPause={handleAudioEnd}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AudioRecorder