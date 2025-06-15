import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, ArrowLeft, Upload, Download, Share2, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Gallery {
  id: string;
  title: string;
  description: string;
  client_name: string;
  client_email: string;
  created_at: string;
  cover_image_url?: string;
}

interface Photo {
  id: string;
  file_url: string;
  thumbnail_url?: string;
  file_name: string;
  file_size?: number;
  is_selected: boolean;
  created_at: string;
}

const Gallery = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    fetchGallery();
    fetchPhotos();
  }, [id, user]);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setGallery(data);
    } catch (error: any) {
      console.error('Erro ao carregar galeria:', error);
      toast.error('Erro ao carregar galeria');
      navigate('/dashboard');
    }
  };

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('gallery_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar fotos:', error);
      toast.error('Erro ao carregar fotos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user || !id) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('photos')
          .insert({
            gallery_id: id,
            file_url: publicUrl,
            file_name: file.name,
            file_size: file.size
          });

        if (dbError) throw dbError;
      } catch (error: any) {
        console.error('Erro ao fazer upload:', error);
        toast.error(`Erro ao fazer upload de ${file.name}`);
      }
    });

    await Promise.all(uploadPromises);
    setUploading(false);
    fetchPhotos();
    toast.success('Upload concluído!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando galeria...</div>
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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
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
                  <h1 className="text-xl font-bold text-white">{gallery.title}</h1>
                  <p className="text-sm text-gray-300">Cliente: {gallery.client_name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="photo-upload"
              />
              <Button
                onClick={() => document.getElementById('photo-upload')?.click()}
                disabled={uploading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Enviando...' : 'Upload Fotos'}
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate(`/gallery/${id}/manage`)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Gallery Info */}
        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="text-white">Informações da Galeria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
              <div>
                <p className="text-sm text-gray-400">Total de Fotos</p>
                <p className="text-2xl font-bold">{photos.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Criado em</p>
                <p className="text-lg">{new Date(gallery.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email do Cliente</p>
                <p className="text-lg">{gallery.client_email}</p>
              </div>
            </div>
            {gallery.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-400">Descrição</p>
                <p className="text-white">{gallery.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma foto enviada</h3>
              <p className="text-gray-300 text-center mb-6">
                Comece fazendo o upload das primeiras fotos desta galeria
              </p>
              <Button
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Fotos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="glass border-white/20 bg-white/10 backdrop-blur-md overflow-hidden hover:bg-white/20 transition-all">
                <div className="aspect-square relative">
                  <img
                    src={photo.thumbnail_url || photo.file_url}
                    alt={photo.file_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="secondary">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-white truncate">{photo.file_name}</p>
                  <p className="text-xs text-gray-400">
                    {photo.file_size ? (photo.file_size / 1024 / 1024).toFixed(1) + ' MB' : ''}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
