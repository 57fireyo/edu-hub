import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  GraduationCap,
  Building2,
  Award,
  Users,
  ShieldCheck,
  UserPlus,
  Crown,
  Check,
} from 'lucide-react';
import { ProjectContributor, FacultyGuide } from '../../types';

interface CreditsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedContributor?: ProjectContributor | null;
}

export const CreditsEditorModal: React.FC<CreditsEditorModalProps> = ({
  isOpen,
  onClose,
  initialSelectedContributor,
}) => {
  const {
    projectCredits,
    updateProjectCredits,
    updateHODInfo,
    addContributor,
    updateContributor,
    deleteContributor,
    addFacultyGuide,
    updateFacultyGuide,
    deleteFacultyGuide,
    resetProjectCredits,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'project' | 'hod' | 'contributors' | 'faculty'>('contributors');

  // Form states
  const [projectTitle, setProjectTitle] = useState(projectCredits.projectTitle);
  const [institutionName, setInstitutionName] = useState(projectCredits.institutionName);
  const [departmentName, setDepartmentName] = useState(projectCredits.departmentName);
  const [academicYear, setAcademicYear] = useState(projectCredits.academicYear);
  const [acknowledgements, setAcknowledgements] = useState(projectCredits.acknowledgements);

  // HOD states
  const [hodName, setHodName] = useState(projectCredits.hod.name);
  const [hodTitle, setHodTitle] = useState(projectCredits.hod.title);
  const [hodDept, setHodDept] = useState(projectCredits.hod.department);
  const [hodEmail, setHodEmail] = useState(projectCredits.hod.email);
  const [hodAvatar, setHodAvatar] = useState(projectCredits.hod.avatar);
  const [hodMessage, setHodMessage] = useState(projectCredits.hod.message);

  // Contributor Form
  const [editingContribId, setEditingContribId] = useState<string | null>(null);
  const [cName, setCName] = useState('');
  const [cRoll, setCRoll] = useState('');
  const [cRole, setCRole] = useState('');
  const [cContribution, setCContribution] = useState('');
  const [cAvatar, setCAvatar] = useState('');
  const [cGithub, setCGithub] = useState('');
  const [cLinkedin, setCLinkedin] = useState('');
  const [cEmail, setCEmail] = useState('');

  // Faculty Guide Form
  const [fName, setFName] = useState('');
  const [fDesignation, setFDesignation] = useState('');
  const [fDept, setFDept] = useState('');
  const [fAvatar, setFAvatar] = useState('');

  useEffect(() => {
    if (initialSelectedContributor) {
      setActiveTab('contributors');
      loadContributorForEdit(initialSelectedContributor);
    }
  }, [initialSelectedContributor]);

  if (!isOpen) return null;

  const handleSaveProjectInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectCredits({
      projectTitle,
      institutionName,
      departmentName,
      academicYear,
      acknowledgements,
    });
  };

  const handleSaveHOD = (e: React.FormEvent) => {
    e.preventDefault();
    updateHODInfo({
      name: hodName,
      title: hodTitle,
      department: hodDept,
      email: hodEmail,
      avatar: hodAvatar,
      message: hodMessage,
    });
  };

  const loadContributorForEdit = (c: ProjectContributor) => {
    setEditingContribId(c.id);
    setCName(c.name);
    setCRoll(c.rollNo || '');
    setCRole(c.role);
    setCContribution(c.contribution);
    setCAvatar(c.avatar || '');
    setCGithub(c.github || '');
    setCLinkedin(c.linkedin || '');
    setCEmail(c.email || '');
  };

  const resetContributorForm = () => {
    setEditingContribId(null);
    setCName('');
    setCRoll('');
    setCRole('');
    setCContribution('');
    setCAvatar('');
    setCGithub('');
    setCLinkedin('');
    setCEmail('');
  };

  const handleSaveContributor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cRole.trim()) return;

    if (editingContribId) {
      updateContributor(editingContribId, {
        name: cName,
        rollNo: cRoll,
        role: cRole,
        contribution: cContribution,
        avatar: cAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        github: cGithub,
        linkedin: cLinkedin,
        email: cEmail,
      });
    } else {
      addContributor({
        name: cName,
        rollNo: cRoll,
        role: cRole,
        contribution: cContribution,
        avatar: cAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        github: cGithub,
        linkedin: cLinkedin,
        email: cEmail,
      });
    }
    resetContributorForm();
  };

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim() || !fDesignation.trim()) return;
    addFacultyGuide({
      name: fName,
      designation: fDesignation,
      department: fDept || departmentName,
      avatar: fAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    });
    setFName('');
    setFDesignation('');
    setFDept('');
    setFAvatar('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Crown className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Project Credits & Contributors
              </h2>
              <p className="text-xs text-slate-500">
                Owner administrative portal to modify HOD, guides, and student credits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 overflow-x-auto">
          <button
            onClick={() => setActiveTab('contributors')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'contributors'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Contributors ({projectCredits.contributors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hod')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'hod'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Head of Dept (HOD)</span>
          </button>

          <button
            onClick={() => setActiveTab('faculty')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'faculty'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Faculty Guides ({projectCredits.facultyGuides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('project')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'project'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Project Details</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CONTRIBUTORS */}
          {activeTab === 'contributors' && (
            <div className="space-y-6">
              {/* Form to add or edit contributor */}
              <form
                onSubmit={handleSaveContributor}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    {editingContribId ? <Edit2 className="w-3.5 h-3.5 text-indigo-500" /> : <UserPlus className="w-3.5 h-3.5 text-indigo-500" />}
                    <span>{editingContribId ? 'Edit Contributor Record' : 'Add New Contributor'}</span>
                  </h3>
                  {editingContribId && (
                    <button
                      type="button"
                      onClick={resetContributorForm}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Roll Number / Enrollment ID
                    </label>
                    <input
                      type="text"
                      value={cRoll}
                      onChange={(e) => setCRoll(e.target.value)}
                      placeholder="e.g. 21BCS042"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Role / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={cRole}
                      onChange={(e) => setCRole(e.target.value)}
                      placeholder="e.g. Lead Full-Stack Architect"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Avatar Image URL
                    </label>
                    <input
                      type="text"
                      value={cAvatar}
                      onChange={(e) => setCAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Key Contributions & Modules Built
                  </label>
                  <textarea
                    rows={2}
                    value={cContribution}
                    onChange={(e) => setCContribution(e.target.value)}
                    placeholder="Designed the real-time collaboration engine, interactive code runner sandbox, and core database schema."
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      GitHub URL or Username
                    </label>
                    <input
                      type="text"
                      value={cGithub}
                      onChange={(e) => setCGithub(e.target.value)}
                      placeholder="https://github.com/alex"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={cLinkedin}
                      onChange={(e) => setCLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/alex"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={cEmail}
                      onChange={(e) => setCEmail(e.target.value)}
                      placeholder="alex.rivera@campus.edu"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingContribId ? 'Update Contributor' : 'Add Contributor'}</span>
                  </button>
                </div>
              </form>

              {/* Current Contributors List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Contributors ({projectCredits.contributors.length})
                </h4>

                <div className="space-y-2">
                  {projectCredits.contributors.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={c.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {c.name}
                            </span>
                            {c.rollNo && (
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {c.rollNo}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                            {c.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => loadContributorForEdit(c)}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteContributor(c.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOD */}
          {activeTab === 'hod' && (
            <form onSubmit={handleSaveHOD} className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <p className="text-xs text-indigo-900 dark:text-indigo-200">
                  The Head of Department is featured at the top of the project credits section and in official academic submissions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    HOD Full Name & Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={hodName}
                    onChange={(e) => setHodName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={hodTitle}
                    onChange={(e) => setHodTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={hodDept}
                    onChange={(e) => setHodDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    value={hodEmail}
                    onChange={(e) => setHodEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="text"
                    value={hodAvatar}
                    onChange={(e) => setHodAvatar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    HOD Quote / Endorsement Message
                  </label>
                  <textarea
                    rows={3}
                    value={hodMessage}
                    onChange={(e) => setHodMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save HOD Details</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FACULTY GUIDES */}
          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddFaculty}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Add Faculty Guide / Mentor</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Faculty Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fName}
                      onChange={(e) => setFName(e.target.value)}
                      placeholder="e.g. Prof. Marcus Vance"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={fDesignation}
                      onChange={(e) => setFDesignation(e.target.value)}
                      placeholder="e.g. Associate Professor & Project Guide"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={fDept}
                      onChange={(e) => setFDept(e.target.value)}
                      placeholder="Department of Computer Science & Engineering"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Avatar URL
                    </label>
                    <input
                      type="text"
                      value={fAvatar}
                      onChange={(e) => setFAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Faculty Guide</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Configured Faculty Mentors ({projectCredits.facultyGuides.length})
                </h4>

                {projectCredits.facultyGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={guide.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                        alt={guide.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {guide.name}
                        </h5>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                          {guide.designation}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteFacultyGuide(guide.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECT DETAILS */}
          {activeTab === 'project' && (
            <form onSubmit={handleSaveProjectInfo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Session / Year
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Acknowledgements & Lab Credits
                  </label>
                  <textarea
                    rows={3}
                    value={acknowledgements}
                    onChange={(e) => setAcknowledgements(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={resetProjectCredits}
                  className="px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Campus Default</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project Details</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
