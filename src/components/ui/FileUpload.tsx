"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  multiple?: boolean;
  label?: string;
  helperText?: string;
}

export function FileUpload({
  onFilesSelected,
  accept,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = true,
  label,
  helperText,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const validateFiles = (fileList: FileList | File[]): File[] => {
    const filesArray = Array.from(fileList);
    setError(null);

    // Check file count
    const totalFiles = files.length + filesArray.length;
    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`);
      return [];
    }

    // Check file sizes
    const oversizedFiles = filesArray.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(
        `File size must be less than ${formatFileSize(maxSize)}`
      );
      return [];
    }

    return filesArray;
  };

  const handleFiles = (fileList: FileList | File[]) => {
    const validFiles = validateFiles(fileList);
    if (validFiles.length > 0) {
      const newFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all cursor-pointer
          ${
            isDragging
              ? "border-purple-500 bg-purple-500/10"
              : error
              ? "border-red-500 bg-red-500/5"
              : "border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10"
          }
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          {/* Upload Icon */}
          <motion.div
            animate={{
              y: isDragging ? -10 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg
              className={`w-12 h-12 mb-4 transition-colors ${
                isDragging ? "text-purple-400" : "text-white/40"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </motion.div>

          <p className="text-white/80 mb-1">
            <span className="font-semibold text-purple-400">Click to upload</span> or drag
            and drop
          </p>
          <p className="text-sm text-white/50">
            {accept || "Any file type"} (Max {formatFileSize(maxSize)})
          </p>
        </div>
      </motion.div>

      {/* Helper Text or Error */}
      {(helperText || error) && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 text-sm ${error ? "text-red-400" : "text-white/60"}`}
        >
          {error || helperText}
        </motion.p>
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="
                  flex items-center justify-between
                  p-3 rounded-lg bg-white/5 border border-white/10
                "
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* File Icon */}
                  <svg
                    className="w-8 h-8 text-purple-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 truncate">{file.name}</p>
                    <p className="text-xs text-white/50">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                {/* Remove Button */}
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="
                    ml-3 p-1 rounded-lg
                    text-white/40 hover:text-red-400
                    hover:bg-red-400/10 transition-colors
                  "
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
