
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Professional Animated Background */}
      <div className="absolute inset-0 gradient-professional">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzk0YTNiOCIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPHN2Zz4=')] opacity-20"></div>
        
        {/* Enhanced Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-slate-500/20 rounded-full blur-xl animate-float-enhanced"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-float-enhanced" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-professional-400/20 rounded-full blur-xl animate-float-enhanced" style={{ animationDelay: '4s' }}></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Professional Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-white/20 mb-8 animate-fade-up hover-glow">
            <Shield className="w-4 h-4 text-slate-300 mr-2" />
            <span className="text-white/90 text-sm font-medium">Plataforma 100% Segura e Confiável</span>
          </div>

          {/* Main Heading with Staggered Animation */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-up leading-tight">
            A Plataforma Definitiva para
            <span className="bg-gradient-to-r from-slate-300 to-blue-300 bg-clip-text text-transparent block animate-scale-in">
              Seleção de Fotos
            </span>
          </h1>

          {/* Enhanced Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto animate-fade-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Envie, organize e compartilhe suas fotos com clientes de forma elegante e profissional. 
            Simplifique seu workflow e impressione seus clientes.
          </p>

          {/* Feature Pills with Stagger Animation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center px-4 py-2 rounded-full glass border border-white/20 animate-stagger hover-lift">
              <Camera className="w-4 h-4 text-slate-300 mr-2" />
              <span className="text-white/90 text-sm font-medium">Upload Ilimitado</span>
            </div>
            <div className="flex items-center px-4 py-2 rounded-full glass border border-white/20 animate-stagger hover-lift">
              <Zap className="w-4 h-4 text-slate-300 mr-2" />
              <span className="text-white/90 text-sm font-medium">Seleção Rápida</span>
            </div>
            <div className="flex items-center px-4 py-2 rounded-full glass border border-white/20 animate-stagger hover-lift">
              <Shield className="w-4 h-4 text-slate-300 mr-2" />
              <span className="text-white/90 text-sm font-medium">Totalmente Seguro</span>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className="gradient-card hover:shadow-2xl hover:shadow-slate-500/25 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-350 transform hover:scale-105 hover:-translate-y-1"
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
            >
              {user ? 'Ir para Dashboard' : 'Começar Grátis Agora'}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-slate-500/50 bg-slate-500/10 text-slate-200 hover:bg-slate-500/20 hover:border-slate-400/70 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-350 hover-lift"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Enhanced Stats with Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center animate-slide-in-left">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-pulse-glow">10k+</div>
              <div className="text-white/70">Fotógrafos Ativos</div>
            </div>
            <div className="text-center animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-pulse-glow">1M+</div>
              <div className="text-white/70">Fotos Processadas</div>
            </div>
            <div className="text-center animate-slide-in-right">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-pulse-glow">99.9%</div>
              <div className="text-white/70">Uptime Garantido</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center hover:border-white/50 transition-colors duration-300">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
