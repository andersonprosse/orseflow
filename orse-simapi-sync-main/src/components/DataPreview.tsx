import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataPreviewProps {
  data: any[][];
  fileName: string;
}

export const DataPreview = ({ data, fileName }: DataPreviewProps) => {
  if (!data || data.length === 0) return null;

  const headers = data[0];
  const rows = data.slice(1, 6); // Show first 5 rows

  return (
    <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
      <div className="bg-gradient-primary text-primary-foreground px-6 py-4">
        <h3 className="font-semibold text-lg">Preview dos Dados</h3>
        <p className="text-sm opacity-90 mt-1">{fileName} - {data.length - 1} linhas detectadas</p>
      </div>
      
      <ScrollArea className="h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header: any, index: number) => (
                <TableHead key={index} className="font-semibold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row: any[], rowIndex: number) => (
              <TableRow key={rowIndex}>
                {row.map((cell: any, cellIndex: number) => (
                  <TableCell key={cellIndex}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      
      {data.length > 6 && (
        <div className="px-6 py-3 bg-muted/50 text-sm text-muted-foreground text-center">
          + {data.length - 6} linhas adicionais
        </div>
      )}
    </div>
  );
};
