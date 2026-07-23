import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ZoomIn, Image as ImageIcon, Clipboard, HelpCircle } from 'lucide-react';

const SAMPLES = [
  {
    name: 'Chest X-Ray',
    url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600',
    desc: 'Thoracic posterior-anterior view'
  },
  {
    name: 'Skin Dermoscopy',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    desc: 'High magnification epidermal analysis'
  },
  {
    name: 'Brain MRI',
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=600',
    desc: 'Transverse T2-weighted resonance'
  }
];

const ImageUpload = ({ onImageSelected, selectedImage, onClear }) => {
  const [preview, setPreview] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Set initial preview if selectedImage is passed down (from history or sample)
  useEffect(() => {
    if (selectedImage) {
      if (typeof selectedImage === 'string') {
        setPreview(selectedImage);
      } else {
        const objectUrl = URL.createObjectURL(selectedImage);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreview(null);
    }
  }, [selectedImage]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onImageSelected(file);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
    },
    maxFiles: 1,
    multiple: false
  });

  // Handle paste events
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            onImageSelected(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageSelected]);

  // Load sample image
  const handleSampleClick = async (sample) => {
    try {
      // Fetch URL as a blob to pass to the backend
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `${sample.name.toLowerCase().replace(' ', '_')}.jpg`, { type: 'image/jpeg' });
      onImageSelected(file);
    } catch (e) {
      console.error("Failed to load sample image", e);
      // Fallback: just pass the URL string as preview
      onImageSelected(sample.url);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Zone or Preview Panel */}
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            {...getRootProps()}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[300px] ${
              isDragActive 
                ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20' 
                : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 hover:bg-slate-50/50 dark:hover:bg-slate-900/20'
            }`}
          >
            <input {...getInputProps()} />
            
            <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl mb-4 group-hover:scale-115 transition-transform duration-300">
              <Upload className="h-8 w-8 text-sky-500 dark:text-sky-400" />
            </div>

            <p className="text-base font-bold text-slate-800 dark:text-slate-100">
              Drag & drop medical image here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              or <span className="text-sky-500 dark:text-sky-400 font-semibold underline">browse local files</span>
            </p>
            
            <div className="flex items-center gap-4 mt-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">PNG</span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">JPG</span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">JPEG</span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">Max 10MB</span>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <Clipboard className="h-3.5 w-3.5" />
              <span>Tip: You can also copy an image and press <strong>Ctrl + V</strong> to paste it here.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[300px] p-6"
          >
            {/* Action Bar */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => setZoomOpen(true)}
                className="p-2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:scale-105 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-200"
                title="Zoom Image"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={onClear}
                className="p-2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:scale-105 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-200"
                title="Remove Image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Preview Image */}
            <div className="max-h-[350px] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-800/40">
              <img
                src={preview}
                alt="Uploaded Medical Subject"
                className="max-h-[320px] max-w-full object-contain transform transition-transform hover:scale-102 duration-300"
              />
            </div>
            
            {/* Quick stats / filename */}
            <div className="w-full mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2 font-medium">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-sky-500" />
                Image ready for analysis
              </span>
              <button 
                onClick={onClear}
                className="text-sky-500 dark:text-sky-400 hover:underline font-bold"
              >
                Replace image
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample Images Section */}
      {!preview && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span>Need a test image? Choose a clinical sample:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SAMPLES.map((sample) => (
              <button
                key={sample.name}
                onClick={() => handleSampleClick(sample)}
                className="group flex flex-col p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-sky-400 hover:shadow-md transition-all duration-200 relative overflow-hidden"
              >
                <div className="h-20 w-full rounded-xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800 relative">
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold bg-slate-900/80 px-2 py-0.5 rounded-full uppercase tracking-wider">Use Sample</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{sample.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{sample.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-105 rounded-xl shadow-md transition-all duration-200 z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="max-h-[80vh] overflow-auto flex justify-center bg-slate-50 dark:bg-slate-955 rounded-2xl">
              <img
                src={preview}
                alt="Zoomed Medical Subject"
                className="max-h-[75vh] w-auto object-contain p-4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
