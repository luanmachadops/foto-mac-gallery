
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, FileText, Search, Image } from 'lucide-react';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhotos: Array<{
    id: string;
    file_name: string;
  }>;
}

const ExportModal = ({ isOpen, onClose, selectedPhotos }: ExportModalProps) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Remover extensões dos nomes dos arquivos para obter apenas o nome base
  const getBaseName = (fileName: string) => {
    return fileName.replace(/\.[^/.]+$/, '');
  };

  // Formato para Windows Explorer (nome1 OR nome2 OR nome3)
  const windowsFormat = selectedPhotos
    .map(photo => getBaseName(photo.file_name))
    .join(' OR ');

  // Formato para Lightroom (separado por vírgula e espaço)
  const lightroomFormat = selectedPhotos
    .map(photo => getBaseName(photo.file_name))
    .join(', ');

  // Formato para macOS Finder (usando aspas para nomes com espaços)
  const macosFormat = selectedPhotos
    .map(photo => {
      const baseName = getBaseName(photo.file_name);
      return baseName.includes(' ') ? `"${baseName}"` : baseName;
    })
    .join(' OR ');

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      toast.success(`Formato ${format} copiado para a área de transferência!`);
      
      // Limpar o estado após 2 segundos
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar para a área de transferência');
    }
  };

  const downloadAsText = (text: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Arquivo ${filename} baixado!`);
  };

  const formats = [
    {
      id: 'windows',
      title: 'Windows Explorer',
      description: 'Para pesquisar no Windows Explorer usando OR',
      icon: Search,
      content: windowsFormat,
      filename: 'windows_search.txt'
    },
    {
      id: 'lightroom',
      title: 'Adobe Lightroom',
      description: 'Para filtrar no Lightroom (separado por vírgula)',
      icon: Image,
      content: lightroomFormat,
      filename: 'lightroom_filter.txt'
    },
    {
      id: 'macos',
      title: 'macOS Finder',
      description: 'Para pesquisar no Finder do macOS',
      icon: FileText,
      content: macosFormat,
      filename: 'macos_search.txt'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto glass border-white/20 bg-white/10 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Exportar Seleções ({selectedPhotos.length} fotos)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {formats.map((format) => {
            const Icon = format.icon;
            const isCopied = copiedFormat === format.id;
            
            return (
              <Card key={format.id} className="glass border-white/20 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg">
                    <Icon className="w-5 h-5 mr-2" />
                    {format.title}
                  </CardTitle>
                  <p className="text-gray-300 text-sm">{format.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Conteúdo:</Label>
                    <Textarea
                      value={format.content}
                      readOnly
                      className="mt-2 bg-white/10 border-white/20 text-white font-mono text-sm min-h-[100px]"
                      placeholder="Nenhuma foto selecionada"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(format.content, format.id)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 flex-1"
                      disabled={!format.content}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {isCopied ? 'Copiado!' : 'Copiar'}
                    </Button>
                    
                    <Button
                      onClick={() => downloadAsText(format.content, format.filename)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      disabled={!format.content}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
