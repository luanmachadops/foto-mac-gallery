
-- Criar enum para tipos de planos de assinatura
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'professional', 'enterprise');

-- Criar enum para status de assinatura
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'past_due');

-- Tabela de perfis de usuários (fotógrafos)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  business_name TEXT,
  phone TEXT,
  website TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de assinaturas
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de galerias de fotos
CREATE TABLE public.galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  password TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de fotos
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID NOT NULL REFERENCES public.galleries ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  is_selected BOOLEAN DEFAULT FALSE,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Políticas RLS para subscriptions
CREATE POLICY "Users can view their own subscription" 
  ON public.subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
  ON public.subscriptions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
  ON public.subscriptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para galleries
CREATE POLICY "Users can view their own galleries" 
  ON public.galleries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own galleries" 
  ON public.galleries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own galleries" 
  ON public.galleries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own galleries" 
  ON public.galleries FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para photos
CREATE POLICY "Users can view photos from their galleries" 
  ON public.photos FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.galleries 
      WHERE galleries.id = photos.gallery_id 
      AND galleries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert photos to their galleries" 
  ON public.photos FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.galleries 
      WHERE galleries.id = gallery_id 
      AND galleries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update photos in their galleries" 
  ON public.photos FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.galleries 
      WHERE galleries.id = photos.gallery_id 
      AND galleries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete photos from their galleries" 
  ON public.photos FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.galleries 
      WHERE galleries.id = photos.gallery_id 
      AND galleries.user_id = auth.uid()
    )
  );

-- Função para criar perfil automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name'
  );
  
  -- Criar assinatura gratuita por padrão
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (new.id, 'free', 'active');
  
  RETURN new;
END;
$$;

-- Trigger para executar a função quando um novo usuário se cadastra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criar bucket para armazenamento de fotos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true);

-- Política para permitir upload de fotos
CREATE POLICY "Users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para permitir visualização de fotos
CREATE POLICY "Users can view photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'photos' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      auth.role() = 'anon'
    )
  );

-- Política para permitir atualização de fotos
CREATE POLICY "Users can update their photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para permitir exclusão de fotos
CREATE POLICY "Users can delete their photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
