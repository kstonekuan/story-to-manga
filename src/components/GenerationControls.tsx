import React from 'react';
import { AppStyle } from '@/types/app';
import { Button } from './ui/button';
import { Loader2, Sparkles, RotateCcw, Trash2 } from 'lucide-react';

interface GenerationControlsProps {
  onGenerate: () => void;
  onClearResults: () => void;
  onClearAll: () => void;
  isGenerating: boolean;
  hasStory: boolean;
  appStyle: AppStyle;
}

export function GenerationControls({
  onGenerate,
  onClearResults,
  onClearAll,
  isGenerating,
  hasStory,
  appStyle
}: GenerationControlsProps) {
  return (
    <div className="space-y-6">
      
      {/* Title Panel */}
      <div className="bg-black text-white px-4 py-2 transform rotate-1 shadow-[4px_4px_0px_0px_#333]">
        <h3 className="text-lg font-black tracking-wider text-center flex items-center justify-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          ACTION COMMANDS!
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </h3>
      </div>

      {/* Main Generate Button - Manga Style */}
      <div className="relative">
        <button
          onClick={onGenerate}
          disabled={!hasStory || isGenerating}
          className={`w-full relative overflow-hidden border-4 border-black font-black text-xl py-6 transition-all duration-300 transform hover:scale-105 hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:transform-none disabled:opacity-50 ${
            hasStory && !isGenerating
              ? 'bg-red-500 text-white shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_#000]'
              : 'bg-gray-300 text-gray-600 shadow-[4px_4px_0px_0px_#666]'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <div className="text-center">
                <div className="text-2xl">GENERATING!</div>
                <div className="text-sm opacity-80">Creating your {appStyle === 'manga' ? 'MANGA' : 'COMIC'}...</div>
              </div>
              <div className="absolute inset-0 bg-yellow-400 opacity-20 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl">⚡</div>
              <div className="text-center">
                <div className="text-2xl">CREATE {appStyle === 'manga' ? 'MANGA' : 'COMIC'}!</div>
                <div className="text-sm opacity-80">TRANSFORM YOUR STORY!</div>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          )}
          
          {/* Action lines effect */}
          {hasStory && !isGenerating && (
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_4px)] pointer-events-none" />
          )}
        </button>

        {/* Power-up effect when generating */}
        {isGenerating && (
          <>
            <div className="absolute -inset-4 bg-yellow-400 opacity-30 animate-ping rounded" />
            <div className="absolute -inset-2 bg-red-400 opacity-20 animate-pulse rounded" />
          </>
        )}
      </div>

      {/* Secondary Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onClearResults}
          disabled={isGenerating}
          className="bg-blue-400 border-4 border-black text-black font-black py-3 px-4 hover:bg-blue-300 transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50 disabled:transform-none"
        >
          <RotateCcw className="w-4 h-4 mx-auto mb-1" />
          RESET
        </button>

        <button
          onClick={onClearAll}
          disabled={isGenerating}
          className="bg-orange-400 border-4 border-black text-black font-black py-3 px-4 hover:bg-orange-300 transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50 disabled:transform-none"
        >
          <Trash2 className="w-4 h-4 mx-auto mb-1" />
          ERASE ALL
        </button>
      </div>

      {/* Info Panel */}
      <div className="bg-yellow-100 border-3 border-black p-4 transform -rotate-1 shadow-[4px_4px_0px_0px_#000]">
        <div className="space-y-2 text-sm font-bold text-black">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 border border-black" />
            Generation takes 2-3 minutes
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 border border-black" />
            Each step builds on previous
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-500 border border-black" />
            Download results individually
          </div>
        </div>
      </div>

      {/* Story Required Warning */}
      {!hasStory && (
        <div className="bg-red-500 text-white border-4 border-black p-4 transform rotate-1 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚠️</div>
            <div>
              <div className="font-black text-lg">STORY REQUIRED!</div>
              <div className="text-sm opacity-90">
                Write your epic tale before generating {appStyle === 'manga' ? 'manga' : 'comic'} panels!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}