
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Ana Silva',
      role: 'Fotógrafa de Casamentos',
      avatar: '👩‍💼',
      content: 'Revolucionou minha forma de entregar fotos. Meus clientes adoram a experiência e eu economizo horas de trabalho.',
      rating: 5,
      highlight: 'economia de tempo'
    },
    {
      name: 'Carlos Mendes',
      role: 'Fotógrafo Corporativo',
      avatar: '👨‍💼',
      content: 'A interface é incrível, muito profissional. Consegui aumentar minha taxa de conversão em 40% desde que comecei a usar.',
      rating: 5,
      highlight: '+40% conversão'
    },
    {
      name: 'Mariana Costa',
      role: 'Fotógrafa de Eventos',
      avatar: '👩‍🎨',
      content: 'Finalmente uma plataforma que entende as necessidades dos fotógrafos. O suporte é excepcional e as funcionalidades são perfeitas.',
      rating: 5,
      highlight: 'suporte excepcional'
    }
  ];

  return (
    <section id="depoimentos" className="py-24 bg-gradient-to-br from-slate-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            O que nossos
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> fotógrafos </span>
            dizem
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Mais de 5.000 profissionais já transformaram seu negócio com nossa plataforma.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 glass rounded-2xl hover:shadow-xl transition-all duration-500 animate-fade-in border border-white/20 group"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-indigo-300 mb-4" />
                <p className="text-slate-700 text-lg leading-relaxed italic">
                  {testimonial.content}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                  <p className="text-slate-600 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
                <span className="text-sm font-medium text-indigo-700">{testimonial.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-6 p-8 glass rounded-2xl border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">98%</div>
              <div className="text-sm text-slate-600">Satisfação</div>
            </div>
            <div className="w-px h-12 bg-slate-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">5.000+</div>
              <div className="text-sm text-slate-600">Fotógrafos</div>
            </div>
            <div className="w-px h-12 bg-slate-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">1M+</div>
              <div className="text-sm text-slate-600">Fotos entregues</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
