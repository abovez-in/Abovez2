import React, { useState } from 'react';
import { Smartphone, Mail, X, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export const OtpVerificationModal: React.FC = () => {
  const { otpModalState, closeOtpModal, setUserAndSub, user } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!otpModalState || !otpModalState.open) return null;

  const isMobile = otpModalState.type === 'mobile';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 4) {
      setError('Please enter the full verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.verifyOtp(otpModalState.userId, otpModalState.type, code);
      setSuccessMsg(res.message || 'Verified successfully!');

      if (res.user) {
        setUserAndSub(res.user);
      }

      setTimeout(() => {
        setLoading(false);
        closeOtpModal();
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Invalid verification code. Please check and try again.');
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.resendOtp(otpModalState.userId, otpModalState.type);
      setSuccessMsg('New OTP code sent!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={closeOtpModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            {isMobile ? <Smartphone className="w-7 h-7" /> : <Mail className="w-7 h-7" />}
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {isMobile ? 'Verify Mobile Number' : 'Verify Email Address'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold text-slate-800">
              {otpModalState.target || (user ? (isMobile ? user.phone : user.email) : 'your account')}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 text-center">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Verify & Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Didn't receive code?</span>
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};
