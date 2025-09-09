import React from 'react';
import { AppStyle } from '@/types/app';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  appStyle: AppStyle;
}

export function ErrorModal({ isOpen, onClose, message, appStyle }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            appStyle === 'manga' 
              ? 'bg-red-100 text-red-500' 
              : 'bg-red-100 text-red-500'
          }`}>
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600">{message}</p>
          </div>
          
          <Button onClick={onClose} className="w-full">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}