import React, { useState } from 'react';
import { X, ShieldCheck, Upload, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export const IdUploadModal: React.FC = () => {
  const { idUploadModalOpen, closeIdUploadModal, user, setUserAndSub } = useAuth();
  const [docUrl, setDocUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!idUploadModalOpen || !user) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docUrl) {
      setError('Please select an ID document file to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.uploadId(user.id, docUrl);
      setUserAndSub(res.user);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeIdUploadModal();
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to upload document.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={closeIdUploadModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Identity Verification</h3>
          <p className="text-xs text-slate-500 mt-1">
            Upload a government-issued ID (Aadhaar, Driving License, PAN Card) to earn your <strong className="text-blue-600">Verified Crew</strong> badge.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-sm">Document Uploaded!</h4>
            <p className="text-xs text-emerald-700">
              Your document is pending admin review. You will receive an in-app notification upon verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 rounded-2xl p-6 text-center cursor-pointer relative transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {docUrl ? (
                <div className="space-y-2">
                  <FileCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="text-xs font-bold text-emerald-800">Document Selected</div>
                  <div className="text-[10px] text-slate-500">Click to change file</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-blue-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-800">Click or Drag ID Photo Here</div>
                  <div className="text-[10px] text-slate-400">Supports PNG, JPG, PDF up to 5MB</div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 bg-blue-50/70 p-3 rounded-xl border border-blue-100 space-y-1">
              <div className="font-bold text-blue-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Privacy Guaranteed
              </div>
              <p>Your raw ID card is strictly encrypted and only viewed by system administrators. Event Handlers will only see your Verified Badge.</p>
            </div>

            <button
              type="submit"
              disabled={loading || !docUrl}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-xs disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Submit Document for Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
