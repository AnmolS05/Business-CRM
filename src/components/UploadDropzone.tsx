import React from 'react';
import { Upload } from 'lucide-react';

/**
 * Props for UploadDropzone component.
 */
interface UploadDropzoneProps {
  /** Event handler for drag drop events */
  handleDrop: (e: React.DragEvent) => void;
  /** Event handler for drag over events */
  handleDragOver: (e: React.DragEvent) => void;
  /** Ref pointing to hidden file input */
  fileInputRef: React.RefObject<HTMLInputElement>;
  /** Event handler for file input change */
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Modern Bridgement-styled Drag and Drop upload zone for documents, spreadsheets, and images.
 *
 * @param {UploadDropzoneProps} props Component properties.
 * @returns {React.ReactElement} Upload dropzone element.
 */
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
      className="card-surface relative overflow-hidden border-2 border-dashed border-[#D6DAE3] dark:border-white/15 hover:border-[#D20C54]/60 dark:hover:border-[#D20C54]/60 rounded-[12px] p-12 text-center cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.txt"
        className="hidden"
      />

      <div className="max-w-md mx-auto space-y-5 relative z-10">
        <div className="w-14 h-14 mx-auto bg-[#D20C54]/10 dark:bg-[#D20C54]/20 text-[#D20C54] rounded-[7.2px] border border-[#D20C54]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm">
          <Upload className="w-6 h-6 stroke-[2.5]" />
        </div>

        <div>
          <h3 className="font-heading font-bold text-2xl text-[#545B6D] dark:text-[#FDF5F8] tracking-[-0.03em]">
            Drag & Drop Financial Data
          </h3>
          <p className="text-xs font-semibold text-[#969CAF] uppercase tracking-wider mt-1.5 flex justify-center items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D20C54] rounded-full animate-pulse" />
            Upload PDFs, Spreadsheets, or Images (Up to 15MB)
          </p>
        </div>

        <button
          type="button"
          className="btn-primary inline-flex items-center justify-center gap-2.5 mx-auto"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          Browse Local Files
        </button>
      </div>
    </div>
  );
};
