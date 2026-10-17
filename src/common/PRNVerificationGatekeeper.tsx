import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface PRNVerificationGatekeeperProps {
  currentUser: UserProfile;
  featureName?: string;
  onContactSupport?: () => void;
}

export const PRNVerificationGatekeeper: React.FC<PRNVerificationGatekeeperProps> = ({
  currentUser,
  featureName = 'Peer Tutoring Sessions',
  onContactSupport,
}) => {
  const isPending = currentUser.verificationStatus === 'pending';
  const isRejected = currentUser.verificationStatus === 'rejected';

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl max-w-xl mx-auto my-6 text-center space-y-5 animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner border border-amber-200">
        {isPending ? (
          <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
        ) : isRejected ? (
          <ShieldAlert className="w-8 h-8 text-rose-600" />
        ) : (
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
        )}
      </div>

      <div className="space-y-2">
        <span
          className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border ${
            isPending
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}
        >
          {isPending ? '⏳ Academic PRN Verification Pending' : '❌ Verification Declined'}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {isPending ? 'Identity Verification In Progress' : 'Student Verification Declined'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {isPending
            ? `To protect university academic integrity, booking ${featureName} is restricted to verified students. An authorized campus administrator is currently cross-referencing your PRN with official college records.`
            : `Your Permanent Registration Number could not be verified by campus administration. Please contact the registrar office.`}
        </p>
      </div>

      {/* Verification Card Details */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5 max-w-md mx-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-semibold">Registered Student</span>
          <span className="font-bold text-slate-800">{currentUser.name}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-semibold">College Email</span>
          <span className="font-mono text-slate-700">{currentUser.email}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-semibold">PRN (Masked)</span>
          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {currentUser.prnMasked || 'PRN-****-Pending'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-semibold">Current Clearance Status</span>
          <span className="font-bold text-amber-700">
            {isPending ? 'Awaiting Registrar Approval' : 'Declined by Administrator'}
          </span>
        </div>
      </div>

      {isRejected && currentUser.rejectionReason && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium text-left max-w-md mx-auto">
          <strong>Administrator Feedback:</strong> "{currentUser.rejectionReason}"
        </div>
      )}

      {/* Allowed vs Restricted */}
      <div className="grid grid-cols-2 gap-3 text-xs text-left max-w-md mx-auto pt-1">
        <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            ✓ Available Now
          </span>
          <ul className="text-emerald-700 space-y-1 text-[11px]">
            <li>&bull; Explore Tutor Directory</li>
            <li>&bull; View Visual Skill Tree</li>
            <li>&bull; View Learning Circles</li>
          </ul>
        </div>
        <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            🔒 Unlocked Upon Verification
          </span>
          <ul className="text-slate-500 space-y-1 text-[11px]">
            <li>&bull; Book Tutoring Sessions</li>
            <li>&bull; Create Learning Circles</li>
            <li>&bull; Apply to Become a Tutor</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
