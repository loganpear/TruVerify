import React, { useRef, useState } from 'react';
import { Upload, Camera, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FileUploadProps {
  label: string;
  description: string;
  accept?: string;
  onChange: (file: File | null) => void;
  value: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  description, 
  accept = "image/*", 
  onChange,
  value
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div 
        className={`relative group border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center cursor-pointer
          ${value 
            ? 'border-brand-500 bg-brand-50' 
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
          }`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {value && previewUrl ? (
          <div className="relative inline-block">
             <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-48 w-auto object-contain rounded-lg shadow-md mx-auto"
            />
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-red-50" onClick={clearFile}>
               <X className="w-4 h-4 text-red-500" />
            </div>
            <div className="mt-4 flex items-center justify-center text-brand-700 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              File Selected
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-900">
                Click to upload or take a photo
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};