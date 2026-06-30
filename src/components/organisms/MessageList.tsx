'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/conversation/types';
import MessageBubble from '@/components/molecules/MessageBubble';
import TypingIndicator from '@/components/atoms/TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  // Skip the welcome message — shown in idle mode instead
  const visibleMessages = messages.slice(1);

  return (
    <ScrollArea className="flex-1 w-full">
      <div className="flex flex-col gap-3 px-4 py-4 pb-2">
        {visibleMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
      </div>
    </ScrollArea>
  );
}
