import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { KeyRound, Loader2, Sparkles, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900 font-sans">
      
      {/* --- Cosmic Background Elements --- */}
      <div className="absolute top-[50%] left-[-50%] right-[-50%] h-[200%] bg-brand-900/20 rounded-[100%] blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-40 bg-stars animate-pulse-slow pointer-events-none"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_20px_4px_rgba(255,255,255,0.6)] animate-float opacity-70"></div>
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-purple-400 rounded-full shadow-[0_0_25px_5px_rgba(192,132,252,0.5)] animate-float delay-700 opacity-50"></div>

      {/* --- Main Card --- */}
      <div className="relative z-10 w-full max-w-[440px] p-4">
        
        {/* Top Glowing Icon */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-md border border-slate-700 shadow-[0_0_40px_rgba(14,165,233,0.4)] flex items-center justify-center group">
             <div className="absolute inset-0 bg-brand-500/20 rounded-3xl blur-xl group-hover:bg-brand-400/30 transition-all duration-500"></div>
             <KeyRound className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" size={32} />
          </div>
        </div>

        {/* Glass Container */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 pt-16 shadow-2xl relative overflow-hidden">
          
          {/* Inner Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent blur-sm opacity-50"></div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-wide mb-2 flex items-center justify-center gap-2">
              Reset Password <Sparkles size={16} className="text-brand-400" />
            </h2>
            <p className="text-[13px] text-slate-400 px-4">
              {isSubmitted 
                ? "Check your inbox for instructions." 
                : "Enter your email to receive reset instructions."}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
              {error && (
                <div className="text-[13px] text-red-300 bg-red-900/30 p-2 rounded border border-red-500/30 text-center">
                  {error}
                </div>
              )}

              <div className="group relative">
                <Mail size={16} className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3.5 text-[13px] text-slate-200 placeholder-slate-500 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 focus:bg-slate-900/80 transition-all duration-300 shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 text-white font-bold text-[13px] py-3.5 rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'SEND RESET LINK'}
              </button>
            </form>
          ) : (
             <div className="text-center space-y-6 py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                  <CheckCircle size={32} />
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                   <p className="text-sm text-slate-300">
                     We have sent a password reset link to <span className="text-brand-400 font-semibold">{email}</span>.
                   </p>
                </div>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-[13px] text-slate-500 hover:text-white transition-colors"
                >
                  Click here to try another email
                </button>
             </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-[13px] text-slate-400 hover:text-brand-400 transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;