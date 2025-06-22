
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Camera, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || !type) {
        setStatus('error');
        setMessage('Link de confirmação inválido.');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any,
        });

        if (error) {
          setStatus('error');
          setMessage('Erro ao confirmar email: ' + error.message);
        } else {
          setStatus('success');
          setMessage('Email confirmado com sucesso!');
          
          // Redirecionar para a página inicial após 2 segundos
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Erro inesperado ao confirmar email.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen professional-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-neutral rounded-xl mb-4 shadow-lg animate-float">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FotoProof</h1>
          <p className="text-slate-300">Confirmação de Email</p>
        </div>

        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center gap-2">
              {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
              {status === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              {status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
              
              {status === 'loading' && 'Confirmando email...'}
              {status === 'success' && 'Email Confirmado!'}
              {status === 'error' && 'Erro na Confirmação'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-slate-300 mb-4">
                {message}
              </p>
              
              {status === 'success' && (
                <p className="text-sm text-slate-400">
                  Redirecionando para a página inicial...
                </p>
              )}
              
              {status === 'error' && (
                <Button
                  onClick={() => navigate('/auth')}
                  className="gradient-neutral hover:shadow-xl hover:shadow-slate-500/25 transition-all duration-300 hover:-translate-y-1"
                >
                  Voltar ao Login
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmation;
