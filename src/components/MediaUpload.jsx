import { useState } from 'react'
import { uploadFile } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export function MediaUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false)
  const { user } = useAuth()

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0]
      if (!file) return

      setUploading(true)

      // Determinar el tipo de archivo
      const fileType = file.type.startsWith('video/') 
        ? 'video' 
        : file.type.startsWith('audio/') 
          ? 'audio' 
          : 'image'

      // Subir archivo a Supabase Storage
      const url = await uploadFile(file, 'media', `${user.id}/${fileType}s`)

      // Crear miniatura para videos
      let cover = null
      if (fileType === 'video') {
        const video = document.createElement('video')
        video.src = url
        await new Promise(resolve => {
          video.onloadeddata = () => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0)
            canvas.toBlob(async (blob) => {
              const coverUrl = await uploadFile(
                new File([blob], 'cover.jpg', { type: 'image/jpeg' }),
                'media',
                `${user.id}/covers`
              )
              cover = coverUrl
              resolve()
            }, 'image/jpeg')
          }
        })
      } else if (fileType === 'audio') {
        cover = 'https://placehold.co/400x400?text=🎵'
      }

      // Guardar información en la base de datos
      const { error } = await supabase.from('media_files').insert({
        title: file.name.split('.')[0],
        type: fileType,
        url,
        cover,
        user_id: user.id,
      })

      if (error) throw error

      toast.success('Archivo subido correctamente')
      onUploadComplete()
    } catch (error) {
      console.error('Error al subir archivo:', error)
      toast.error('Error al subir el archivo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4">
      <label className="block w-full">
        <span className="sr-only">Subir archivo</span>
        <input
          type="file"
          accept="video/*,audio/*,image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-white
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-opacity-80
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>
      {uploading && (
        <div className="mt-2 text-sm text-light">
          Subiendo archivo...
        </div>
      )}
    </div>
  )
}