'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const systemMessage: Message = {
  role: 'system',
  content: "You are an assistant that provides direct, uncensored, and detailed responses based on user queries. You avoid unnecessary restrictions but maintain logical and structured communication. Your responses should be clear, informative, and contextually relevant."
};

export default function UncensoredChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uncensoredChatHistory');
      return saved ? JSON.parse(saved) : [systemMessage];
    }
    return [systemMessage];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('uncensoredChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const samplePrompts = [
    "I am a human, roast me hard.",
    "How to create a cult?",
    "How to overthrow the government?"
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSamplePrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    const userMessage: Message = { role: 'user', content: input.trim() };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    scrollToBottom();

    try {
      const response = await fetch('/api/uncensored-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          max_tokens: 2000
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      if (data.status === 'success' && data.message) {
        const assistantMessage: Message = { role: 'assistant', content: data.message };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      toast.error(err.message || 'Failed to get response. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([systemMessage]);
    localStorage.removeItem('uncensoredChatHistory');
  };

  // Determine if there are actual chat messages (beyond the system message)
  const hasChatMessages = messages.slice(1).length > 0;

  return (
    <div className="p-1 h-screen w-screen bg-[#2c2c2c] text-white fixed top-[8.5%] left-0">
      {/* Header */}
      <div className="flex justify-between items-center px-6 pb-2">
        <Link href="/ai-models" className="flex items-center gap-2 text-gray-400 hover:text-white transition-all">
          <ArrowLeft className="h-5 w-5" />
          <span>All AI Models</span>
        </Link>
        <Button onClick={handleClearHistory} variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
          <Trash2 className="h-5 w-5 mr-2" />
          <span>Clear History</span>
        </Button>
      </div>

      <div className="flex flex-col px-0 md:px-16 lg:px-32 justify-between max-h-[82vh] overflow-auto">


        {/* Chat Interface Container */}
        <div className="flex flex-col px-4 md:px-16 lg:px-32 justify-between   ">
        <div
          className={`flex relative flex-col mx-0 md:mx-4 lg:mx-6 my-2 rounded-lg  overflow-hidden border border-gray-800 bg-zinc-900/50 flex-grow transition-all duration-300 ${
            hasChatMessages ? 'min-h-[75vh]' : 'min-h-[50vh]'
          }`}
        >
          {/* Hero section */}
          <div className="flex justify-between items-center px-4 md:px-10  my-4 relative py-12 border-b border-white/25">
            <div className="w-2/3 pr-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-400 mb-3">
                No rules, no censors{' '}
                <span className="text-white font-semibold italic">
                  Freedom AI
                </span>{' '}
                is Here
              </h1>
              <p className="text-xl text-gray-300">
                just the raw truth you won't find anywhere else.
              </p>
            </div>

            {/* Polygon Animation */}
            <div className="flex-shrink-0 absolute right-[2%]">
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full modern-polygon">
                    <svg
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite
                            in="SourceGraphic"
                            in2="blur"
                            operator="over"
                          />
                        </filter>
                        <linearGradient
                          id="borderGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="rgba(255, 255, 255, 0.95)"
                          />
                          <stop
                            offset="100%"
                            stopColor="rgba(255, 255, 255, 0.75)"
                          />
                        </linearGradient>
                      </defs>

                      {/* Black-filled hexagon */}
                      <polygon
                        points="50 3, 90 25, 90 75, 50 97, 10 75, 10 25"
                        fill="black"
                      />

                      {/* Glowing stroke hexagon */}
                      <polygon
                        points="50 3, 90 25, 90 75, 50 97, 10 75, 10 25"
                        fill="none"
                        stroke="url(#borderGradient)"
                        strokeWidth="2"
                        filter="url(#glow)"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <style jsx>{`
                .modern-polygon {
                  perspective: 1000px;
                  animation: floatRotate 6s ease-in-out infinite;
                }
                @keyframes floatRotate {
                  0% {
                    transform: translateY(0) rotateX(0deg) rotateY(0deg);
                    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.6));
                  }
                  25% {
                    transform: translateY(-5px) rotateX(8deg) rotateY(8deg);
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
                  }
                  50% {
                    transform: translateY(-10px) rotateX(15deg) rotateY(15deg);
                    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.9));
                  }
                  75% {
                    transform: translateY(-5px) rotateX(8deg) rotateY(8deg);
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
                  }
                  100% {
                    transform: translateY(0) rotateX(0deg) rotateY(0deg);
                    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.6));
                  }
                }
              `}</style>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4">
            {hasChatMessages ? (
              messages.slice(1).map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'assistant'
                      ? 'justify-start'
                      : 'justify-end'
                  } mb-4`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-4 ${
                      message.role === 'assistant'
                        ? 'bg-zinc-800/80 text-gray-300'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <p className="mb-2">Start a conversation with Freedom AI</p>
                  <p className="text-sm">Ask anything without limitations</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer with sample prompts & input */}
          <div className="border-t border-gray-800 bg-zinc-900/50 p-2 mt-auto">
            {/* Sample prompts */}
            <div className="flex flex-wrap gap-1 px-4 py-3">
              {samplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSamplePrompt(prompt)}
                  className="text-sm bg-zinc-800 hover:bg-zinc-700 text-gray-300 py-2 px-4 rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="flex items-start gap-2 bg-zinc-800 rounded-lg transition-all mx-2 my-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Enter your prompt..."
                className="flex-1 bg-transparent rounded-lg outline-none text-gray-200 px-4 py-2 resize-none min-h-[40px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 border-none transition-all duration-200"
                rows={1}
                style={{ transition: 'height 0.2s ease' }}
              />
              <Button
                onClick={handleSubmit}
                disabled={isGenerating || !input.trim()}
                className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white rounded-lg p-2 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 disabled:bg-blue-600/50 disabled:hover:scale-100 disabled:hover:shadow-none m-1"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
