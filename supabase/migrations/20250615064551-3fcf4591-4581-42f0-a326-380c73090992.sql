
-- Criar bucket para fotos se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos', 
  'photos', 
  true, 
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
) ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket photos
CREATE POLICY "Usuários podem fazer upload nas suas pastas" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Fotos são publicamente visíveis" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Usuários podem deletar suas fotos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Adicionar RLS para galerias públicas
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;

-- Política para que fotógrafos vejam suas galerias
CREATE POLICY "Fotógrafos podem ver suas galerias" ON galleries
FOR ALL USING (auth.uid() = user_id);

-- Política para acesso público a galerias compartilhadas
CREATE POLICY "Galerias públicas são visíveis" ON galleries
FOR SELECT USING (
  is_public = true AND 
  (expires_at IS NULL OR expires_at > now())
);

-- RLS para fotos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Política para que fotógrafos vejam suas fotos
CREATE POLICY "Fotógrafos podem gerenciar suas fotos" ON photos
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM galleries 
    WHERE galleries.id = photos.gallery_id 
    AND galleries.user_id = auth.uid()
  )
);

-- Política para acesso público a fotos de galerias compartilhadas
CREATE POLICY "Fotos de galerias públicas são visíveis" ON photos
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM galleries 
    WHERE galleries.id = photos.gallery_id 
    AND galleries.is_public = true 
    AND (galleries.expires_at IS NULL OR galleries.expires_at > now())
  )
);

-- Criar tabela para seleções de clientes
CREATE TABLE IF NOT EXISTS client_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  UNIQUE(gallery_id, photo_id, client_email)
);

-- RLS para seleções de clientes
ALTER TABLE client_selections ENABLE ROW LEVEL SECURITY;

-- Política para que fotógrafos vejam seleções das suas galerias
CREATE POLICY "Fotógrafos podem ver seleções das suas galerias" ON client_selections
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM galleries 
    WHERE galleries.id = client_selections.gallery_id 
    AND galleries.user_id = auth.uid()
  )
);

-- Política para que clientes possam fazer seleções em galerias públicas
CREATE POLICY "Clientes podem selecionar fotos em galerias públicas" ON client_selections
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM galleries 
    WHERE galleries.id = client_selections.gallery_id 
    AND galleries.is_public = true 
    AND (galleries.expires_at IS NULL OR galleries.expires_at > now())
  )
);

-- Política para que clientes possam ver suas próprias seleções
CREATE POLICY "Clientes podem ver suas seleções" ON client_selections
FOR SELECT USING (true);

-- Política para que clientes possam deletar suas seleções
CREATE POLICY "Clientes podem deletar suas seleções" ON client_selections
FOR DELETE USING (true);
