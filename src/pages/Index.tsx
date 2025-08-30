import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { PDFUploader } from '@/components/PDFUploader';
import { PDFProcessor } from '@/components/PDFProcessor';

interface PDFFile {
  id: string;
  name: string;
  size: number;
  content: string;
  file: File;
}

const Index = () => {
  const [uploadedPDFs, setUploadedPDFs] = useState<PDFFile[]>([]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-primary glow animate-float">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              PDF Processor
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload your PDF documents and unlock their potential with AI-powered summarization and intelligent question answering.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Summarization
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              Smart Q&A
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Upload Documents</h2>
              <p className="text-muted-foreground">
                Add your PDF files to begin processing them with our AI tools.
              </p>
            </div>
            
            <PDFUploader 
              onPDFsChange={setUploadedPDFs}
              uploadedPDFs={uploadedPDFs}
            />
          </div>

          {/* Processing Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Process & Analyze</h2>
              <p className="text-muted-foreground">
                Generate summaries or ask questions about your uploaded documents.
              </p>
            </div>
            
            <PDFProcessor pdfs={uploadedPDFs} />
          </div>
        </div>

        {/* Features Section */}
        {uploadedPDFs.length === 0 && (
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="glass glass-hover p-6 rounded-xl text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI Summarization</h3>
              <p className="text-muted-foreground">
                Get concise, intelligent summaries of your PDF documents with key insights extracted automatically.
              </p>
            </div>
            
            <div className="glass glass-hover p-6 rounded-xl text-center space-y-4">
              <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto">
                <FileText className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Smart Q&A</h3>
              <p className="text-muted-foreground">
                Ask questions about your documents and get accurate answers based on the actual content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
