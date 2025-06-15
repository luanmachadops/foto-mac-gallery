
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Iniciante',
      price: 29,
      description: 'Perfeito para fotógrafos começando',
      features: [
        '5 galerias por mês',
        'Até 500 fotos por galeria',
        'Upload até 2GB',
        'Suporte por email',
        'Marca d\'água personalizada',
        'Galerias protegidas por senha'
      ],
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      name: 'Profissional',
      price: 59,
      description: 'Para fotógrafos estabelecidos',
      features: [
        'Galerias ilimitadas',
        'Até 2.000 fotos por galeria',
        'Upload até 10GB',
        'Suporte prioritário',
        'Brand personalizada completa',
        'Domínio personalizado',
        'Analytics avançado',
        'Backup automático'
      ],
      icon: Crown,
      gradient: 'from-indigo-500 to-purple-500',
      popular: true
    },
    {
      name: 'Estúdio',
      price: 99,
      description: 'Para estúdios e equipes',
      features: [
        'Tudo do Profissional',
        'Fotos ilimitadas por galeria',
        'Upload até 50GB',
        'Suporte dedicado 24/7',
        'Múltiplos usuários',
        'API personalizada',
        'Integrações avançadas',
        'Manager dedicado'
      ],
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      popular: false
    }
  ];

  return (
    <section id="precos" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Planos que crescem
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> com você</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Escolha o plano ideal para seu negócio. Sem taxas ocultas, sem compromissos anuais.
          </p>
          
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg">
            <button className="px-4 py-2 bg-white rounded-md shadow-sm text-slate-800 font-medium">
              Mensal
            </button>
            <button className="px-4 py-2 text-slate-600 font-medium">
              Anual (2 meses grátis)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border transition-all duration-500 animate-fade-in ${
                plan.popular
                  ? 'glass border-indigo-200 shadow-xl scale-105'
                  : 'bg-white border-slate-200 hover:shadow-lg hover:border-slate-300'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                </div>
              )}

              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-6`}>
                <plan.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
              <p className="text-slate-600 mb-6">{plan.description}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-800">R${plan.price}</span>
                  <span className="text-slate-600">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transform hover:scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                Começar {plan.name}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 glass rounded-2xl border border-slate-200/50">
            <h3 className="text-xl font-semibold text-slate-800">
              Teste grátis por 14 dias
            </h3>
            <p className="text-slate-600 max-w-md">
              Experimente todos os recursos sem compromisso. Não solicitamos cartão de crédito.
            </p>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
              Começar Teste Grátis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
