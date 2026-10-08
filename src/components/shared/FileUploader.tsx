'use client';

import { useState } from 'react';
import { uploadDocument } from '@/actions/upload';

interface FileUploaderProps {
  referenceModel?: 'Product' | 'Transaction' | 'Contact';
  referenceId?: string;
  onUploadSuccess?: (doc: any) => void;
}

export default function FileUploader({
  referenceModel,
  referenceId,
  onUploadSuccess,
}: FileUploaderProps) {
  const [file, setFile]       = useState<File | null>(null);
  const [tags, setTags]       = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    if (tags)           formData.append('tags', tags);
    if (referenceModel) formData.append('referenceModel', referenceModel);
    if (referenceId)    formData.append('referenceId', referenceId);
    // Note: userId is now retrieved securely from session in the server action

    const result = await uploadDocument(null, formData);

    setLoading(false);
    setMessage(result.message);

    if (result.success) {
      setFile(null);
      setTags('');
      if (onUploadSuccess && result.document) {
        onUploadSuccess(result.document);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
      <h3 className="text-md font-semibold text-slate-100">Upload to Document Vault</h3>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500/60 bg-blue-500/5'
            : 'border-slate-700/60 hover:border-slate-600/80 hover:bg-slate-800/20'
        }`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file ? (
          <div>
            <p className="text-sm font-semibold text-slate-200 truncate">{file.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div>
            <span className="text-3xl mb-2 block">📂</span>
            <p className="text-sm text-slate-400">Drop file here or <span className="text-blue-400 font-semibold">click to browse</span></p>
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. invoice, signature, pdf"
          className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !file}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
      >
        {loading ? 'Uploading...' : 'Upload File'}
      </button>

      {message && (
        <p className={`text-xs text-center font-medium mt-1 ${message.toLowerCase().includes('success') ? 'text-emerald-400' : 'text-rose-400'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
