
import { Camera, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">FotoProof</span>
            </div>
            <p className="text-slate-300 mb-6 max-w-md leading-relaxed">
              A plataforma mais elegante para fotógrafos profissionais compartilharem 
              e organizarem suas fotos com clientes de forma segura e profissional.
            </p>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="border-slate-600 hover:border-slate-500 hover:bg-slate-800">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-slate-600 hover:border-slate-500 hover:bg-slate-800">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-slate-600 hover:border-slate-500 hover:bg-slate-800">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Produto</h3>
            <ul className="space-y-3">
              <li><a href="#recursos" className="text-slate-300 hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#precos" className="text-slate-300 hover:text-white transition-colors">Preços</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Demo</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Suporte</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Tutoriais</a></li>
              <li><a href="#contato" className="text-slate-300 hover:text-white transition-colors">Contato</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 py-8 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-indigo-400" />
            <span className="text-slate-300">contato@fotoproof.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-indigo-400" />
            <span className="text-slate-300">+55 11 9999-9999</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span className="text-slate-300">São Paulo, Brasil</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-700">
          <div className="text-slate-400 text-sm mb-4 md:mb-0">
            © 2024 FotoProof. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Termos</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
