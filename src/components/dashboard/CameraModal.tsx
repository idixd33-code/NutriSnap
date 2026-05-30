import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { scanFoodImage } from '../../lib/aiScanner';
import { FoodItem } from '../../types/food';

interface CameraModalProps {
  onClose: () => void;
  onResult: (food: FoodItem) => void;
}

export default function CameraModal({ onClose, onResult }: CameraModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Start scan
    setIsScanning(true);
    try {
      const result = await scanFoodImage(file);
      onResult(result);
    } catch (error: any) {
      console.error(error);
      if (error.message === "NOT_FOOD") {
        alert('We couldn\'t detect any food in this image. Please take a clear photo of your meal.');
      } else {
        alert('Failed to scan image. Please ensure your API key is correct and try again.');
      }
      setImagePreview(null);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card/90 backdrop-blur-3xl border border-white/20 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold">AI Food Scanner</h2>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[300px] relative">
          
          {imagePreview ? (
            <div className="absolute inset-0 z-0">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          ) : null}

          <div className="relative z-10 flex flex-col items-center w-full">
            {isScanning ? (
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                  <Sparkles className="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-center">Analyzing Food...</h3>
                <p className="text-sm text-muted-foreground text-center">Identifying ingredients and calculating macros</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full animate-fade-in">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 rounded-2xl border-2 border-dashed border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold">Take a Photo or Upload</span>
                    <span className="text-xs text-muted-foreground">Supported: JPG, PNG, WEBP</span>
                  </div>
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
