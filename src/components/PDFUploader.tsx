import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFFile {
  id: string;
  name: string;
  size: number;
  content: string;
  file: File;
}

interface PDFUploaderProps {
  onPDFsChange: (pdfs: PDFFile[]) => void;
  uploadedPDFs: PDFFile[];
}

export const PDFUploader = ({ onPDFsChange, uploadedPDFs }: PDFUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items as any[];
      const pageText = textItems.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    
    try {
      const newPDFs: PDFFile[] = [];
      
      for (const file of acceptedFiles) {
        if (file.type === 'application/pdf') {
          const content = await extractTextFromPDF(file);
          const pdfFile: PDFFile = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            content,
            file
          };
          newPDFs.push(pdfFile);
        }
      }
      
      onPDFsChange([...uploadedPDFs, ...newPDFs]);
    } catch (error) {
      console.error('Error processing PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedPDFs, onPDFsChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removePDF = (id: string) => {
    onPDFsChange(uploadedPDFs.filter(pdf => pdf.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card
        {...getRootProps()}
        className={`glass glass-hover cursor-pointer transition-all duration-300 ${
          isDragActive ? 'ring-2 ring-primary glow' : ''
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className={`mb-4 p-4 rounded-full bg-primary/10 transition-all duration-300 ${
            isDragActive ? 'animate-pulse-glow' : ''
          }`}>
            <Upload className={`h-8 w-8 text-primary transition-all duration-300 ${
              isDragActive ? 'scale-110' : ''
            }`} />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {isProcessing ? 'Processing PDFs...' : 
             isDragActive ? 'Drop your PDFs here' : 'Upload PDF Documents'}
          </h3>
          
          <p className="text-muted-foreground mb-4">
            {isProcessing ? 'Extracting text from your documents...' :
             'Drag and drop your PDF files here, or click to browse'}
          </p>
          
          {!isProcessing && (
            <Button variant="outline" className="glass-hover">
              Select Files
            </Button>
          )}
          
          {isProcessing && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </div>
      </Card>

      {uploadedPDFs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Uploaded Documents ({uploadedPDFs.length})
          </h4>
          
          <div className="space-y-2">
            {uploadedPDFs.map((pdf) => (
              <Card key={pdf.id} className="glass p-4 animate-slide-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{pdf.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(pdf.size)} • {pdf.content.split(' ').length} words
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePDF(pdf.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};