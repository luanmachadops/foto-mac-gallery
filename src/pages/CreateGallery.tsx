
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, ArrowLeft, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const CreateGallery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_name: '',
    client_email: '',
    password: '',
    expires_at: '',
    is_public: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const galleryData = {
        ...formData,
        user_id: user.id,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
      };

      const { data, error } = await supabase
        .from('galleries')
        .insert(galleryData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Galeria criada com sucesso!');
      navigate(`/gallery/${data.id}`);
    } catch (error: any) {
      console.error('Erro ao criar galeria:', error);
      toast.error('Erro ao criar galeria: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
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
              <span className="text-xl font-bold text-white">FotoProof</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Criar Nova Galeria</h1>

          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Informações da Galeria</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Título da Galeria *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Casamento João e Maria"
                    required
                    className="glass border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descrição opcional da galeria"
                    rows={3}
                    className="glass border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_name" className="text-white">Nome do Cliente *</Label>
                    <Input
                      id="client_name"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleInputChange}
                      placeholder="Nome completo"
                      required
                      className="glass border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client_email" className="text-white">Email do Cliente *</Label>
                    <Input
                      id="client_email"
                      name="client_email"
                      type="email"
                      value={formData.client_email}
                      onChange={handleInputChange}
                      placeholder="cliente@email.com"
                      required
                      className="glass border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Senha da Galeria</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Senha opcional para proteger a galeria"
                      className="glass border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires_at" className="text-white">Data de Expiração</Label>
                    <div className="relative">
                      <Input
                        id="expires_at"
                        name="expires_at"
                        type="datetime-local"
                        value={formData.expires_at}
                        onChange={handleInputChange}
                        className="glass border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="is_public"
                    name="is_public"
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 bg-transparent border-white/20 rounded focus:ring-purple-500"
                  />
                  <Label htmlFor="is_public" className="text-white">
                    Galeria pública (não requer senha)
                  </Label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {loading ? 'Criando...' : 'Criar Galeria'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateGallery;
