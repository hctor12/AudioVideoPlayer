import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { MediaUpload } from './MediaUpload'
import toast from 'react-hot-toast'
import { deleteFile } from '../lib/supabase'
import { TrashIcon } from '@heroicons/react/24/solid'

export function UserLibrary({ onTrackSelect }) {
  const [mediaFiles, setMediaFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadMediaFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setMediaFiles(data)
    } catch (error) {
      console.error('Error al cargar archivos:', error)
      toast.error('Error al cargar la biblioteca')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMediaFiles()
  }, [user])

  const handleDelete = async (file) => {
    try {
      // Eliminar archivo de Storage
      await deleteFile(file.url, 'media')
      if (file.cover && !file.cover.includes('placehold.co')) {
        await deleteFile(file.cover, 'media')
      }

      // Eliminar registro de la base de datos
      const { error } = await supabase
        .from('media_files')
        .delete()
        .match({ id: file.id })

      if (error) throw error

      toast.success('Archivo eliminado correctamente')
      loadMediaFiles()
    } catch (error) {
      console.error('Error al eliminar archivo:', error)
      toast.error('Error al eliminar el archivo')
    }
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-light">
        Inicia sesión para ver tu biblioteca
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <MediaUpload onUploadComplete={loadMediaFiles} />
      
      {loading ? (
        <div className="p-4 text-center text-light">
          Cargando biblioteca...
        </div>
      ) : mediaFiles.length === 0 ? (
        <div className="p-4 text-center text-light">
          No hay archivos en tu biblioteca
        </div>
      ) : (
        <div className="space-y-2">
          {mediaFiles.map(file => (
            <div
              key={file.id}
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <button
                onClick={() => onTrackSelect(file)}
                className="flex-1 flex items-center"
              >
                <div className="relative w-16 h-16 mr-3">
                  <img
                    src={file.cover || file.url}
                    alt={file.title}
                    className="w-full h-full object-cover rounded"
                  />
                  {file.type === 'video' && (
                    <span className="absolute top-1 right-1 bg-primary text-xs px-1 rounded">
                      Video
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium">{file.title}</p>
                  <p className="text-sm text-light">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleDelete(file)}
                className="p-2 text-red-500 hover:text-red-400"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}