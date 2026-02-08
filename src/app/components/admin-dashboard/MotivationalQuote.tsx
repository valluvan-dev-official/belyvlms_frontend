import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MotivationalQuote() {
  const quotes = [
    {
      text: "Excellence is not a skill, it's an attitude.",
      author: "Ralph Marston"
    },
    {
      text: "Education is the passport to the future.",
      author: "Malcolm X"
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The expert in anything was once a beginner.",
      author: "Helen Hayes"
    }
  ];

  const [currentQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-4 sm:p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20" />
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-wide">
            Today's Inspiration
          </h3>
        </div>

        {/* Quote */}
        <blockquote className="mb-2 sm:mb-3">
          <p className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed italic">
            "{currentQuote.text}"
          </p>
        </blockquote>

        {/* Author */}
        <p className="text-sm text-purple-700 font-medium">
          — {currentQuote.author}
        </p>

        {/* Mascot/Illustration placeholder */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl sm:text-3xl">🎓</span>
        </div>
      </div>
    </div>
  );
}