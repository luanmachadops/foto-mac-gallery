
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Camera } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">FotoProof</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#recursos" className="text-slate-600 hover:text-slate-800 transition-colors">
                Recursos
              </a>
              <a href="#precos" className="text-slate-600 hover:text-slate-800 transition-colors">
                Preços
              </a>
              <a href="#depoimentos" className="text-slate-600 hover:text-slate-800 transition-colors">
                Depoimentos
              </a>
              <a href="#contato" className="text-slate-600 hover:text-slate-800 transition-colors">
                Contato
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                Entrar
              </Button>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                Começar Grátis
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10">
              <nav className="flex flex-col space-y-4 mt-4">
                <a href="#recursos" className="text-slate-600 hover:text-slate-800 transition-colors">
                  Recursos
                </a>
                <a href="#precos" className="text-slate-600 hover:text-slate-800 transition-colors">
                  Preços
                </a>
                <a href="#depoimentos" className="text-slate-600 hover:text-slate-800 transition-colors">
                  Depoimentos
                </a>
                <a href="#contato" className="text-slate-600 hover:text-slate-800 transition-colors">
                  Contato
                </a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                    Entrar
                  </Button>
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                    Começar Grátis
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
