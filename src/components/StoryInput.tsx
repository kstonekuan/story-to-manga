import React from 'react';
import { AppStyle } from '@/types/app';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface StoryInputProps {
  value: string;
  onChange: (value: string) => void;
  wordCount: number;
  maxWords: number;
  appStyle: AppStyle;
}

const sampleStories = {
  manga: `In the floating city of Neo-Kyoto, young hacker Yuki discovers an ancient AI hidden in the quantum networks. The AI claims to be a digital incarnation of a legendary samurai's spirit, seeking to prevent a cyber-war that could destroy both the digital and physical worlds. As corporate ninjas hunt them through neon-lit data streams, Yuki must learn to balance traditional honor with modern technology. The fate of two worlds hangs in the balance as past and future collide in a spectacular battle for humanity's soul.`,
  
  comic: `When meteorologist Sarah Chen discovers that hurricanes are being artificially created by a secret organization, she teams up with Storm Rider, a mysterious hero who can control weather patterns. Together, they uncover a conspiracy to terraform Earth for an alien invasion. Racing against time through lightning-filled skies and tornado-ravaged cities, they must stop the weather manipulation before the planet becomes uninhabitable. With the power of nature itself as their weapon, they fight to save humanity from an otherworldly threat.`
};

export function StoryInput({ value, onChange, wordCount, maxWords, appStyle }: StoryInputProps) {
  const handleTrySample = () => {
    onChange(sampleStories[appStyle]);
  };

  const isOverLimit = wordCount > maxWords;
  const isNearLimit = wordCount > maxWords * 0.8;

  return (
    <div className="space-y-6">
      
      {/* Title Banner */}
      <div className="relative">
        <div className="bg-black text-white px-4 py-2 transform -rotate-1 shadow-[4px_4px_0px_0px_#333]">
          <h3 className="text-lg font-black tracking-wider text-center">
            ✍️ WRITE YOUR EPIC STORY!
          </h3>
        </div>
        
        {/* Word counter as manga sound effect */}
        <div className={`absolute -top-2 -right-2 border-3 border-black px-3 py-1 font-black text-sm transform rotate-12 ${
          isOverLimit 
            ? 'bg-red-500 text-white' 
            : isNearLimit 
              ? 'bg-orange-400 text-black'
              : 'bg-yellow-300 text-black'
        } shadow-[3px_3px_0px_0px_#000]`}>
          {wordCount}/{maxWords}
        </div>
      </div>

      {/* Story input panel */}
      <div className="relative">
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-4">
          
          {/* Panel border decoration */}
          <div className="absolute top-2 left-2 w-3 h-3 border-2 border-black" />
          <div className="absolute top-2 right-2 w-3 h-3 border-2 border-black" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-2 border-black" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-2 border-black" />
          
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={appStyle === 'manga' 
              ? "Once upon a time in Neo-Tokyo, a young warrior discovered hidden powers... Write your manga story here! Include characters, settings, and epic adventures!"
              : "In a world of heroes and villains, one champion rises... Write your comic story here! Think big battles, superpowers, and saving the day!"
            }
            className="min-h-[180px] resize-none text-base leading-relaxed border-0 bg-transparent focus:ring-0 focus:outline-none font-mono"
            style={{ 
              backgroundImage: `repeating-linear-gradient(transparent, transparent 23px, #e5e7eb 24px)`,
              lineHeight: '24px',
              paddingTop: '2px'
            }}
          />
          
          {/* Progress bar manga style */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold">PROGRESS:</span>
            <div className="flex-1 bg-gray-200 border-2 border-black h-4 relative">
              <div 
                className={`h-full transition-all duration-300 ${
                  isOverLimit 
                    ? 'bg-red-500' 
                    : isNearLimit 
                      ? 'bg-orange-400'
                      : 'bg-green-400'
                }`}
                style={{ width: `${Math.min((wordCount / maxWords) * 100, 100)}%` }}
              />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.1)_3px)] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Warning panel */}
      {isOverLimit && (
        <div className="bg-red-500 text-white border-4 border-black p-3 transform rotate-1 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="font-black">WARNING!</div>
              <div className="text-sm">Story exceeds {maxWords} word limit. Please shorten your story!</div>
            </div>
          </div>
        </div>
      )}

      {/* Sample story button */}
      {!value.trim() && (
        <div className="text-center">
          <button
            onClick={handleTrySample}
            className="bg-yellow-400 border-4 border-black px-6 py-3 font-black text-black hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            ✨ TRY SAMPLE STORY!
          </button>
        </div>
      )}

      {/* Auto-save indicator */}
      <div className="bg-green-100 border-2 border-green-500 p-2 text-center transform -rotate-1">
        <div className="text-xs font-bold text-green-800">
          💾 AUTO-SAVE ACTIVATED! Your story is safe!
        </div>
      </div>
    </div>
  );
}