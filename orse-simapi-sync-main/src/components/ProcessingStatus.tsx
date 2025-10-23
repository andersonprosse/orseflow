import { CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export type ProcessingStage = 'idle' | 'reading' | 'orse' | 'simapi' | 'consolidating' | 'complete' | 'error';

interface ProcessingStatusProps {
  stage: ProcessingStage;
  progress: number;
  itemsProcessed: number;
  totalItems: number;
  errorMessage?: string;
}

export const ProcessingStatus = ({ 
  stage, 
  progress, 
  itemsProcessed, 
  totalItems,
  errorMessage 
}: ProcessingStatusProps) => {
  const stages = [
    { id: 'reading', label: 'Leitura da planilha', icon: FileText },
    { id: 'orse', label: 'Consultando ORSE', icon: Loader2 },
    { id: 'simapi', label: 'Consultando SIMAPI', icon: Loader2 },
    { id: 'consolidating', label: 'Consolidando dados', icon: Loader2 },
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.id === stage);
  };

  if (stage === 'idle') return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Processamento em andamento</h3>
          {stage === 'complete' && (
            <CheckCircle2 className="w-6 h-6 text-accent" />
          )}
          {stage === 'error' && (
            <AlertCircle className="w-6 h-6 text-destructive" />
          )}
        </div>

        {stage !== 'complete' && stage !== 'error' && (
          <>
            <Progress value={progress} className="h-2" />
            
            <div className="space-y-3">
              {stages.map((stageItem, index) => {
                const Icon = stageItem.icon;
                const currentIndex = getCurrentStageIndex();
                const isActive = stageItem.id === stage;
                const isComplete = index < currentIndex;
                
                return (
                  <div
                    key={stageItem.id}
                    className={`flex items-center gap-3 transition-all duration-200 ${
                      isActive ? 'text-primary font-medium' : 
                      isComplete ? 'text-accent' : 'text-muted-foreground'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? 'animate-spin' : ''}`} />
                    )}
                    <span>{stageItem.label}</span>
                  </div>
                );
              })}
            </div>

            {totalItems > 0 && (
              <div className="text-sm text-muted-foreground">
                Itens processados: {itemsProcessed} de {totalItems}
              </div>
            )}
          </>
        )}

        {stage === 'complete' && (
          <div className="text-center py-4">
            <p className="text-lg text-accent font-medium">
              ✓ Processamento concluído com sucesso!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Sua planilha consolidada está pronta para download
            </p>
          </div>
        )}

        {stage === 'error' && errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <p className="text-sm text-destructive font-medium">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
