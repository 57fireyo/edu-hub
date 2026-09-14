import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Award,
  Users2,
  Github,
  Linkedin,
  Mail,
  Edit3,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Building2,
  BookOpen,
  Crown,
  CheckCircle2,
  ExternalLink,
  Code2,
  ShieldAlert,
  Gavel,
  RotateCcw,
  AlertTriangle,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { ProjectContributor, FacultyGuide } from '../../types';
import { CreditsEditorModal } from './CreditsEditorModal';

interface CreditsSectionProps {
  compact?: boolean;
  showOwnerEditButton?: boolean;
}

export const CreditsSection: React.FC<CreditsSectionProps> = ({
  compact = false,
  showOwnerEditButton = true,
}) => {
  const {
    projectCredits,
    isOwner,
    setIsSecretOwnerModalOpen,
    openBanModal,
    unbanContributorInCredits,
    openAvatarModal,
    showToast,
  } = useApp();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingContributor, setEditingContributor] = useState<ProjectContributor | null>(null);

  return (
    <div id="project-credits-section" className="space-y-6">
      {/* Institution Banner & Project Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border border-indigo-500/20 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                {projectCredits.academicYear}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Official Academic Major Project
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {projectCredits.projectTitle}
            </h2>

            <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
              <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{projectCredits.institutionName} • {projectCredits.departmentName}</span>
            </div>
          </div>

          {/* Owner Edit Action */}
          {showOwnerEditButton && (
            <div className="shrink-0 flex items-center gap-2">
              {isOwner ? (
                <button
                  onClick={() => setIsEditorOpen(true)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-98"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Project Credits</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsSecretOwnerModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-700/60 flex items-center gap-1.5 transition-all"
                  title="Owner login allows updating contributors, HOD, and faculty records"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Owner Edit Mode</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Head of Department (HOD) Spotlight */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Head of Department (HOD)
            </h3>
          </div>
          {isOwner && (
            <button
              onClick={() => setIsEditorOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit HOD</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group shrink-0">
            <img
              src={projectCredits.hod.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300'}
              alt={projectCredits.hod.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-sm"
            />
            <button
              type="button"
              onClick={() =>
                openAvatarModal({
                  type: 'hod',
                  name: projectCredits.hod.name,
                  currentAvatar: projectCredits.hod.avatar,
                  designation: projectCredits.hod.title,
                })
              }
              className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center text-white transition-all cursor-pointer backdrop-blur-xs p-1"
              title="Update Head of Department Profile Image"
            >
              <Camera className="w-5 h-5 text-amber-300" />
              <span className="text-[10px] font-bold mt-1">Change</span>
            </button>
            <span className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 text-white p-1 rounded-full ring-2 ring-white dark:ring-slate-900">
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {projectCredits.hod.name}
                </h4>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                  {projectCredits.hod.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  openAvatarModal({
                    type: 'hod',
                    name: projectCredits.hod.name,
                    currentAvatar: projectCredits.hod.avatar,
                    designation: projectCredits.hod.title,
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-200/60 dark:border-indigo-800/60"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Update Photo</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {projectCredits.hod.department} • <a href={`mailto:${projectCredits.hod.email}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{projectCredits.hod.email}</a>
            </p>

            {projectCredits.hod.message && (
              <blockquote className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border-l-2 border-indigo-500 mt-2">
                "{projectCredits.hod.message}"
              </blockquote>
            )}
          </div>
        </div>
      </div>

      {/* Faculty Guides & Mentors */}
      {projectCredits.facultyGuides && projectCredits.facultyGuides.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Faculty Project Guides & Mentors</span>
            </h3>
            {isOwner && (
              <button
                onClick={() => setIsEditorOpen(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Manage Faculty Guides</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projectCredits.facultyGuides.map((guide) => (
              <div
                key={guide.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-xs group"
              >
                <div className="relative shrink-0">
                  <img
                    src={guide.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                    alt={guide.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openAvatarModal({
                        type: 'faculty',
                        id: guide.id,
                        name: guide.name,
                        currentAvatar: guide.avatar,
                        designation: guide.designation,
                      })
                    }
                    className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-xs"
                    title="Change Mentor Photo"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {guide.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        openAvatarModal({
                          type: 'faculty',
                          id: guide.id,
                          name: guide.name,
                          currentAvatar: guide.avatar,
                          designation: guide.designation,
                        })
                      }
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 shrink-0 opacity-80 hover:opacity-100"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Photo</span>
                    </button>
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
                    {guide.designation}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {guide.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Project Contributors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Project Contributors & Core Developers</span>
            </h3>
            <p className="text-xs text-slate-500">
              The student engineers and designers who built and maintain EduHub.
            </p>
          </div>
          {isOwner && (
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Edit Contributor</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectCredits.contributors.map((contrib) => {
            const isBanned = contrib.isBanned || contrib.disciplinaryStatus === 'banned';
            return (
              <div
                key={contrib.id}
                className={`p-5 rounded-2xl transition-all shadow-xs flex flex-col justify-between space-y-4 ${
                  isBanned
                    ? 'bg-red-50/50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-800'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60'
                }`}
              >
                {/* Disciplinary Banner if banned */}
                {isBanned && (
                  <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/60 border border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 flex items-start gap-2 text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold flex items-center gap-1">
                        <span>CAMPUS DISCIPLINARY SANCTION</span>
                      </p>
                      <p className="text-[11px] text-red-700 dark:text-red-300">
                        {contrib.banReason || 'Academic misconduct penalty & active suspension enforced.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3.5">
                  <div className="relative group shrink-0">
                    <img
                      src={contrib.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={contrib.name}
                      className={`w-14 h-14 rounded-2xl object-cover border-2 ${
                        isBanned
                          ? 'border-red-500 ring-2 ring-red-400/40 grayscale'
                          : 'border-slate-100 dark:border-slate-800'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openAvatarModal({
                          type: 'contributor',
                          id: contrib.id,
                          name: contrib.name,
                          currentAvatar: contrib.avatar,
                          role: contrib.role,
                        })
                      }
                      className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-xs"
                      title="Update Contributor Photo"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                    {isBanned && (
                      <span className="absolute -bottom-1 -right-1 bg-red-600 text-white p-1 rounded-full text-[9px] font-black">
                        🚫
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold truncate ${isBanned ? 'text-red-900 dark:text-red-200 line-through' : 'text-slate-900 dark:text-white'}`}>
                        {contrib.name}
                      </h4>
                      {contrib.rollNo && (
                        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          isBanned
                            ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {contrib.rollNo}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs font-semibold ${isBanned ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                      {isBanned ? '⚠️ Permissions Suspended' : contrib.role}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {contrib.contribution}
                    </p>
                  </div>
                </div>

                {/* Social & Contact links + Owner Punish / Ban Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Update Photo Button */}
                    <button
                      type="button"
                      onClick={() =>
                        openAvatarModal({
                          type: 'contributor',
                          id: contrib.id,
                          name: contrib.name,
                          currentAvatar: contrib.avatar,
                          role: contrib.role,
                        })
                      }
                      className="p-1.5 sm:p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs transition-colors flex items-center gap-1 border border-indigo-200/50 dark:border-indigo-800/50"
                      title="Update Contributor Profile Photo"
                    >
                      <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-[10px] sm:text-[11px] font-semibold">Change Photo</span>
                    </button>

                    {contrib.github && (
                      <a
                        href={contrib.github.startsWith('http') ? contrib.github : `https://${contrib.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition-colors flex items-center gap-1"
                        title="GitHub Profile"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span className="text-[10px] sm:text-[11px] font-semibold">GitHub</span>
                      </a>
                    )}

                    {contrib.linkedin && (
                      <a
                        href={contrib.linkedin.startsWith('http') ? contrib.linkedin : `https://${contrib.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs transition-colors flex items-center gap-1"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span className="text-[10px] sm:text-[11px] font-semibold">LinkedIn</span>
                      </a>
                    )}

                    {contrib.email && (
                      <a
                        href={`mailto:${contrib.email}`}
                        className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Owner Controls: Ban / Reinstate / Edit */}
                  {isOwner && (
                    <div className="flex items-center gap-1.5">
                      {isBanned ? (
                        <button
                          type="button"
                          onClick={() => {
                            unbanContributorInCredits(contrib.id);
                            showToast(`Reinstated ${contrib.name} in Credits`);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          title="Revoke ban and reinstate this contributor"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Reinstate</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            openBanModal({
                              userId: contrib.id,
                              name: contrib.name,
                              btId: contrib.rollNo,
                              avatar: contrib.avatar,
                              branch: 'Project Contributor',
                              isContributor: true,
                              contributorId: contrib.id,
                            })
                          }
                          className="px-2.5 py-1.5 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-100 border border-red-300 dark:border-red-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          title="Issue punishment ban for this contributor"
                        >
                          <Gavel className="w-3.5 h-3.5 text-red-600" />
                          <span>Punish / Ban</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setEditingContributor(contrib);
                          setIsEditorOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acknowledgements Card */}
      {projectCredits.acknowledgements && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Acknowledgements & Institutional Support
          </p>
          <p className="leading-relaxed">{projectCredits.acknowledgements}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
            Last verified & updated: {projectCredits.lastUpdated}
          </p>
        </div>
      )}

      {/* Modal for Owner Editing */}
      {isEditorOpen && (
        <CreditsEditorModal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingContributor(null);
          }}
          initialSelectedContributor={editingContributor}
        />
      )}
    </div>
  );
};
