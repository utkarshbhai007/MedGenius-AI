import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { FileText, Upload, X, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { Progress } from '@/components/ui/progress';

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploadProps {
  onFileUpload: (text: string, metadata: FileMetadata) => void;
  onClear: () => void;
}

interface FileMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  pageCount?: number;
}

export function FileUpload({ onFileUpload, onClear }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const extractTextFromPDF = async (file: File): Promise<{ text: string; pageCount: number }> => {
    return new Promise(async (resolve, reject) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items
            .filter((item: any) => 'str' in item)
            .map((item: any) => item.str);
          fullText += strings.join(' ') + '\n\n';
          
          // Update progress
          setProgress((i / totalPages) * 100);
        }

        resolve({ text: fullText.trim(), pageCount: totalPages });
      } catch (error) {
        console.error('Error extracting text from PDF:', error);
        reject(new Error('Failed to extract text from PDF. The file might be corrupted or password-protected.'));
      }
    });
  };

  const extractTextFromDOCX = async (file: File): Promise<{ text: string }> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ 
        arrayBuffer,
        includeDefaultStyleMap: true,
        preserveNumbering: true,
      });
      
      // Clean and format the extracted text
      const cleanText = result.value
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .trim();
      
      return { text: cleanText };
    } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      throw new Error('Failed to extract text from DOCX. The file might be corrupted.');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
      });
      return;
    }

    if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
      });
      return;
    }

    setFile(file);
    setIsLoading(true);
    setProgress(0);

    try {
      let text = '';
      let metadata: FileMetadata = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      };

      if (file.type.includes('pdf')) {
        const { text: pdfText, pageCount } = await extractTextFromPDF(file);
        text = pdfText;
        metadata.pageCount = pageCount;
      } else if (file.type.includes('docx')) {
        const { text: docxText } = await extractTextFromDOCX(file);
        text = docxText;
      } else if (file.type.includes('doc')) {
        toast({
          title: "Limited Support",
          description: "DOC format has limited text extraction support. Consider using DOCX for better results.",
        });
        const { text: docText } = await extractTextFromDOCX(file);
        text = docText;
      }

      if (!text.trim()) {
        throw new Error('No text could be extracted from the file. The file might be empty or contain only images.');
      }

      onFileUpload(text, metadata);
      toast({
        title: "File processed successfully",
        description: `Extracted ${text.length} characters from ${file.name}`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Please try again or enter the information manually",
      });
      handleClear();
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const handleClear = () => {
    setFile(null);
    setProgress(0);
    onClear();
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-sm">{file.name}</span>
            {!isLoading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag & drop a PDF or DOC file here, or click to select'}
            </p>
            <p className="text-xs text-gray-400">Supports PDF, DOC, DOCX (max 10MB)</p>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing file...</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}
    </div>
  );
} 