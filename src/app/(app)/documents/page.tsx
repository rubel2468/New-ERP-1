export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import DocumentModel from '@/models/document';
import Link from 'next/link';
import FileUploader from '@/components/shared/FileUploader';

async function getDocuments() {
  await connectToDatabase();
  return DocumentModel.find()
    .sort({ createdAt: -1 })
    .populate('uploadedBy', 'name email')
    .lean();
}

export default async function DocumentsPage() {
  const documents = await getDocuments();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Documents Vault
          </h2>
          <p className="text-slate-400 text-sm">Securely store, tag, and manage your business documents.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FileUploader />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-slate-800/50">
              <h3 className="text-lg font-bold text-slate-100">All Documents</h3>
            </div>
            {documents.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="text-sm">No documents uploaded yet. Use the uploader to add files.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {documents.map((doc: any) => (
                  <div key={doc._id} className="p-4 hover:bg-slate-800/10 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800/80 text-slate-300 shrink-0">
                          📄
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-200 truncate">{doc.fileName}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <span className="text-slate-700">•</span>
                            <span className="uppercase">{doc.fileType.split('/').pop()}</span>
                            <span className="text-slate-700">•</span>
                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          </div>
                          {doc.tags && doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {doc.tags.map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-slate-800 text-slate-400 border border-slate-700/50">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                      >
                        <span>📥</span> Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}