import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Play,
  Video,
  Clock,
  Calendar,
  User,
  GraduationCap,
  BookOpen,
  Plus,
  X,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api, RecordedLectureRecord } from '../../services/api';
import { DEPARTMENT_OPTIONS, ACADEMIC_YEAR_OPTIONS, SEMESTER_OPTIONS } from '../auth/AuthPage';

interface RecordedLecturesHubProps {
  userDepartment?: string;
  userAcademicYear?: string;
  canManage?: boolean; // Tutors and Admins can add/edit
}

export const RecordedLecturesHub: React.FC<RecordedLecturesHubProps> = ({
  userDepartment,
  userAcademicYear,
  canManage = false,
}) => {
  const [lectures, setLectures] = useState<RecordedLectureRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(userDepartment || 'all');
  const [selectedYear, setSelectedYear] = useState(userAcademicYear || 'all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Video Player Modal
  const [activeVideo, setActiveVideo] = useState<RecordedLectureRecord | null>(null);

  // Add Lecture Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('DSA');
  const [newTutor, setNewTutor] = useState('Sandhyarani Patil');
  const [newDept, setNewDept] = useState(DEPARTMENT_OPTIONS[0]);
  const [newYear, setNewYear] = useState(ACADEMIC_YEAR_OPTIONS[0]);
  const [newSemester, setNewSemester] = useState(SEMESTER_OPTIONS[0]);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDuration, setNewDuration] = useState('50 mins');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadLectures = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await api.getRecordedLectures();
      setLectures(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load recorded lectures.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLectures();
  }, []);

  // Filter lectures
  const filteredLectures = lectures.filter((lec) => {
    if (selectedDept !== 'all' && lec.department !== selectedDept) return false;
    if (selectedYear !== 'all' && lec.academic_year !== selectedYear) return false;
    if (selectedSemester !== 'all' && lec.semester !== selectedSemester) return false;
    if (selectedSubject !== 'all' && lec.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = lec.title.toLowerCase().includes(q);
      const matchTutor = lec.tutor_name.toLowerCase().includes(q);
      const matchSubject = lec.subject.toLowerCase().includes(q);
      const matchDesc = (lec.description || '').toLowerCase().includes(q);
      return matchTitle || matchTutor || matchSubject || matchDesc;
    }
    return true;
  });

  const handleAddLectureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVideoUrl.trim()) {
      alert('Please provide a lecture title and video URL.');
      return;
    }
    setIsSubmitting(true);
    try {
      const durationNum = parseInt(newDuration.replace(/\D/g, ''), 10) || 45;
      await api.createRecordedLecture({
        title: newTitle.trim(),
        subject: newSubject,
        tutor_name: newTutor,
        department: newDept,
        academic_year: newYear,
        semester: newSemester,
        lecture_date: newDate,
        duration_minutes: durationNum,
        video_url: newVideoUrl.trim(),
        description: newDesc.trim(),
      });
      await loadLectures();
      setShowAddModal(false);
      // Reset form
      setNewTitle('');
      setNewVideoUrl('');
      setNewDesc('');
    } catch (err: any) {
      alert(err.message || 'Error saving lecture recording');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert YouTube standard URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Video className="w-4 h-4" />
              <span>Digital Archive &amp; Classroom Catch-up</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recorded Lectures &amp; Video Sessions
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Access high-definition recorded classroom lectures, revision tutorials, and lab walkthroughs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canManage && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Upload / Add Recording</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-5">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures by title, topic, or tutor..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="all">All Departments</option>
              {DEPARTMENT_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="all">All Academic Years</option>
              {ACADEMIC_YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="all">All Subjects</option>
              <option value="DSA">DSA</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="DBMS">DBMS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lectures Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Retrieving lectures from college database...</p>
        </div>
      ) : errorMessage ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : filteredLectures.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No recorded lectures found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedDept !== 'all' || selectedYear !== 'all' || selectedSubject !== 'all'
              ? 'Try resetting the filter criteria to browse all available university recordings.'
              : 'Recordings will appear here as soon as tutors upload or link their lecture sessions.'}
          </p>
          {(selectedDept !== 'all' || selectedYear !== 'all' || selectedSubject !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDept('all');
                setSelectedYear('all');
                setSelectedSemester('all');
                setSelectedSubject('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLectures.map((lec) => (
            <div
              key={lec.id || lec.lecture_id}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
            >
              {/* Thumbnail / Header Banner */}
              <div className="relative h-44 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-4 flex flex-col justify-between overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-all duration-300 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/20">
                    {lec.lecture_id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-sm">
                    {lec.subject}
                  </span>
                </div>

                {/* Big Center Play Button */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <button
                    onClick={() => setActiveVideo(lec)}
                    className="w-13 h-13 rounded-full bg-indigo-600 group-hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 transform group-hover:scale-110 transition duration-200 active:scale-95"
                    title="Play Lecture Video"
                  >
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </button>
                </div>

                <div className="relative z-10 flex items-center justify-between text-white/80 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lec.duration_minutes || (lec as any).duration || '45 mins'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lec.lecture_date}</span>
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition">
                    {lec.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {lec.description || 'Comprehensive lecture recording with theoretical proofs, live code walkthrough, and practical examples.'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{lec.tutor_name}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {lec.semester || 'Semester 3'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[170px]" title={lec.department}>
                      {lec.department}
                    </span>
                    <span className="font-medium text-slate-600">
                      {lec.academic_year}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveVideo(lec)}
                    className="w-full mt-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Play className="w-3.5 h-3.5 fill-indigo-700" />
                    <span>Watch Recording</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-4xl w-full border border-slate-800 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                  {activeVideo.lecture_id}
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base leading-tight">
                    {activeVideo.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tutor: <span className="text-indigo-300 font-medium">{activeVideo.tutor_name}</span> &bull; Subject:{' '}
                    <span className="text-emerald-400 font-medium">{activeVideo.subject}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video bg-black w-full flex items-center justify-center">
              {activeVideo.video_url.includes('youtube.com') || activeVideo.video_url.includes('youtu.be') ? (
                <iframe
                  src={getEmbedUrl(activeVideo.video_url)}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeVideo.video_url.endsWith('.mp4') || activeVideo.video_url.endsWith('.webm') ? (
                <video
                  src={activeVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center text-slate-300">
                  <Video className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Video Streaming Resource</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">{activeVideo.video_url}</p>
                  <a
                    href={activeVideo.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    <span>Open in External Media Player</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Details Footer */}
            <div className="p-5 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-slate-400">
                  {activeVideo.description || 'University accredited recorded educational material for student revision.'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Department: {activeVideo.department} &bull; {activeVideo.academic_year} &bull; Recorded on {activeVideo.lecture_date}
                </p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition shrink-0"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lecture Recording Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-lg">Add Recorded Lecture</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLectureSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lecture Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Dynamic Programming & Memoization Patterns"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="DBMS">DBMS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tutor Name *</label>
                  <select
                    value={newTutor}
                    onChange={(e) => setNewTutor(e.target.value)}
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
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
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
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
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
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lecture Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (e.g. 50 mins)</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="50 mins"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Video Recording URL or Stream Link *
                </label>
                <input
                  type="url"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or direct MP4 URL"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lecture Description / Syllabus Notes</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summary of topics covered, references, and homework assignment..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to Database...' : 'Save Recording'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
