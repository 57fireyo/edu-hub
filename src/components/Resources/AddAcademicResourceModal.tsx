import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  FileText,
  Video,
  Code2,
  Upload,
  Link,
  Plus,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Loader2,
  Eye,
} from 'lucide-react';
import { ResourceType, ResourceItem } from '../../types';
import { getYouTubeVideoId } from '../../lib/youtube';
import { openPdfInNewTab, uploadPdfToServer } from '../../lib/pdfHelper';
import {
  ACADEMIC_YEARS,
  YEAR_SEMESTERS,
  getDefaultSemesterForYear,
  isYearMatch,
} from '../../lib/academicHelper';

interface AddAcademicResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultYear?: string;
  defaultSemester?: string;
  defaultBranch?: string;
  defaultSubject?: string;
  onUploaded?: (details: { year: string; semester: string; subjectCode: string }) => void;
}

export const AddAcademicResourceModal: React.FC<AddAcademicResourceModalProps> = ({
  isOpen,
  onClose,
  defaultYear = '2nd Year',
  defaultSemester,
  defaultBranch = 'CY',
  defaultSubject = 'DSA',
  onUploaded,
}) => {
  const { addResource, academicSubjects, academicBranches, academicYears, showToast } = useApp();
  const { user } = useAuth();

  const [resourceType, setResourceType] = useState<ResourceType>('pdf');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Algorithms');
  const [year, setYear] = useState<string>(defaultYear);
  const [semester, setSemester] = useState<string>(
    defaultSemester || getDefaultSemesterForYear(defaultYear)
  );
  const [branch, setBranch] = useState<string>(defaultBranch);
  const [subjectCode, setSubjectCode] = useState<string>(defaultSubject);

  const handleYearChange = (newYear: string) => {
    setYear(newYear);
    const availableSems = YEAR_SEMESTERS[newYear] || ['Semester 1'];
    const newSem = availableSems[0];
    setSemester(newSem);
    const matching = academicSubjects.filter(
      (s) => isYearMatch(s.year, s.academicYear, newYear) && s.semester === newSem
    );
    if (matching.length > 0) {
      setSubjectCode(matching[0].code);
    }
  };

  const handleSemesterChange = (newSem: string) => {
    setSemester(newSem);
    const matching = academicSubjects.filter(
      (s) => isYearMatch(s.year, s.academicYear, year) && s.semester === newSem
    );
    if (matching.length > 0) {
      setSubjectCode(matching[0].code);
    }
  };

  const filteredSubjectsForUpload = useMemo(() => {
    const list = academicSubjects.filter((s) => {
      const yrMatch = isYearMatch(s.year, s.academicYear, year);
      const semMatch = !s.semester || s.semester === semester;
      return yrMatch && semMatch;
    });
    return list.length > 0 ? list : academicSubjects;
  }, [academicSubjects, year, semester]);

  // PDF specific
  const [fileUrl, setFileUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [pageCount, setPageCount] = useState<number>(24);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Video specific
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('45 min');
  const [timestamps, setTimestamps] = useState<Array<{ time: string; label: string }>>([
    { time: '00:00', label: 'Introduction & Core Concepts' },
    { time: '12:30', label: 'Implementation Walkthrough' },
    { time: '34:15', label: 'Complexity Analysis' },
  ]);
  const [newTsTime, setNewTsTime] = useState('');
  const [newTsLabel, setNewTsLabel] = useState('');

  // Markdown note / code
  const [markdownContent, setMarkdownContent] = useState('');

  if (!isOpen) return null;

  const handleAddTimestamp = () => {
    if (!newTsTime.trim() || !newTsLabel.trim()) return;
    setTimestamps([...timestamps, { time: newTsTime.trim(), label: newTsLabel.trim() }]);
    setNewTsTime('');
    setNewTsLabel('');
  };

  const handleRemoveTimestamp = (idx: number) => {
    setTimestamps(timestamps.filter((_, i) => i !== idx));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingPdf(true);
      try {
        const result = await uploadPdfToServer(file);
        setFileName(result.fileName);
        setFileSize(result.fileSize);
        setFileUrl(result.url);
        setDownloadUrl(result.downloadUrl);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
        showToast(`✓ Attached and verified "${result.fileName}"`);
      } catch (err) {
        console.error('PDF upload error:', err);
        showToast('PDF processing failed, please try again');
      } finally {
        setIsUploadingPdf(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a resource title');
      return;
    }

    const finalFileUrl = fileUrl || '/dsa-all-practicals.pdf';
    const finalDownloadUrl = downloadUrl || finalFileUrl;
    const finalFileName = fileName || `${title.trim()}.pdf`;

    const newResourceItem: Omit<ResourceItem, 'id' | 'rating' | 'viewCount' | 'likesCount' | 'reviewsCount'> = {
      title: title.trim(),
      description: description.trim() || `Course material for ${subjectCode} (${year}, ${semester}, Branch ${branch})`,
      category,
      type: resourceType,
      author: user.name || 'Faculty Member',
      readTime: resourceType === 'Video Lectures' ? videoDuration : `${pageCount} pages`,
      url: finalFileUrl,
      downloadUrl: finalDownloadUrl,
      fileUrl: finalFileUrl,
      fileName: finalFileName,
      fileSize: fileSize || '4.2 MB',
      pageCount: pageCount || 24,
      year: year,
      academicYear: year,
      semester: semester,
      branch: branch,
      subjectCode: subjectCode,
      videoUrl: videoUrl || undefined,
      videoDuration: videoDuration || undefined,
      videoTimestamps: timestamps.length > 0 ? timestamps : undefined,
      markdownContent: markdownContent || undefined,
      uploaderId: user.id || 'user-101',
      uploaderName: user.name || 'Alex Rivera',
      uploaderAvatar: user.avatar,
      uploaderRole: user.role === 'alumni' ? 'Alumni Mentor' : 'Faculty / Student',
      downloadCount: 0,
      tags: [subjectCode, year, semester, branch, resourceType],
    };

    addResource(newResourceItem);
    onUploaded?.({ year, semester, subjectCode });
    showToast(`✓ Uploaded "${title.trim()}" to ${year} • ${semester} • ${subjectCode}! Opening review in new tab...`);
    onClose();

    // Show review of that PDF in a new tab immediately
    if (resourceType === 'pdf' || resourceType === 'Notes') {
      openPdfInNewTab(finalFileUrl, finalFileName);
    }
  };

  return (
    <div
      id="add-academic-resource-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Academic Material
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attach Notes, PDFs, Video Lectures, or Markdown snippets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Format Picker */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
              Resource Format
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { type: 'pdf' as ResourceType, label: 'PDF Document / Paper', icon: FileText },
                { type: 'Video Lectures' as ResourceType, label: 'Video / YouTube', icon: Video },
                { type: 'Articles' as ResourceType, label: 'Markdown / Snippet', icon: Code2 },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = resourceType === fmt.type;
                return (
                  <button
                    key={fmt.type}
                    type="button"
                    onClick={() => setResourceType(fmt.type)}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academic Target Hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">1. Academic Year</label>
              <select
                value={year}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-bold"
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">2. Semester</label>
              <select
                value={semester}
                onChange={(e) => handleSemesterChange(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-bold"
              >
                {(YEAR_SEMESTERS[year] || ['Semester 1', 'Semester 2']).map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">3. Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-medium"
              >
                {academicBranches.map((b) => (
                  <option key={b.code} value={b.code}>{b.code} - {b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">4. Target Subject</label>
              <select
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-bold"
              >
                {filteredSubjectsForUpload.map((s) => (
                  <option key={s.id} value={s.code}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Resource Title
              </label>
              <input
                type="text"
                placeholder="e.g. DSA Complete Unit 1 to 4 Verified Syllabus & Previous Year Paper"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="Algorithms">Algorithms</option>
                <option value="System Design">System Design</option>
                <option value="Web Dev">Web Dev</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
              Overview / Syllabus Topics
            </label>
            <textarea
              rows={2}
              placeholder="Detailed summary of covered topics, exam question tips, and code walkthroughs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Format Specific Fields */}
          {(resourceType === 'Notes' || resourceType === 'pdf') && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>PDF Document & Download Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Attach Local PDF File (Notes / Manual)
                    </label>
                    {isUploadingPdf && (
                      <span className="text-[10px] text-indigo-600 flex items-center gap-1 font-bold">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading & verifying PDF...
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    disabled={isUploadingPdf}
                    className="w-full mt-1 text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Upload your document directly in PDF format (.pdf)
                  </p>
                </div>

                {fileUrl && (
                  <div className="sm:col-span-2 p-3 bg-indigo-50/80 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {fileName || 'Attached PDF Document'}
                        </div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400">
                          {fileSize || 'Verified PDF'} • Ready to review
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openPdfInNewTab(fileUrl, fileName)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review in New Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Page Count</label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">File Size Display</label>
                  <input
                    type="text"
                    placeholder="e.g. 4.8 MB"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {resourceType === 'Video Lectures' && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Video Player & Timestamp Markers</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Video Embed / YouTube URL</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... or .mp4 URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 52 min"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Chapter Timestamps</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="00:00"
                    value={newTsTime}
                    onChange={(e) => setNewTsTime(e.target.value)}
                    className="w-24 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Topic / Chapter Label"
                    value={newTsLabel}
                    onChange={(e) => setNewTsLabel(e.target.value)}
                    className="flex-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTimestamp}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
                  >
                    Add Marker
                  </button>
                </div>

                {timestamps.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {timestamps.map((ts, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{ts.time}</span>
                          <span className="text-slate-700 dark:text-slate-300">{ts.label}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTimestamp(idx)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube Video Lecture Embed & Link Preview */}
              {videoUrl.trim() && (
                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Live Video Lecture Preview
                    </span>
                    <a
                      href={`https://www.youtube.com/watch?v=${getYouTubeVideoId(videoUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-xs font-semibold"
                    >
                      Watch Video on YouTube
                    </a>
                  </div>

                  <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-lg bg-black border border-slate-200 dark:border-slate-800 shadow-sm">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoUrl)}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          )}

          {resourceType === 'Articles' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Syllabus Key Points & Code Theorems
              </label>
              <textarea
                rows={6}
                placeholder="# Unit 2: Binary Search Trees&#10;&#10;Here is the insertion routine in C++:&#10;&#10;```cpp&#10;Node* insert(Node* root, int val) { ... }&#10;```"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                className="w-full font-mono text-xs px-3 py-2 bg-slate-950 text-slate-100 rounded-xl border border-slate-800"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Publish Material</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
