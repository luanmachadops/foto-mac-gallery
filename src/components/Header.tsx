
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 bg-white/10 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FotoProof</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">
              Depoimentos
            </a>
            <a href="#pricing" className="text-white/80 hover:text-white transition-colors">
              Preços
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate('/auth')}
                >
                  Entrar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => navigate('/auth')}
                >
                  Começar Grátis
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">
                Recursos
              </a>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">
                Depoimentos
              </a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">
                Preços
              </a>
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full"
                >
                  Dashboard
                </Button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 w-full"
                    onClick={() => navigate('/auth')}
                  >
                    Entrar
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full"
                    onClick={() => navigate('/auth')}
                  >
                    Começar Grátis
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
