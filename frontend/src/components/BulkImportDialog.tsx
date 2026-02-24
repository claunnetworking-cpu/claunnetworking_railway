import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'jobs' | 'courses';
  onSuccess?: () => void;
}

export function BulkImportDialog({ open, onOpenChange, type, onSuccess }: BulkImportDialogProps) {
  const [urls, setUrls] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importJobsMutation = trpc.bulkImport.importJobs.useMutation();
  const importCoursesMutation = trpc.bulkImport.importCourses.useMutation();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Parse URLs from file (one URL per line)
      const parsedUrls = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && (line.startsWith('http://') || line.startsWith('https://')));
      
      setUrls(parsedUrls.join('\n'));
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const urlList = urls
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && (line.startsWith('http://') || line.startsWith('https://')));

    if (urlList.length === 0) {
      toast.error('Nenhuma URL válida encontrada');
      return;
    }

    setIsProcessing(true);
    try {
      if (type === 'jobs') {
        const result = await importJobsMutation.mutateAsync({ urls: urlList });
        setResults(result);
        toast.success(`${result.totalSuccess} de ${result.totalProcessed} vagas importadas com sucesso`);
      } else {
        const result = await importCoursesMutation.mutateAsync({ urls: urlList });
        setResults(result);
        toast.success(`${result.totalSuccess} de ${result.totalProcessed} cursos importados com sucesso`);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Erro ao importar. Tente novamente.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setUrls('');
    setResults(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar {type === 'jobs' ? 'Vagas' : 'Cursos'} em Lote</DialogTitle>
          <DialogDescription>
            Cole URLs ou faça upload de um arquivo CSV/TXT com uma URL por linha
          </DialogDescription>
        </DialogHeader>

        {!results ? (
          <div className="space-y-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium">Clique para fazer upload ou arraste um arquivo</p>
              <p className="text-xs text-gray-500">CSV ou TXT com uma URL por linha</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* URL Textarea */}
            <div>
              <label className="text-sm font-medium mb-2 block">URLs</label>
              <Textarea
                placeholder="https://exemplo.com/vaga1&#10;https://exemplo.com/vaga2&#10;https://exemplo.com/vaga3"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                {urls.split('\n').filter(line => line.trim().startsWith('http')).length} URL(s) válida(s)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={isProcessing || urls.split('\n').filter(line => line.trim().startsWith('http')).length === 0}
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessing ? 'Importando...' : 'Importar'}
              </Button>
            </div>
          </div>
        ) : (
          // Results View
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">
                  {results.totalSuccess} de {results.totalProcessed} importados com sucesso
                </span>
              </div>
              <p className="text-sm text-green-700">
                Taxa de sucesso: {Math.round((results.totalSuccess / results.totalProcessed) * 100)}%
              </p>
            </div>

            {/* Results List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {results.results.map((result: any, idx: number) => (
                <div key={idx} className={`flex items-start gap-2 p-2 rounded text-sm ${
                  result.success ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {result.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 truncate">{result.url}</p>
                    {!result.success && (
                      <p className="text-xs text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
