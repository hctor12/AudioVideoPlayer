import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const uploadFile = async (file, bucket, folder = '') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`
  const filePath = folder ? `${folder}/${fileName}` : fileName

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}

export const deleteFile = async (url, bucket) => {
  const path = url.split(`${bucket}/`)[1]
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) throw error
}