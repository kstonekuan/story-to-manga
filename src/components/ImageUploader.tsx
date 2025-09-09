import React, { useRef, useState } from 'react';
import { AppStyle, UploadedImage } from '@/types/app';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  characterImages: UploadedImage[];
  settingImages: UploadedImage[];
  onCharacterImagesChange: (images: UploadedImage[]) => void;
  onSettingImagesChange: (images: UploadedImage[]) => void;
  appStyle: AppStyle;
}

interface DropZoneProps {
  onUpload: (files: FileList) => void;
  category: 'character' | 'setting';
  appStyle: AppStyle;
  children: React.ReactNode;
}

function DropZone({ onUpload, category, appStyle, children }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onClick={handleClick}
      className={`relative border-4 border-dashed p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
        isDragOver
          ? 'border-yellow-500 bg-yellow-100 shadow-[4px_4px_0px_0px_#000] scale-105'
          : 'border-gray-400 bg-gray-100 hover:border-gray-600 hover:bg-gray-50 shadow-[2px_2px_0px_0px_#000]'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && onUpload(e.target.files)}
        className="hidden"
      />
      
      {/* Manga-style decorative corners */}
      <div className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 border-black" />
      <div className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 border-black" />
      <div className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 border-black" />
      <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-black" />
      
      {children}
      
      {isDragOver && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-black px-2 py-1 font-black text-xs transform rotate-12">
          DROP NOW!
        </div>
      )}
    </div>
  );
}

interface ImageCardProps {
  image: UploadedImage;
  onRemove: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
  appStyle: AppStyle;
}

function ImageCard({ image, onRemove, onNameChange, appStyle }: ImageCardProps) {
  return (
    <div className="relative group">
      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
        <div className="relative aspect-square bg-gray-100">
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
          
          {/* Remove button */}
          <button
            onClick={() => onRemove(image.id)}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 border-2 border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 font-black text-white transform hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Image type indicator */}
          <div className="absolute bottom-2 left-2 bg-yellow-400 border-2 border-black px-2 py-1 font-black text-xs transform -rotate-2">
            {image.category === 'character' ? 'CHAR' : 'SET'}
          </div>
        </div>
        
        {/* Name input */}
        <div className="p-2 bg-gray-100 border-t-4 border-black">
          <Input
            value={image.name}
            onChange={(e) => onNameChange(image.id, e.target.value)}
            className="text-sm font-bold border-2 border-black bg-white focus:ring-0 focus:border-black"
            placeholder="Name this image..."
          />
        </div>
      </div>
    </div>
  );
}

export function ImageUploader({ 
  characterImages, 
  settingImages, 
  onCharacterImagesChange, 
  onSettingImagesChange, 
  appStyle 
}: ImageUploaderProps) {
  const [characterOpen, setCharacterOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);

  const handleUpload = (files: FileList, category: 'character' | 'setting') => {
    const newImages: UploadedImage[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9);
        const url = URL.createObjectURL(file);
        const name = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        
        newImages.push({ id, file, url, name, category });
      }
    });

    if (category === 'character') {
      onCharacterImagesChange([...characterImages, ...newImages]);
    } else {
      onSettingImagesChange([...settingImages, ...newImages]);
    }
  };

  const handleRemove = (id: string, category: 'character' | 'setting') => {
    if (category === 'character') {
      onCharacterImagesChange(characterImages.filter(img => img.id !== id));
    } else {
      onSettingImagesChange(settingImages.filter(img => img.id !== id));
    }
  };

  const handleNameChange = (id: string, name: string, category: 'character' | 'setting') => {
    if (category === 'character') {
      onCharacterImagesChange(characterImages.map(img => 
        img.id === id ? { ...img, name } : img
      ));
    } else {
      onSettingImagesChange(settingImages.map(img => 
        img.id === id ? { ...img, name } : img
      ));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Panel */}
      <div className="bg-black text-white px-4 py-2 transform rotate-1 shadow-[4px_4px_0px_0px_#333]">
        <h3 className="text-lg font-black tracking-wider text-center flex items-center justify-center gap-2">
          <ImageIcon className="w-5 h-5 text-yellow-400" />
          REFERENCE IMAGES!
          <span className="text-sm opacity-70">(OPTIONAL)</span>
        </h3>
      </div>
      
      {/* Help text */}
      <div className="bg-blue-100 border-3 border-blue-500 p-3 transform -rotate-1 shadow-[3px_3px_0px_0px_#000]">
        <p className="text-sm font-bold text-blue-800 text-center">
          📸 Upload images to guide AI generation! Better references = Better results!
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Character References Panel */}
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000]">
          <button
            onClick={() => setCharacterOpen(!characterOpen)}
            className="w-full bg-red-400 border-b-4 border-black p-4 hover:bg-red-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👥</span>
                <div className="text-left">
                  <div className="font-black text-lg text-black">CHARACTER REFS</div>
                  <div className="text-sm font-bold text-black opacity-80">
                    {characterImages.length} image{characterImages.length !== 1 ? 's' : ''} ready
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-black transition-transform ${characterOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          {characterOpen && (
            <div className="p-4 space-y-4">
              <DropZone
                onUpload={(files) => handleUpload(files, 'character')}
                category="character"
                appStyle={appStyle}
              >
                <div className="text-center space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-gray-600" />
                  <div className="font-black text-gray-800">DROP CHARACTER IMAGES!</div>
                  <div className="text-sm font-bold text-gray-600">
                    Drag & drop or click to browse
                  </div>
                </div>
              </DropZone>

              {characterImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {characterImages.map((image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onRemove={(id) => handleRemove(id, 'character')}
                      onNameChange={(id, name) => handleNameChange(id, name, 'character')}
                      appStyle={appStyle}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Setting References Panel */}
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000]">
          <button
            onClick={() => setSettingOpen(!settingOpen)}
            className="w-full bg-green-400 border-b-4 border-black p-4 hover:bg-green-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏙️</span>
                <div className="text-left">
                  <div className="font-black text-lg text-black">SETTING REFS</div>
                  <div className="text-sm font-bold text-black opacity-80">
                    {settingImages.length} image{settingImages.length !== 1 ? 's' : ''} ready
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-black transition-transform ${settingOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          {settingOpen && (
            <div className="p-4 space-y-4">
              <DropZone
                onUpload={(files) => handleUpload(files, 'setting')}
                category="setting"
                appStyle={appStyle}
              >
                <div className="text-center space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-gray-600" />
                  <div className="font-black text-gray-800">DROP SETTING IMAGES!</div>
                  <div className="text-sm font-bold text-gray-600">
                    Drag & drop or click to browse
                  </div>
                </div>
              </DropZone>

              {settingImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {settingImages.map((image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onRemove={(id) => handleRemove(id, 'setting')}
                      onNameChange={(id, name) => handleNameChange(id, name, 'setting')}
                      appStyle={appStyle}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}