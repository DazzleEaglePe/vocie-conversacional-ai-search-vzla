import React from 'react';

export default function TypingIndicator() {
  return (
    <div 
      className="flex items-center space-x-1.5 px-4 py-3 bg-[#2A2A2A] rounded-2xl rounded-tl-none w-fit border border-[#333333]/50"
      aria-label="Valentina está escribiendo"
    >
      <span className="w-2.5 h-2.5 bg-[#F5F5F5]/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2.5 h-2.5 bg-[#F5F5F5]/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2.5 h-2.5 bg-[#F5F5F5]/50 rounded-full animate-bounce" />
    </div>
  );
}
