import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const FileUpload = ({ onFileSelect, disabled }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200",
        isDragActive 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-border hover:border-primary hover:bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <>
            <FileSpreadsheet className="w-16 h-16 text-primary animate-bounce" />
            <p className="text-lg font-medium text-primary">Solte o arquivo aqui...</p>
          </>
        ) : (
          <>
            <div className="relative">
              <Upload className="w-16 h-16 text-muted-foreground" />
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <FileSpreadsheet className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                Arraste sua planilha Excel aqui
              </p>
              <p className="text-sm text-muted-foreground">
                ou clique para selecionar um arquivo (.xlsx ou .xls)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
