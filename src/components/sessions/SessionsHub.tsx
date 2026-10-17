import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  MapPin,
  MessageSquare,
  Sparkles,
  Star,
  User,
  Video,
  X,
  XCircle,
} from 'lucide-react';
import { SessionRequest, SessionReview, UserProfile } from '../../types';

interface SessionsHubProps {
  sessions: SessionRequest[];
  currentUser: UserProfile;
  allUsers: UserProfile[];
  reviews: SessionReview[];
  onAcceptSession: (sessionId: string) => void;
  onDeclineSession: (sessionId: string) => void;
  onOpenSessionRoom: (session: SessionRequest) => void;
}

export const SessionsHub: React.FC<SessionsHubProps> = ({
  sessions,
  currentUser,
  allUsers,
  reviews,
  onAcceptSession,
  onDeclineSession,
  onOpenSessionRoom,
}) => {
  const [tab, setTab] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  // Filter sessions that involve the current user (either as learner or tutor)
  const mySessions = sessions.filter(
    (s) => s.learnerId === currentUser.id || s.tutorId === currentUser.id
  );

  const filteredSessions = mySessions.filter((s) => {
    if (tab === 'all') return true;
    return s.status === tab;
  });

  const pendingRequestsForMe = mySessions.filter(
    (s) => s.tutorId === currentUser.id && s.status === 'pending'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Session Booking Lifecycle Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Tutoring Sessions
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mt-1 leading-relaxed">
            Manage your peer tutoring engagements, confirm incoming learner bookings, launch virtual meeting rooms, and record post-session notes.
          </p>
        </div>

        {/* Pending alerts pill */}
        {pendingRequestsForMe.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              {pendingRequestsForMe.length}
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">Incoming Requests</p>
              <p className="text-[11px] text-amber-700">Waiting for your tutor review</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'all', label: 'All Sessions', count: mySessions.length },
          {
            id: 'pending',
            label: 'Pending Requests',
            count: mySessions.filter((s) => s.status === 'pending').length,
          },
          {
            id: 'accepted',
            label: 'Upcoming Confirmed',
            count: mySessions.filter((s) => s.status === 'accepted').length,
          },
          {
            id: 'completed',
            label: 'Completed History',
            count: mySessions.filter((s) => s.status === 'completed').length,
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              tab === t.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                tab === t.id ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
          <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No sessions in this view</h3>
          <p className="text-xs text-slate-500 mt-1">
            Book a session with a mentor from the directory or manage your tutor availability.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const learner = allUsers.find((u) => u.id === session.learnerId);
            const tutor = allUsers.find((u) => u.id === session.tutorId);
            const isTutorForThis = currentUser.id === session.tutorId;
            const otherParty = isTutorForThis ? learner : tutor;
            const review = reviews.find((r) => r.sessionId === session.id);

            return (
              <div
                key={session.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 transition shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={otherParty?.avatar}
                      alt={otherParty?.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-900">
                          {session.subject}
                        </h4>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            session.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : session.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : session.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isTutorForThis ? 'Tutoring Learner: ' : 'Mentored by: '}
                        <strong>{otherParty?.name}</strong> ({otherParty?.department})
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 sm:text-right space-y-1">
                    <div className="flex items-center sm:justify-end gap-1.5 font-semibold text-slate-900">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{session.date} &bull; {session.startTime} - {session.endTime}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 text-slate-500">
                      {session.mode === 'online' ? (
                        <Video className="w-3.5 h-3.5 text-indigo-500" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span className="truncate max-w-xs">{session.locationOrLink}</span>
                    </div>
                  </div>
                </div>

                {/* Learning Goal Preview */}
                <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Learning Goal: </span>
                  <span className="text-slate-600 italic">"{session.learningGoal}"</span>
                </div>

                {/* Review if completed */}
                {review && (
                  <div className="text-xs bg-amber-50/50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-amber-900">★{review.rating}</span>
                      <span className="text-amber-800">"{review.feedback}"</span>
                    </div>
                    <span className="text-[10px] text-amber-700">Verified Peer Review</span>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  {/* Tutor Accept / Decline Actions when Pending */}
                  {isTutorForThis && session.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAcceptSession(session.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Session Request</span>
                      </button>
                      <button
                        onClick={() => onDeclineSession(session.id)}
                        className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400">
                      {session.status === 'pending'
                        ? 'Waiting for tutor confirmation...'
                        : session.status === 'accepted'
                        ? 'Session confirmed. Open room to join.'
                        : 'Session archived.'}
                    </div>
                  )}

                  <button
                    onClick={() => onOpenSessionRoom(session)}
                    className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                  >
                    View Room Details &amp; Reflection &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
