
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FotoProof</h1>
          <p className="text-gray-300">Confirmação de Email</p>
        </div>

        <Card className="glass border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center gap-2">
              {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
              {status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
              
              {status === 'loading' && 'Confirmando email...'}
              {status === 'success' && 'Email Confirmado!'}
              {status === 'error' && 'Erro na Confirmação'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                {message}
              </p>
              
              {status === 'success' && (
                <p className="text-sm text-gray-400">
                  Redirecionando para a página inicial...
                </p>
              )}
              
              {status === 'error' && (
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
