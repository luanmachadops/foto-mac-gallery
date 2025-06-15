
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, Camera, Users, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              Compartilhe suas
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> fotos </span>
              com elegância
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A plataforma mais elegante para fotógrafos profissionais compartilharem, 
              organizarem e receberem aprovação de fotos dos seus clientes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Começar Teste Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="px-8 py-4 rounded-xl text-lg font-semibold border-2 border-slate-300 hover:border-slate-400 transition-all duration-300">
                <Play className="mr-2 w-5 h-5" />
                Ver Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-500" />
                <span>Upload ilimitado</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>Galeria privada</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                <span>100% seguro</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="glass rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg animate-pulse"></div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-white text-sm">Casamento_Maria_João_2024</div>
                  <div className="text-slate-400 text-sm">156 fotos selecionadas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
