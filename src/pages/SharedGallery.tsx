
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Camera, Heart, Download, Lock, User, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface Gallery {
  id: string;
  title: string;
  description: string;
  client_name: string;
  client_email: string;
  password?: string;
  expires_at?: string;
  created_at: string;
}

interface Photo {
  id: string;
  file_url: string;
  thumbnail_url?: string;
  file_name: string;
  file_size?: number;
  created_at: string;
}

const SharedGallery = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    checkGalleryAccess();
  }, [id]);

  const checkGalleryAccess = async () => {
    try {
      const { data: galleryData, error } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (error) {
        toast.error('Galeria não encontrada ou não está pública');
        return;
      }

      // Verificar se expirou
      if (galleryData.expires_at && new Date(galleryData.expires_at) < new Date()) {
        toast.error('Esta galeria expirou');
        return;
      }

      // Verificar se precisa de senha
      if (galleryData.password) {
        setPasswordRequired(true);
        setGallery(galleryData);
        setLoading(false);
        return;
      }

      setGallery(galleryData);
      await loadPhotos();
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar galeria');
    }
  };

  const verifyPassword = async () => {
    if (!gallery || !passwordInput) {
      toast.error('Digite a senha');
      return;
    }

    if (passwordInput === gallery.password) {
      setPasswordRequired(false);
      await loadPhotos();
    } else {
      toast.error('Senha incorreta');
      setPasswordInput('');
    }
  };

  const loadPhotos = async () => {
    try {
      const { data: photosData, error } = await supabase
        .from('photos')
        .select('*')
        .eq('gallery_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(photosData || []);
    } catch (error: any) {
      console.error('Erro ao carregar fotos:', error);
      toast.error('Erro ao carregar fotos');
    } finally {
      setLoading(false);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const submitSelections = async () => {
    if (!clientName || !clientEmail) {
      toast.error('Preencha seu nome e email');
      return;
    }

    if (selectedPhotos.size === 0) {
      toast.error('Selecione pelo menos uma foto');
      return;
    }

    setSubmitting(true);
    try {
      // Deletar seleções anteriores deste cliente
      await supabase
        .from('client_selections')
        .delete()
        .eq('gallery_id', id)
        .eq('client_email', clientEmail);

      // Inserir novas seleções
      const selections = Array.from(selectedPhotos).map(photoId => ({
        gallery_id: id!,
        photo_id: photoId,
        client_name: clientName,
        client_email: clientEmail
      }));

      const { error } = await supabase
        .from('client_selections')
        .insert(selections);

      if (error) throw error;

      toast.success(`${selectedPhotos.size} foto(s) selecionada(s) com sucesso!`);
      
    } catch (error: any) {
      console.error('Erro ao salvar seleções:', error);
      toast.error('Erro ao salvar suas seleções');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando galeria...</div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white">Galeria Protegida</CardTitle>
            <p className="text-gray-300">Esta galeria requer uma senha para acesso</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Senha</Label>
              <Input
                type="password"
                placeholder="Digite a senha"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              onClick={verifyPassword}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Acessar Galeria
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Galeria não encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{gallery.title}</h1>
            {gallery.description && (
              <p className="text-gray-300 mb-4">{gallery.description}</p>
            )}
            <p className="text-sm text-gray-400">
              Criado em {new Date(gallery.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Informações do Cliente */}
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="text-white">Suas Informações</CardTitle>
            <p className="text-gray-300">Preencha para salvar suas seleções</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <User className="w-4 h-4 mr-2" />
                Nome
              </Label>
              <Input
                placeholder="Seu nome"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contador de Seleções */}
        {selectedPhotos.size > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
              <CardContent className="p-4 flex items-center space-x-4">
                <Badge variant="secondary" className="bg-green-500 text-white">
                  {selectedPhotos.size} selecionada{selectedPhotos.size !== 1 ? 's' : ''}
                </Badge>
                <Button
                  onClick={submitSelections}
                  disabled={submitting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {submitting ? 'Salvando...' : 'Salvar Seleções'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Grid de Fotos */}
        {photos.length === 0 ? (
          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma foto encontrada</h3>
              <p className="text-gray-300 text-center">
                Esta galeria ainda não possui fotos
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card 
                key={photo.id} 
                className={`glass border-white/20 bg-white/10 backdrop-blur-md overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                  selectedPhotos.has(photo.id) ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => togglePhotoSelection(photo.id)}
              >
                <div className="aspect-square relative">
                  <img
                    src={photo.thumbnail_url || photo.file_url}
                    alt={photo.file_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Overlay de Seleção */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                    selectedPhotos.has(photo.id) ? 'bg-green-500/20' : 'bg-black/20 opacity-0 hover:opacity-100'
                  }`}>
                    {selectedPhotos.has(photo.id) ? (
                      <div className="bg-green-500 rounded-full p-2">
                        <Heart className="w-6 h-6 text-white fill-current" />
                      </div>
                    ) : (
                      <div className="bg-white/20 rounded-full p-2">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Indicador de Seleção */}
                  {selectedPhotos.has(photo.id) && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        Selecionada
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Instruções */}
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Como selecionar suas fotos favoritas</h3>
            <p className="text-gray-300">
              Clique nas fotos que você gostaria de receber. As fotos selecionadas terão um coração verde. 
              Preencha seus dados acima e clique em "Salvar Seleções" quando terminar.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SharedGallery;
