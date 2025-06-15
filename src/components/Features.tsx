
import { Upload, Share2, Eye, Download, Lock, Palette } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Rápido e Seguro',
      description: 'Carregue centenas de fotos em segundos com nossa tecnologia de upload otimizada. Suporte para RAW e todos os formatos populares.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Share2,
      title: 'Compartilhamento Inteligente',
      description: 'Crie galerias privadas com links personalizados. Seus clientes acessam facilmente sem precisar criar conta.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Eye,
      title: 'Visualização Premium',
      description: 'Interface elegante que destaca suas fotos. Zoom avançado, slideshow automático e visualização em tela cheia.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Download,
      title: 'Download Seletivo',
      description: 'Clientes podem selecionar e baixar apenas as fotos desejadas. Controle total sobre resolução e marca d\'água.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Lock,
      title: 'Proteção Avançada',
      description: 'Galerias protegidas por senha, marcas d\'água personalizadas e controle de acesso por tempo limitado.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Palette,
      title: 'Brand Personalizada',
      description: 'Customize a aparência das galerias com sua marca. Logo, cores e domínio personalizado disponíveis.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="recursos" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Recursos que fazem a
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> diferença</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Tudo que você precisa para impressionar seus clientes e profissionalizar 
            seu workflow de entrega de fotos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl glass hover:shadow-xl transition-all duration-500 animate-fade-in border border-slate-200/50"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 p-6 glass rounded-2xl border border-slate-200/50">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-indigo-600">5.000+</span> fotógrafos confiam na nossa plataforma
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
