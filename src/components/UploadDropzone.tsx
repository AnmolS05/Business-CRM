import React from 'react';
import { Upload } from 'lucide-react';

interface UploadDropzoneProps {
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  handleDrop,
  handleDragOver,
  fileInputRef,
  handleFileChange,
}) => {
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
      className="relative overflow-hidden border-[3px] border-dashed border-indigo-500/20 hover:border-indigo-500/50 bg-[#0a0f1c]/60 backdrop-blur-3xl rounded-[3rem] p-16 text-center cursor-pointer group transition-all duration-500 shadow-[0_8px_40px_rgb(0,0,0,0.3)]"
    >
      {/* Animated Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      {/* AI Scanner Laser Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 translate-y-[-10px] group-hover:animate-[scan_3s_ease-in-out_infinite]" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.txt"
        className="hidden"
      />

      <div className="max-w-md mx-auto space-y-8 relative z-10">
        <div className="w-28 h-28 mx-auto bg-indigo-500/10 rounded-[2.5rem] border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner group-hover:scale-110 group-hover:-translate-y-2 group-hover:bg-indigo-500/20 transition-all duration-700 relative backdrop-blur-xl">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]" />
          <Upload className="w-12 h-12 relative z-10 stroke-[3]" />
        </div>

        <div>
          <p className="font-serif font-black text-4xl text-white tracking-tight drop-shadow-md">
            Drag & Drop Financial Data
          </p>
          <p className="text-[13px] text-indigo-400 mt-4 font-black uppercase tracking-widest flex justify-center items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            Upload PDFs, Spreadsheets, or Images (Up to 15MB)
          </p>
        </div>

        <button
          type="button"
          className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white text-[15px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)] active:scale-95 flex items-center justify-center gap-4 mx-auto border border-indigo-400/20"
        >
          <Upload className="w-6 h-6 stroke-[3]" />
          Browse Local Files
        </button>
      </div>
    </div>
  );
};
