/*
  # Configuración inicial de la base de datos multimedia

  1. Nuevas Tablas
    - `profiles`
      - `id` (uuid, primary key) - ID del usuario
      - `email` (text) - Email del usuario
      - `created_at` (timestamp) - Fecha de creación
      - `updated_at` (timestamp) - Fecha de actualización
    
    - `media_files`
      - `id` (uuid, primary key) - ID del archivo
      - `title` (text) - Título del archivo
      - `artist` (text) - Artista o creador
      - `type` (text) - Tipo de archivo (video, audio, image)
      - `url` (text) - URL del archivo en Supabase Storage
      - `cover` (text) - URL de la imagen de portada
      - `user_id` (uuid) - ID del usuario propietario
      - `created_at` (timestamp) - Fecha de creación
      - `updated_at` (timestamp) - Fecha de actualización

    - `recordings`
      - `id` (uuid, primary key) - ID de la grabación
      - `title` (text) - Título de la grabación
      - `url` (text) - URL del archivo en Supabase Storage
      - `user_id` (uuid) - ID del usuario propietario
      - `created_at` (timestamp) - Fecha de creación

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para que los usuarios solo puedan acceder a sus propios archivos
*/

-- Crear tabla de perfiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de archivos multimedia
CREATE TABLE media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text,
  type text NOT NULL CHECK (type IN ('video', 'audio', 'image')),
  url text NOT NULL,
  cover text,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de grabaciones
CREATE TABLE recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Políticas de seguridad para media_files
CREATE POLICY "Users can view own media files"
  ON media_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own media files"
  ON media_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own media files"
  ON media_files FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own media files"
  ON media_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas de seguridad para recordings
CREATE POLICY "Users can view own recordings"
  ON recordings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recordings"
  ON recordings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recordings"
  ON recordings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at
  BEFORE UPDATE ON media_files
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();