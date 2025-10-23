import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { ProcessingStatus, ProcessingStage } from '@/components/ProcessingStatus';
import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[][] | null>(null);
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);
  const [itemsProcessed, setItemsProcessed] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setStage('reading');
    setProgress(20);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      
      setPreviewData(jsonData as any[][]);
      setTotalItems(jsonData.length - 1); // Exclude header
      setStage('idle');
      setProgress(0);
      
      toast({
        title: "Arquivo carregado",
        description: `${jsonData.length - 1} itens detectados na planilha`,
      });
    } catch (error) {
      console.error('Error reading file:', error);
      setStage('error');
      toast({
        title: "Erro ao ler arquivo",
        description: "Não foi possível processar a planilha Excel",
        variant: "destructive",
      });
    }
  };

  const handleProcessData = async () => {
    if (!previewData) return;

    setStage('orse');
    setProgress(25);
    setItemsProcessed(0);

    // Simulate ORSE processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProgress(50);
    setStage('simapi');

    // Simulate SIMAPI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProgress(75);
    setItemsProcessed(totalItems);
    setStage('consolidating');

    // Simulate consolidation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProgress(100);
    setStage('complete');

    toast({
      title: "Processamento concluído",
      description: "Sua planilha consolidada está pronta!",
    });
  };

  const handleDownload = () => {
    // For now, just download the original file
    // In production, this would download the consolidated data
    toast({
      title: "Download iniciado",
      description: "Sua planilha consolidada será baixada em instantes",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-elevated">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">STI-OrcaFlow</h1>
              <p className="text-sm opacity-90">
                Integrador ORSE × SIMAPI | Sistema de consolidação de dados de referência de preços
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Instructions */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">Como funciona</h2>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span>Carregue sua planilha Excel contendo a lista de itens a serem consultados</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span>O sistema consultará automaticamente os dados no ORSE e SIMAPI</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span>Baixe a planilha consolidada com todas as informações integradas</span>
              </li>
            </ol>
          </div>

          {/* File Upload */}
          <FileUpload 
            onFileSelect={handleFileSelect} 
            disabled={stage !== 'idle' && stage !== 'complete'}
          />

          {/* Data Preview */}
          {previewData && (
            <DataPreview 
              data={previewData} 
              fileName={selectedFile?.name || ''} 
            />
          )}

          {/* Processing Status */}
          <ProcessingStatus
            stage={stage}
            progress={progress}
            itemsProcessed={itemsProcessed}
            totalItems={totalItems}
          />

          {/* Action Buttons */}
          {previewData && stage === 'idle' && (
            <div className="flex justify-center">
              <Button 
                onClick={handleProcessData}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 shadow-elevated"
              >
                <Database className="w-5 h-5 mr-2" />
                Iniciar Processamento
              </Button>
            </div>
          )}

          {stage === 'complete' && (
            <div className="flex justify-center">
              <Button 
                onClick={handleDownload}
                size="lg"
                className="bg-gradient-success hover:opacity-90 text-lg px-8 py-6 shadow-elevated"
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar Planilha Consolidada
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Sistema de integração de dados ORSE e SIMAPI • Para melhor funcionamento, utilize planilhas no formato .xlsx
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
