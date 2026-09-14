import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  GraduationCap,
  Layers,
  Crown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AcademicSubject, AcademicBranch } from '../../types';

interface ManageAcademicStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageAcademicStructureModal: React.FC<ManageAcademicStructureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    academicSubjects,
    academicBranches,
    academicYears,
    addAcademicSubject,
    deleteAcademicSubject,
    addAcademicBranch,
    deleteAcademicBranch,
    addAcademicYear,
    deleteAcademicYear,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'subjects' | 'branches' | 'years'>('subjects');

  // New Subject Form State
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjYear, setNewSubjYear] = useState('2nd Year');
  const [newSubjBranch, setNewSubjBranch] = useState('CY');
  const [newSubjDesc, setNewSubjDesc] = useState('');
  const [newSubjSemester, setNewSubjSemester] = useState<number>(3);

  // New Branch Form State
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchHod, setNewBranchHod] = useState('');

  // New Year Form State
  const [newYearInput, setNewYearInput] = useState('');

  if (!isOpen) return null;

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjCode.trim() || !newSubjName.trim()) {
      showToast('Subject Code and Name are required');
      return;
    }

    addAcademicSubject({
      code: newSubjCode.trim().toUpperCase(),
      name: newSubjName.trim(),
      academicYear: newSubjYear,
      branch: newSubjBranch,
      description: newSubjDesc.trim() || `${newSubjName.trim()} syllabus and materials.`,
      semester: Number(newSubjSemester),
      credits: 4,
      totalResources: 0,
    });

    setNewSubjCode('');
    setNewSubjName('');
    setNewSubjDesc('');
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchCode.trim() || !newBranchName.trim()) {
      showToast('Branch Code and Name are required');
      return;
    }

    addAcademicBranch({
      code: newBranchCode.trim().toUpperCase(),
      name: newBranchName.trim(),
      hodName: newBranchHod.trim() || 'Department Head',
      activeYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    });

    setNewBranchCode('');
    setNewBranchName('');
    setNewBranchHod('');
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;
    addAcademicYear(newYearInput.trim());
    setNewYearInput('');
  };

  return (
    <div
      id="manage-academic-structure-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Manage Academic Structure
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  OWNER MODE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure Years, Branches, and Subjects (DSA, CAN, ISE) synced live with Firestore
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 gap-2 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'subjects'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Subjects ({academicSubjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'branches'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Academic Branches ({academicBranches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('years')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'years'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Academic Years ({academicYears.length})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SUBJECTS */}
          {activeTab === 'subjects' && (
            <div className="space-y-6">
              {/* Add Subject Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>Add New Course Subject (e.g. DSA, CAN, ISE)</span>
                </h3>
                <form onSubmit={handleCreateSubject} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Subject Code</label>
                    <input
                      type="text"
                      placeholder="e.g. DSA, CAN, ISE"
                      value={newSubjCode}
                      onChange={(e) => setNewSubjCode(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase font-mono font-bold text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Full Subject Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Data Structures & Algorithms"
                      value={newSubjName}
                      onChange={(e) => setNewSubjName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Target Year</label>
                    <select
                      value={newSubjYear}
                      onChange={(e) => setNewSubjYear(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    >
                      {academicYears.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Branch</label>
                    <select
                      value={newSubjBranch}
                      onChange={(e) => setNewSubjBranch(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    >
                      {academicBranches.map((b) => (
                        <option key={b.code} value={b.code}>{b.code} - {b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Brief Curriculum Overview</label>
                    <input
                      type="text"
                      placeholder="e.g. Trees, Graphs, Sorting, Dynamic Programming, Big-O"
                      value={newSubjDesc}
                      onChange={(e) => setNewSubjDesc(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Subject</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Current Subjects List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Configured Subjects ({academicSubjects.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">Filtered by Year & Branch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {academicSubjects.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            {sub.code}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {sub.name}
                          </h5>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {sub.academicYear} • Branch {sub.branch} • Sem {sub.semester || 3}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Remove subject "${sub.name}" (${sub.code})?`)) {
                            deleteAcademicSubject(sub.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors ml-2"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRANCHES */}
          {activeTab === 'branches' && (
            <div className="space-y-6">
              {/* Add Branch Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>Add New Engineering Branch</span>
                </h3>
                <form onSubmit={handleCreateBranch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Branch Code</label>
                    <input
                      type="text"
                      placeholder="e.g. CY, DS, AI, ETC, ME"
                      value={newBranchCode}
                      onChange={(e) => setNewBranchCode(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase font-mono font-bold text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Branch Department Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Cyber Security Engineering"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Head of Department (HOD)</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. K. Verma"
                      value={newBranchHod}
                      onChange={(e) => setNewBranchHod(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Department Branch</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Current Branches List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Active Engineering Branches ({academicBranches.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {academicBranches.map((b) => (
                    <div
                      key={b.code}
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {b.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {b.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          HOD: {b.hodName || 'Assigned Faculty'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Remove branch ${b.code}?`)) {
                            deleteAcademicBranch(b.code);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: YEARS */}
          {activeTab === 'years' && (
            <div className="space-y-6">
              {/* Add Year Form */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="e.g. 5th Year (Dual Degree)"
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleCreateYear}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Year</span>
                </button>
              </div>

              {/* Active Years */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Academic Years ({academicYears.length})
                </h4>
                <div className="space-y-2">
                  {academicYears.map((yr) => (
                    <div
                      key={yr}
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {yr}
                      </span>
                      {academicYears.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove year level "${yr}"?`)) {
                              deleteAcademicYear(yr);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes persist immediately to Google Cloud Firestore</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
