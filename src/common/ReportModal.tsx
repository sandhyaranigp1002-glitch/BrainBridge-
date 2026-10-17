import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, CheckCircle, Flag } from 'lucide-react';
import { storage } from '../../services/storage';
import { UserProfile } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: { id: string; name: string };
  targetCircle?: { id: string; name: string };
  currentUser: UserProfile;
  onReportSubmitted?: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  targetCircle,
  currentUser,
  onReportSubmitted
}) => {
  const [category, setCategory] = useState<string>('inappropriate_conduct');
  const [details, setDetails] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const targetType = targetCircle ? 'circle' : 'user_profile';
    const targetId = targetCircle ? targetCircle.id : targetUser?.id || 'unknown';
    const targetName = targetCircle ? targetCircle.name : targetUser?.name || 'Unknown User';

    storage.submitReport({
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType: targetType,
      targetId: targetId,
      targetName: targetName,
      reason: `[${category.toUpperCase().replace('_', ' ')}] ${details.trim()}`
    });

    setSubmitted(true);
    if (onReportSubmitted) onReportSubmitted();
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Report Filed Discretely</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Thank you for protecting our college community. Our campus administrator has received this audit log and will investigate under institutional conduct guidelines.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Trust & Safety Report</h3>
                <p className="text-xs text-slate-400">
                  Reporting: <span className="text-slate-200 font-semibold">{targetCircle?.name || targetUser?.name || 'Member'}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Violation Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value="inappropriate_conduct">Inappropriate or Disrespectful Conduct</option>
                  <option value="misleading_credentials">Misleading Credentials / Fake Expertise</option>
                  <option value="repeated_noshow">Repeated Session No-Show or Cancellation</option>
                  <option value="academic_dishonesty">Academic Integrity or Exam Cheating Solicitation</option>
                  <option value="spam_harassment">Spam, Advertising or Harassment</option>
                  <option value="other">Other Campus Safety Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Please describe what occurred clearly. Include dates, topics, or messages if applicable..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-300">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Reports are encrypted, strictly confidential, and accessible only to verified college administration.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-500/25 transition-all cursor-pointer"
                >
                  Submit Confidential Report
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
