import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Sparkles,
  Star,
  User,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { SessionRequest, SessionReview, UserProfile } from '../../types';

interface SessionRoomModalProps {
  session: SessionRequest;
  currentUser: UserProfile;
  learner: UserProfile;
  tutor: UserProfile;
  review?: SessionReview;
  onCompleteSession: (sessionId: string, notes?: string) => void;
  onSubmitReview: (sessionId: string, rating: number, feedback: string) => void;
  onClose: () => void;
}

export const SessionRoomModal: React.FC<SessionRoomModalProps> = ({
  session,
  currentUser,
  learner,
  tutor,
  review,
  onCompleteSession,
  onSubmitReview,
  onClose,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [completionNotes, setCompletionNotes] = useState<string>(session.notes || '');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const isTutor = currentUser.id === tutor.id;
  const isLearner = currentUser.id === learner.id;
  const canComplete = (isTutor || isLearner) && session.status === 'accepted';
  const canReview = isLearner && session.status === 'completed' && !review;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setIsSubmittingReview(true);
    onSubmitReview(session.id, rating, feedback.trim());
    setIsSubmittingReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  session.status === 'accepted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : session.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : session.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Status: {session.status}
              </span>
              <span className="text-xs text-slate-400">ID: {session.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {session.subject} Peer Tutoring Room
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Participants Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          {/* Tutor */}
          <div className="flex items-center gap-3">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
            />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tutor / Mentor
              </span>
              <h4 className="font-extrabold text-sm text-slate-900">{tutor.name}</h4>
              <p className="text-xs text-slate-500">
                {tutor.department} &bull; Lvl {tutor.level}
              </p>
            </div>
          </div>

          {/* Learner */}
          <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-4">
            <img
              src={learner.avatar}
              alt={learner.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
            />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Learner / Student
              </span>
              <h4 className="font-extrabold text-sm text-slate-900">{learner.name}</h4>
              <p className="text-xs text-slate-500">
                {learner.department} &bull; Lvl {learner.level}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule & Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Confirmed Schedule</p>
              <p className="text-xs font-bold text-indigo-950">
                {session.date} &bull; {session.startTime} - {session.endTime}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
            {session.mode === 'online' ? (
              <Video className="w-5 h-5 text-indigo-600 shrink-0" />
            ) : (
              <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div className="overflow-hidden">
              <p className="text-[11px] font-semibold text-slate-500">
                {session.mode === 'online' ? 'Virtual Meeting' : 'On-Campus Location'}
              </p>
              <p className="text-xs font-bold text-indigo-950 truncate">
                {session.locationOrLink}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button for Online Meeting */}
        {session.mode === 'online' && session.status !== 'cancelled' && (
          <a
            href={session.locationOrLink.startsWith('http') ? session.locationOrLink : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <span>Launch Virtual Meeting Room (Google Meet)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Stated Learning Goal */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Learner's Target Goal
          </h4>
          <p className="text-xs text-amber-950 leading-relaxed italic">
            "{session.learningGoal}"
          </p>
        </div>

        {/* Session Reflection & Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Key Learning Outcomes &amp; Whiteboard Notes
          </label>
          {session.status === 'completed' ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              {session.notes || 'No custom takeaways recorded.'}
            </div>
          ) : (
            <textarea
              rows={2}
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Record code snippets discussed, algorithm takeaways, or next practice exercises..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:border-indigo-500 outline-none"
            />
          )}
        </div>

        {/* Mark Completed Workflow */}
        {canComplete && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-extrabold text-emerald-900">Finished this session?</h4>
              <p className="text-[11px] text-emerald-700">
                Mark as completed to release rewards: +100 XP (Learner) and +150 XP (Tutor).
              </p>
            </div>
            <button
              onClick={() => onCompleteSession(session.id, completionNotes)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
            >
              Confirm Session Complete &rarr;
            </button>
          </div>
        )}

        {/* Existing Review Display */}
        {review && (
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">Peer Feedback</span>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-indigo-950 italic">"{review.feedback}"</p>
            <span className="text-[10px] text-indigo-500 block">
              Submitted on {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Post-Session Reflection & Rating Form for Learner */}
        {canReview && (
          <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Post-Session Reflection &amp; Tutor Rating
              </h4>
              <p className="text-[11px] text-slate-500">
                Leave constructive feedback to award the tutor and earn yourself +25 XP!
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did your mentor explain well? How did this session help your coursework?"
              required
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-500 outline-none"
            />

            <button
              type="submit"
              disabled={isSubmittingReview || !feedback.trim()}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition disabled:opacity-50"
            >
              Submit Peer Review (+25 XP)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
