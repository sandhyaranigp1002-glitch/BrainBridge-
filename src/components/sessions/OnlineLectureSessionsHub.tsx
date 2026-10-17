import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Plus,
  X,
  User,
  GraduationCap,
  Sparkles,
  Link2,
  CheckCircle2,
  AlertCircle,
  FileVideo
} from 'lucide-react';
import { api, OnlineSessionRecord } from '../../services/api';
import { DEPARTMENT_OPTIONS, ACADEMIC_YEAR_OPTIONS, SEMESTER_OPTIONS } from '../auth/AuthPage';

interface OnlineLectureSessionsHubProps {
  userDepartment?: string;
  userAcademicYear?: string;
  canManage?: boolean; // Tutors and Admins
  onSessionJoined?: (session: OnlineSessionRecord) => void;
}

export const OnlineLectureSessionsHub: React.FC<OnlineLectureSessionsHubProps> = ({
  userDepartment,
  userAcademicYear,
  canManage = false,
  onSessionJoined,
}) => {
  const [sessions, setSessions] = useState<OnlineSessionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Create Session Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('DSA');
  const [tutorName, setTutorName] = useState('Sandhyarani Patil');
  const [department, setDepartment] = useState(userDepartment || DEPARTMENT_OPTIONS[0]);
  const [academicYear, setAcademicYear] = useState(userAcademicYear || ACADEMIC_YEAR_OPTIONS[0]);
  const [semester, setSemester] = useState(SEMESTER_OPTIONS[0]);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Attach Recording Modal
  const [attachingSession, setAttachingSession] = useState<OnlineSessionRecord | null>(null);
  const [recordingUrl, setRecordingUrl] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);

  const loadSessions = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await api.getSessions();
      setSessions(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load online lecture sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !meetingLink.trim()) {
      alert('Please fill out the session title and online meeting link.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Backend automatically generates unique session_id (e.g., SESS-2025-XXXX)
      await api.createSession({
        title: title.trim(),
        subject,
        tutor_name: tutorName,
        department,
        academic_year: academicYear,
        semester,
        scheduled_date: scheduledDate,
        start_time: startTime,
        end_time: endTime,
        meeting_link: meetingLink.trim(),
        status: 'Scheduled',
      });

      await loadSessions();
      setShowCreateModal(false);
      setTitle('');
    } catch (err: any) {
      alert(err.message || 'Failed to create online lecture session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttachRecordingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachingSession || !recordingUrl.trim()) {
      alert('Please provide a valid recording URL.');
      return;
    }

    setIsAttaching(true);
    try {
      // Update session with recording URL and change status to Recording Available
      await api.updateSession(attachingSession.id, {
        recording_url: recordingUrl.trim(),
        status: 'Recording Available',
      });

      // Also create an entry in Recorded Lectures module so it is immediately searchable
      try {
        await api.createRecordedLecture({
          title: attachingSession.title,
          subject: attachingSession.subject,
          tutor_name: attachingSession.tutor_name,
          department: attachingSession.department,
          academic_year: attachingSession.academic_year,
          semester: attachingSession.semester,
          lecture_date: attachingSession.scheduled_date,
          duration_minutes: 60,
          video_url: recordingUrl.trim(),
          description: `Classroom recording from online session ${attachingSession.session_id}`,
          session_id: attachingSession.session_id,
        });
      } catch (recErr) {
        // Handled gracefully
      }

      await loadSessions();
      setAttachingSession(null);
      setRecordingUrl('');
    } catch (err: any) {
      alert(err.message || 'Failed to attach recording');
    } finally {
      setIsAttaching(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: OnlineSessionRecord['status']) => {
    try {
      await api.updateSession(id, { status: newStatus });
      await loadSessions();
    } catch (err: any) {
      alert(err.message || 'Failed to update session status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[11px] font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            LIVE NOW
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
            Scheduled
          </span>
        );
      case 'Recording Available':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Recording Ready
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Video className="w-4 h-4" />
            <span>Virtual Classroom &amp; Interactive Live Lectures</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Online Lecture Sessions
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Join live classroom meetings with assigned faculty, participate in doubt-solving, or access post-session recordings.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Lecture Session (Auto ID)</span>
          </button>
        )}
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Retrieving scheduled lecture sessions...</p>
        </div>
      ) : errorMessage ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No scheduled sessions at this time</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Upcoming lecture sessions created by faculty will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((sess) => (
            <div
              key={sess.id || sess.session_id}
              className={`bg-white rounded-2xl border ${
                sess.status === 'Live'
                  ? 'border-rose-300 shadow-md shadow-rose-100 ring-2 ring-rose-400/20'
                  : 'border-slate-200 shadow-sm'
              } p-5 flex flex-col justify-between hover:shadow-md transition`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {sess.session_id}
                  </span>
                  {getStatusBadge(sess.status)}
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    {sess.subject}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5">
                    {sess.title}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Faculty: <strong>{sess.tutor_name}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Date: {sess.scheduled_date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{sess.start_time} - {sess.end_time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sess.department} &bull; {sess.academic_year}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                {sess.status === 'Live' ? (
                  <a
                    href={sess.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onSessionJoined && onSessionJoined(sess)}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 transition active:scale-98"
                  >
                    <Video className="w-4 h-4 fill-white animate-bounce" />
                    <span>Join Live Meeting Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : sess.status === 'Scheduled' ? (
                  <a
                    href={sess.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onSessionJoined && onSessionJoined(sess)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition active:scale-98"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Launch Meeting Room</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : sess.recording_url ? (
                  <a
                    href={sess.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <FileVideo className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Watch Available Recording</span>
                  </a>
                ) : (
                  <div className="text-center py-1.5 text-xs text-slate-400 font-medium">
                    Session Concluded
                  </div>
                )}

                {/* Tutor/Admin Controls */}
                {canManage && (
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <select
                      value={sess.status}
                      onChange={(e) => handleStatusChange(sess.id, e.target.value as any)}
                      className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Live">Live</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Recording Available">Recording Available</option>
                    </select>

                    <button
                      onClick={() => {
                        setAttachingSession(sess);
                        setRecordingUrl(sess.recording_url || '');
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {sess.recording_url ? 'Edit Recording' : '+ Attach Recording'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Create Online Lecture Session</h3>
                  <p className="text-[11px] text-slate-500">A unique Session ID will be generated automatically upon creation.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Session Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Graph Traversal Algorithms & Shortest Paths"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="DBMS">DBMS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tutor / Faculty *</label>
                  <select
                    value={tutorName}
                    onChange={(e) => setTutorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Sandhyarani Patil">Sandhyarani Patil (DSA)</option>
                    <option value="Rutuja Gaikwad">Rutuja Gaikwad (Java)</option>
                    <option value="Vivek Utturkar">Vivek Utturkar (Python)</option>
                    <option value="Rohan Patil">Rohan Patil (DBMS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Year *</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {ACADEMIC_YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester *</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {SEMESTER_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="11:30 AM"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Online Meeting Link (Google Meet / Zoom / Teams) *
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xyz-abc-def"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Generating Session...' : 'Create Online Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attach Recording Modal */}
      {attachingSession && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileVideo className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Attach Lecture Recording</h3>
              </div>
              <button
                onClick={() => setAttachingSession(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 text-xs text-slate-600 space-y-1">
              <p>Session ID: <strong className="font-mono">{attachingSession.session_id}</strong></p>
              <p>Title: <strong>{attachingSession.title}</strong></p>
            </div>

            <form onSubmit={handleAttachRecordingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Video Recording URL or Upload Link *
                </label>
                <input
                  type="url"
                  value={recordingUrl}
                  onChange={(e) => setRecordingUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or direct MP4 URL"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAttachingSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAttaching}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isAttaching ? 'Attaching...' : 'Attach & Publish Recording'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
