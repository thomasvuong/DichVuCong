'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

export default function SearchForm({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        router.push(`/search?query=${encodeURIComponent(transcript)}`);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
          variant: 'destructive',
          title: 'Lỗi nhận dạng giọng nói',
          description: 'Không thể xử lý yêu cầu của bạn. Vui lòng thử lại.',
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
        setIsSpeechRecognitionSupported(false);
    }
  }, [router, toast]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Trình duyệt không hỗ trợ',
        description: 'Tính năng tìm kiếm bằng giọng nói không có sẵn trên trình duyệt của bạn.',
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên thủ tục, giấy tờ cần tìm..."
          className="w-full h-14 pl-12 pr-24 rounded-full text-base"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSpeechRecognitionSupported && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleVoiceSearch}
              className={`rounded-full ${isListening ? 'bg-destructive/20 text-destructive' : ''}`}
              aria-label="Tìm kiếm bằng giọng nói"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
          <Button type="submit" className="rounded-full h-10 hidden sm:inline-flex">
            Tìm kiếm
          </Button>
        </div>
      </div>
    </form>
  );
}
