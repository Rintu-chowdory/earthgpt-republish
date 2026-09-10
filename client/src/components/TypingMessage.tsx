import React, { useState, useEffect } from "react";

interface TypingMessageProps {
  content: string;
  isComplete?: boolean;
  speed?: number; // milliseconds per character
}

export const TypingMessage: React.FC<TypingMessageProps> = ({
  content,
  isComplete = false,
  speed = 30,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(!isComplete);

  useEffect(() => {
    if (isComplete) {
      setDisplayedText(content);
      setIsTyping(false);
      return;
    }

    if (displayedText.length >= content.length) {
      setIsTyping(false);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText((prev) => {
        const nextIndex = prev.length + 1;
        return content.substring(0, nextIndex);
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, content, isComplete, speed]);

  return (
    <div className="relative">
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {displayedText}
        {isTyping && (
          <span className="inline-block w-2 h-4 ml-1 bg-slate-400 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
};
