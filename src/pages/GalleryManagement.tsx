
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, ArrowLeft, Share2, Eye, Download, Copy, Calendar, Lock, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Gallery {
  id: string;
  title: string;
  description: string;
  client_name: string;
  client_email: string;
  is_public: boolean;
  password?: string;
  expires_at?: string;
  created_at: string;
}

interface ClientSelection {
  id: string;
  photo_id: string;
  client_name: string;
  client_email: string;
  selected_at: string;
  notes?: string;
  photo: {
    file_url: string;
    file_name: string;
    thumbnail_url?: string;
  };
}

const GalleryManagement = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [selections, setSelections] = useState<ClientSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    fetchGalleryData();
  }, [id, user]);

  const fetchGalleryData = async () => {
    try {
      // Buscar dados da galeria
      const { data: galleryData, error: galleryError } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .single();

      if (galleryError) throw galleryError;
      
      setGallery(galleryData);
      setIsPublic(galleryData.is_public || false);
      setPassword(galleryData.password || '');
      setExpiresAt(galleryData.expires_at ? galleryData.expires_at.split('T')[0] : '');

      // Buscar seleções de clientes
      const { data: selectionsData, error: selectionsError } = await supabase
        .from('client_selections')
        .select(`
          *,
          photo:photos(file_url, file_name, thumbnail_url)
        `)
        .eq('gallery_id', id);

      if (selectionsError) throw selectionsError;
      setSelections(selectionsData || []);

    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados da galeria');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateGallerySettings = async () => {
    if (!gallery) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('galleries')
        .update({
          is_public: isPublic,
          password: password || null,
          expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
        })
        .eq('id', gallery.id);

      if (error) throw error;
      
      toast.success('Configurações atualizadas!');
      await fetchGalleryData();
    } catch (error: any) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar configurações');
    } finally {
      setUpdating(false);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/shared/${gallery?.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copiado para a área de transferência!');
  };

  const getSelectionStats = () => {
    const uniqueClients = new Set(selections.map(s => s.client_email)).size;
    return {
      totalSelections: selections.length,
      uniqueClients
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
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

  const stats = getSelectionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/gallery/${gallery.id}`)}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Gerenciar Galeria</h1>
                  <p className="text-sm text-gray-300">{gallery.title}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate(`/gallery/${gallery.id}`)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Galeria
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total de Seleções</CardTitle>
              <Download className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalSelections}</div>
            </CardContent>
          </Card>

          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Clientes Únicos</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.uniqueClients}</div>
            </CardContent>
          </Card>

          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Status</CardTitle>
              <Share2 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isPublic ? 'Público' : 'Privado'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configurações de Compartilhamento */}
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Share2 className="w-5 h-5 mr-2" />
              Configurações de Compartilhamento
            </CardTitle>
            <CardDescription className="text-gray-300">
              Configure como os clientes podem acessar esta galeria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Público/Privado */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Galeria Pública</Label>
                <p className="text-sm text-gray-400">
                  Permitir que clientes acessem a galeria sem login
                </p>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <Separator className="bg-white/20" />

            {/* Senha */}
            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Senha (opcional)
              </Label>
              <Input
                type="password"
                placeholder="Digite uma senha para proteger a galeria"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Data de Expiração */}
            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Data de Expiração (opcional)
              </Label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            {/* Link de Compartilhamento */}
            {isPublic && (
              <div className="space-y-2">
                <Label className="text-white">Link de Compartilhamento</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/shared/${gallery.id}`}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button onClick={copyShareLink} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={updateGallerySettings}
              disabled={updating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {updating ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </CardContent>
        </Card>

        {/* Seleções dos Clientes */}
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Seleções dos Clientes</CardTitle>
            <CardDescription className="text-gray-300">
              Fotos selecionadas pelos seus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selections.length === 0 ? (
              <div className="text-center py-8">
                <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Nenhuma seleção ainda</h3>
                <p className="text-gray-400">Os clientes ainda não selecionaram fotos desta galeria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(
                  selections.reduce((acc, selection) => {
                    if (!acc[selection.client_email]) {
                      acc[selection.client_email] = [];
                    }
                    acc[selection.client_email].push(selection);
                    return acc;
                  }, {} as Record<string, ClientSelection[]>)
                ).map(([clientEmail, clientSelections]) => (
                  <div key={clientEmail} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{clientSelections[0].client_name}</h4>
                        <p className="text-sm text-gray-400">{clientEmail}</p>
                      </div>
                      <Badge variant="secondary" className="bg-white/10 text-white">
                        {clientSelections.length} foto{clientSelections.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {clientSelections.map((selection) => (
                        <div key={selection.id} className="relative group">
                          <img
                            src={selection.photo.thumbnail_url || selection.photo.file_url}
                            alt={selection.photo.file_name}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <p className="text-white text-xs text-center px-2">
                              {new Date(selection.selected_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="bg-white/20" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GalleryManagement;
