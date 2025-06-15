
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Camera, Users, Crown, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

interface Profile {
  first_name?: string;
  last_name?: string;
  business_name?: string;
}

interface Subscription {
  plan: 'free' | 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      // Buscar perfil do usuário
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, business_name')
        .eq('id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Buscar assinatura
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', user?.id)
        .single();

      if (subscriptionData) {
        setSubscription(subscriptionData);
      }

      // Buscar galerias
      const { data: galleriesData } = await supabase
        .from('galleries')
        .select('id, title, description, client_name, client_email, created_at, cover_image_url')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (galleriesData) {
        setGalleries(galleriesData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getPlanName = (plan: string) => {
    const planNames = {
      free: 'Gratuito',
      basic: 'Básico',
      professional: 'Profissional',
      enterprise: 'Empresarial'
    };
    return planNames[plan as keyof typeof planNames] || plan;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FotoProof</h1>
              <p className="text-sm text-gray-300">
                Olá, {profile?.first_name || user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white">{getPlanName(subscription?.plan || 'free')}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 text-white" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total de Galerias</CardTitle>
              <Camera className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{galleries.length}</div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Plano Ativo</CardTitle>
              <Crown className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getPlanName(subscription?.plan || 'free')}</div>
            </CardContent>
          </Card>

          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Status</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {subscription?.status === 'active' ? 'Ativo' : 'Inativo'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Galleries Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Suas Galerias</h2>
          <Button 
            onClick={() => navigate('/create-gallery')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Galeria
          </Button>
        </div>

        {galleries.length === 0 ? (
          <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma galeria criada</h3>
              <p className="text-gray-300 text-center mb-6">
                Comece criando sua primeira galeria para compartilhar fotos com seus clientes
              </p>
              <Button 
                onClick={() => navigate('/create-gallery')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Galeria
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Card key={gallery.id} className="glass border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-white">{gallery.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    Cliente: {gallery.client_name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-2">
                    Criado em: {new Date(gallery.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => navigate(`/gallery/${gallery.id}`)}
                  >
                    Ver Galeria
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
