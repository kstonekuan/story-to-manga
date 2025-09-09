import React, { useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/90 border-0">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center min-h-[50vh] p-8">
            <img
              src={imageUrl}
              alt="Full size view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}