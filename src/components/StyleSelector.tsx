import React from 'react';
import { AppStyle } from '@/types/app';

interface StyleSelectorProps {
  value: AppStyle;
  onChange: (style: AppStyle) => void;
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange('manga')}
        className={`relative transition-all duration-300 transform hover:scale-105 ${
          value === 'manga' ? 'z-10' : 'z-0'
        }`}
      >
        <div className={`border-4 border-black px-4 py-2 font-black text-sm relative ${
          value === 'manga'
            ? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_#000] transform -rotate-2'
            : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100'
        }`}>
          🎌 MANGA
          {value === 'manga' && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-black px-1 text-xs transform rotate-12">
              ON!
            </div>
          )}
        </div>
      </button>
      
      <div className="text-2xl font-black text-gray-400">VS</div>
      
      <button
        onClick={() => onChange('comic')}
        className={`relative transition-all duration-300 transform hover:scale-105 ${
          value === 'comic' ? 'z-10' : 'z-0'
        }`}
      >
        <div className={`border-4 border-black px-4 py-2 font-black text-sm relative ${
          value === 'comic'
            ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_#000] transform rotate-2'
            : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100'
        }`}>
          💥 COMIC
          {value === 'comic' && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-black px-1 text-xs transform rotate-12">
              ON!
            </div>
          )}
        </div>
      </button>
    </div>
  );
}