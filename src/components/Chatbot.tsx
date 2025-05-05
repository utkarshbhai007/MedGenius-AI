import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, MessageCircle, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: 'Hello! I\'m your MedGenius AI assistant. How can I help you today?'
  }
];

const commonQuestions = [
  'What is MedGenius AI?',
  'How does patient analysis work?',
  'Tell me about drug recommendations',
  'What is drug discovery?',
  'How to analyze side effects?',
  "Can't find what you're looking for? Contact Us"
];

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      setTimeout(() => {
        let response = '';
        const lowerInput = currentInput.toLowerCase();

        if (lowerInput.includes('what is') || lowerInput.includes('tell me about')) {
          if (lowerInput.includes('medgenius')) {
            response = 'MedGenius AI is an advanced healthcare platform that uses artificial intelligence to assist in medical analysis, drug recommendations, and patient care. It helps healthcare professionals make better decisions and improves patient outcomes.';
          } else if (lowerInput.includes('patient analysis')) {
            response = 'Patient Analysis in MedGenius AI allows you to upload patient data and receive AI-powered insights. The system analyzes symptoms, medical history, and other factors to provide comprehensive health assessments and potential diagnoses.';
          } else if (lowerInput.includes('drug recommendation')) {
            response = 'Our Drug Recommendation system uses AI to suggest appropriate medications based on patient data or specific diseases. It considers factors like patient history, allergies, and potential drug interactions to provide personalized recommendations.';
          } else if (lowerInput.includes('drug discovery')) {
            response = 'Drug Discovery in MedGenius AI helps researchers identify potential new medications and treatments. It uses AI to analyze molecular structures, predict drug interactions, and accelerate the discovery process.';
          } else if (lowerInput.includes('side effect')) {
            response = 'The Side Effects Analysis tool helps you understand potential adverse reactions to medications. It analyzes relevant medical data sources and clinical studies to provide comprehensive information about drug safety profiles.';
          }
        } else if (lowerInput.includes('how') || lowerInput.includes('work')) {
          if (lowerInput.includes('patient analysis')) {
            response = 'To use Patient Analysis:\n1. Upload patient data or enter symptoms\n2. Our AI analyzes the information\n3. View detailed analysis and recommendations\n4. Download reports for further review';
          } else if (lowerInput.includes('drug recommendation')) {
            response = 'To get drug recommendations:\n1. Enter patient information or disease name\n2. Our AI analyzes the data\n3. Receive personalized medication suggestions\n4. Review detailed information about each drug';
          } else if (lowerInput.includes('drug discovery')) {
            response = 'The Drug Discovery process:\n1. Enter target disease or molecule\n2. AI analyzes potential compounds\n3. View predicted effectiveness\n4. Get detailed research insights';
          } else if (lowerInput.includes('side effect')) {
            response = 'To analyze side effects:\n1. Enter drug name or combination\n2. Our AI analyzes the relevant data\n3. View comprehensive safety profile\n4. Get detailed interaction warnings';
          }
        } else if (lowerInput.includes('contact') && lowerInput.includes('looking for')) {
            response = 'If you couldn\'t find the information you needed, please feel free to reach out to us:\n- Visit our Contact Us page to find the contact form.\n- Email us at: support@medgenius.com\n- Call us at: +1 (555) 123-4567\nWe\'re happy to help!';
        }

        if (!response) {
          response = 'I\'m here to help you understand MedGenius AI. You can ask me about:\n- What is MedGenius AI?\n- How does patient analysis work?\n- Tell me about drug recommendations\n- What is drug discovery?\n- How to analyze side effects?\n- Or use the Contact Us option if you need further assistance.';
        }

        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error processing request.' }]);
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 shadow-xl z-50 border border-blue-200 rounded-lg">
          <div className="p-4 border-b border-blue-200/60 flex justify-between items-center bg-blue-100/50 rounded-t-lg">
            <h3 className="font-semibold text-blue-950">MedGenius AI Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-blue-700 hover:text-blue-900 hover:bg-blue-200/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50/30">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 shadow-md break-words ${ 
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-200 text-blue-950 border border-blue-300' 
                  }`}
                >
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/80 border border-blue-100 rounded-lg p-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-blue-200/60 bg-blue-100/50 rounded-b-lg">
            <p className="text-xs text-blue-800 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {commonQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs h-auto py-1 px-2 border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50/80"
                >
                  {question}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                className="flex-1 border-blue-300 bg-white/70 text-blue-950 focus:border-blue-500 focus:ring-blue-500 placeholder:text-blue-600/70"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};