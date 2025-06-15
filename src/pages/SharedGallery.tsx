
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Camera, Heart, Download, Lock, User, Mail, Eye, Calendar, CheckCircle, X } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const openCarousel = (photoIndex: number) => {
    setSelectedPhotoIndex(photoIndex);
    setViewMode('carousel');
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
      setIsSubmitted(true);
      
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
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <div className="text-white text-xl">Carregando galeria...</div>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Galeria Protegida</CardTitle>
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
        <div className="text-center">
          <Camera className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <div className="text-white text-2xl mb-2">Galeria não encontrada</div>
          <p className="text-gray-300">Verifique se o link está correto</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md w-full max-w-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Seleções Enviadas!</h2>
            <p className="text-gray-300 text-lg mb-2">
              Obrigado, {clientName}! Suas {selectedPhotos.size} foto(s) selecionada(s) foram enviadas com sucesso.
            </p>
            <p className="text-gray-400 mb-6">
              Você receberá um email de confirmação em {clientEmail}
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedPhotos(new Set());
                setClientName('');
                setClientEmail('');
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Fazer Nova Seleção
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewMode === 'carousel') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <Button
          onClick={() => setViewMode('grid')}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-60 text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {photos.map((photo, index) => (
              <CarouselItem key={photo.id} className="flex items-center justify-center">
                <div className="relative">
                  <img
                    src={photo.file_url}
                    alt={photo.file_name}
                    className="max-h-[80vh] max-w-[90vw] object-contain"
                  />
                  <Button
                    onClick={() => togglePhotoSelection(photo.id)}
                    className={`absolute bottom-4 right-4 ${
                      selectedPhotos.has(photo.id)
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${selectedPhotos.has(photo.id) ? 'fill-current' : ''}`} />
                    {selectedPhotos.has(photo.id) ? 'Selecionada' : 'Selecionar'}
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass border-b border-white/20 bg-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{gallery.title}</h1>
            {gallery.description && (
              <p className="text-gray-300 mb-4 text-lg max-w-2xl mx-auto">{gallery.description}</p>
            )}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Criado em {new Date(gallery.created_at).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {photos.length} foto{photos.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Informações do Cliente */}
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="text-white text-xl">Suas Informações</CardTitle>
            <p className="text-gray-300">Preencha para salvar suas seleções</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white flex items-center text-sm font-medium">
                <User className="w-4 h-4 mr-2" />
                Nome Completo
              </Label>
              <Input
                placeholder="Seu nome completo"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white flex items-center text-sm font-medium">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md mb-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Como selecionar suas fotos favoritas</h3>
            <p className="text-gray-300">
              Clique nas fotos que você gostaria de receber. As fotos selecionadas terão um coração verde. 
              Você pode clicar em qualquer foto para visualizá-la em tela cheia.
            </p>
          </CardContent>
        </Card>

        {/* Grid de Fotos */}
        {photos.length === 0 ? (
          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Camera className="w-20 h-20 text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">Nenhuma foto encontrada</h3>
              <p className="text-gray-300 text-center max-w-md">
                Esta galeria ainda não possui fotos. Entre em contato com o fotógrafo para mais informações.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo, index) => (
              <Card 
                key={photo.id} 
                className={`glass border-white/20 bg-white/10 backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  selectedPhotos.has(photo.id) ? 'ring-2 ring-green-500 shadow-green-500/25' : ''
                }`}
              >
                <div className="aspect-square relative group">
                  <img
                    src={photo.thumbnail_url || photo.file_url}
                    alt={photo.file_name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onClick={() => openCarousel(index)}
                  />
                  
                  {/* Overlay de Seleção */}
                  <div 
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      selectedPhotos.has(photo.id) 
                        ? 'bg-green-500/30' 
                        : 'bg-black/20 opacity-0 group-hover:opacity-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePhotoSelection(photo.id);
                    }}
                  >
                    <div className={`rounded-full p-3 transition-all duration-300 ${
                      selectedPhotos.has(photo.id)
                        ? 'bg-green-500 scale-110'
                        : 'bg-white/20 group-hover:bg-white/30'
                    }`}>
                      <Heart className={`w-6 h-6 text-white transition-all duration-300 ${
                        selectedPhotos.has(photo.id) ? 'fill-current scale-110' : ''
                      }`} />
                    </div>
                  </div>

                  {/* Indicador de Seleção */}
                  {selectedPhotos.has(photo.id) && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white border-0 shadow-lg">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        Selecionada
                      </Badge>
                    </div>
                  )}

                  {/* Botão de visualizar */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-black/40 hover:bg-black/60 text-white h-8 px-2"
                      onClick={() => openCarousel(index)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Contador de Seleções - Fixo */}
        {selectedPhotos.size > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Card className="glass border-white/20 bg-white/10 backdrop-blur-md shadow-xl">
              <CardContent className="p-4 flex items-center space-x-4">
                <Badge variant="secondary" className="bg-green-500 text-white text-sm px-3 py-1">
                  <Heart className="w-4 h-4 mr-2 fill-current" />
                  {selectedPhotos.size} selecionada{selectedPhotos.size !== 1 ? 's' : ''}
                </Badge>
                <Button
                  onClick={submitSelections}
                  disabled={submitting || !clientName || !clientEmail}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                >
                  {submitting ? 'Enviando...' : 'Enviar Seleções'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default SharedGallery;
