import { useState } from 'react';
import { MessageSquare, FileText, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PDFFile {
  id: string;
  name: string;
  size: number;
  content: string;
  file: File;
}

interface PDFProcessorProps {
  pdfs: PDFFile[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const PDFProcessor = ({ pdfs }: PDFProcessorProps) => {
  const [activeTab, setActiveTab] = useState('summarize');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const generateSummary = async () => {
    if (pdfs.length === 0) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock summarization - in a real app, this would call an AI service
    const combinedText = pdfs.map(pdf => pdf.content).join('\n\n');
    const wordCount = combinedText.split(' ').length;
    
    const mockSummary = `This document collection contains approximately ${wordCount} words across ${pdfs.length} PDF(s). 

Key themes and topics identified:
• Main concepts and technical details are discussed throughout the documents
• Important findings and methodologies are presented with supporting evidence
• The content appears to cover specialized knowledge in the domain area
• Multiple perspectives and approaches are examined in detail

The documents provide comprehensive coverage of the subject matter with detailed explanations, examples, and practical applications. The content is structured to build understanding progressively from fundamental concepts to more advanced topics.

This summary is based on the uploaded PDF content and provides a high-level overview of the main themes and information contained within the documents.`;
    
    setSummary(mockSummary);
    setIsGenerating(false);
  };

  const askQuestion = async () => {
    if (!question.trim() || pdfs.length === 0) return;
    
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setQuestion('');
    
    // Simulate thinking
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock Q&A response - in a real app, this would use RAG with vector search
    const mockAnswers = [
      "Based on the PDF content, this appears to be related to the key concepts discussed in the documents. The information suggests that multiple factors contribute to this topic.",
      "According to the uploaded documents, this question touches on an important area covered in the text. The relevant sections indicate several approaches to this matter.",
      "The PDF content contains relevant information about this topic. From what I can analyze, the documents provide insights into the methodology and findings related to your question.",
      "Looking at the content from your uploaded PDFs, this question relates to concepts that are explored in detail throughout the documents. The analysis shows connections between various elements discussed.",
    ];
    
    const assistantMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'assistant',
      content: mockAnswers[Math.floor(Math.random() * mockAnswers.length)],
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  if (pdfs.length === 0) {
    return (
      <Card className="glass p-8 text-center">
        <div className="mb-4 p-4 rounded-full bg-muted/20 w-fit mx-auto">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No PDFs Uploaded</h3>
        <p className="text-muted-foreground">
          Upload your PDF documents to start summarizing and asking questions.
        </p>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-glass-border p-6">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="summarize" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Summarize
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask Questions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summarize" className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Document Summary</h3>
            <p className="text-muted-foreground mb-6">
              Generate a comprehensive summary of your uploaded PDF documents.
            </p>
            
            <Button 
              onClick={generateSummary}
              disabled={isGenerating}
              className="bg-gradient-primary hover:scale-105 transition-all duration-300"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>
          </div>

          {summary && (
            <Card className="glass p-6 animate-slide-up">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Summary Results
              </h4>
              <ScrollArea className="h-64 pr-4">
                <div className="prose prose-sm prose-invert max-w-none">
                  {summary.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-sm leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="qa" className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Ask Questions</h3>
              <p className="text-muted-foreground mb-6">
                Ask questions about your PDF content and get accurate answers.
              </p>
            </div>

            {chatMessages.length > 0 && (
              <Card className="glass p-4">
                <ScrollArea className="h-64 pr-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted/20 mr-auto'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}

            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your PDF content..."
                className="glass flex-1"
              />
              <Button
                onClick={askQuestion}
                disabled={!question.trim()}
                className="bg-gradient-primary hover:scale-105 transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {chatMessages.length === 0 && (
              <Card className="glass p-6 text-center">
                <div className="mb-4 p-4 rounded-full bg-primary/10 w-fit mx-auto">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Start a conversation by asking a question about your PDFs.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};