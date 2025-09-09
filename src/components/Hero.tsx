import React from 'react';
import { AppStyle } from '@/types/app';
// import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  appStyle: AppStyle;
}

export function Hero({ appStyle }: HeroProps) {
  return (
    <div className="relative">
      {/* Main Hero Panel */}
      <div className="bg-white border-4 border-black relative overflow-hidden shadow-[6px_6px_0px_0px_#000]">
        
        {/* Manga-style background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#000_1px,_transparent_1px),_radial-gradient(circle_at_80%_80%,_#000_1px,_transparent_1px)] bg-[length:15px_15px,_20px_20px]" />
        </div>

        <div className="relative z-10 p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            
            {/* Left side - Text content in speech bubbles */}
            <div className="space-y-4">
              
              {/* Main speech bubble */}
              <div className="relative">
                <div className="bg-yellow-300 border-3 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_#000] relative transform -rotate-1">
                  <h2 className="text-2xl md:text-3xl font-black text-black leading-tight">
                    {appStyle === 'manga' ? (
                      <>CREATE AMAZING<br/><span className="text-red-600">MANGA!</span></>
                    ) : (
                      <>EPIC <span className="text-blue-600">COMICS</span><br/>AWAIT!</>
                    )}
                  </h2>
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-black" />
                  <div className="absolute -bottom-2 left-9 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-yellow-300" />
                </div>
              </div>

              {/* Features in comic style */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-red-500 text-white border-2 border-black px-3 py-2 font-black text-sm transform rotate-1 shadow-[2px_2px_0px_0px_#000]">
                  ⚡ AI CHARACTER DESIGN
                </div>
                <div className="bg-blue-500 text-white border-2 border-black px-3 py-2 font-black text-sm transform -rotate-1 shadow-[2px_2px_0px_0px_#000]">
                  📖 STORY ANALYSIS
                </div>
                <div className="bg-green-500 text-white border-2 border-black px-3 py-2 font-black text-sm transform rotate-1 shadow-[2px_2px_0px_0px_#000]">
                  🎨 PANEL GENERATION
                </div>
              </div>

              {/* Narrator box */}
              <div className="bg-gray-800 text-white border-2 border-black p-3 text-sm relative">
                <div className="absolute -top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs font-bold border border-black">
                  NARRATOR
                </div>
                <p className="font-medium italic">
                  {appStyle === 'manga' 
                    ? 'Transform your stories into authentic Japanese manga with AI-powered character design and panel layouts!'
                    : 'Create dynamic American-style comics with bold visuals and epic superhero adventures!'
                  }
                </p>
              </div>
            </div>

            {/* Right side - Character showcase */}
            <div className="relative">
              <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden">
                <div className="relative">
                  <img
                    src={appStyle === 'manga' 
                      ? 'https://images.unsplash.com/photo-1705831156575-a5294d295a31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGNvbWljJTIwYm9vayUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NTczNTQ0ODZ8MA&ixlib=rb-4.1.0&q=80&w=600'
                      : 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?crop=entropy&q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    }
                    alt={appStyle === 'manga' ? 'Manga character' : 'Comic character'}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Character name plate */}
                  <div className="absolute bottom-2 left-2 right-2 bg-white border-2 border-black p-2">
                    <div className="font-black text-center text-sm">
                      {appStyle === 'manga' ? '日本のマンガ' : 'AMERICAN COMICS'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating sound effects */}
              <div className="absolute -top-6 -right-4 bg-yellow-300 border-2 border-black px-2 py-1 font-black text-lg transform rotate-12 shadow-[3px_3px_0px_0px_#000]">
                WOOSH!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-red-500 text-white border-2 border-black px-2 py-1 font-black text-sm transform -rotate-12 shadow-[3px_3px_0px_0px_#000]">
                AI POWER!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}