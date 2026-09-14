import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { updateUserProfileAvatarInFirestore } from '../../lib/firestoreService';
import {
  Camera,
  Upload,
  Sparkles,
  Link,
  Check,
  X,
  RefreshCw,
  Image as ImageIcon,
  User,
  ShieldCheck,
  Palette,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_AVATARS = [
  { id: 'p1', label: 'Developer', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250' },
  { id: 'p2', label: 'Tech Lead', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
  { id: 'p3', label: 'Cloud Architect', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250' },
  { id: 'p4', label: 'Cybersecurity', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
  { id: 'p5', label: 'AI Researcher', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
  { id: 'p6', label: 'Full Stack', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250' },
  { id: 'p7', label: 'UI/UX Designer', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250' },
  { id: 'p8', label: 'Data Scientist', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250' },
  { id: 'p9', label: 'Security Analyst', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250' },
  { id: 'p10', label: 'Code Enthusiast', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250' },
  { id: 'p11', label: 'Robotics Engineer', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250' },
  { id: 'p12', label: 'Software Engineer', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250' },
];

const DICEBEAR_STYLES = [
  { id: 'bottts', name: 'Bottts (Robots)' },
  { id: 'adventurer', name: 'Adventurer' },
  { id: 'lorelei', name: 'Lorelei (Modern)' },
  { id: 'fun-emoji', name: 'Emoji Art' },
  { id: 'personas', name: 'Personas' },
  { id: 'micah', name: 'Micah (Minimal)' },
];

export const AvatarUpdateModal: React.FC = () => {
  const { user, updateAvatar, firebaseUser } = useAuth();
  const {
    isAvatarModalOpen,
    closeAvatarModal,
    avatarModalTarget,
    showToast,
    projectCredits,
    updateContributor,
    updateHODInfo,
    updateFacultyGuide,
  } = useApp();

  const isContributorTarget = avatarModalTarget?.type === 'contributor';
  const isHODTarget = avatarModalTarget?.type === 'hod';
  const isFacultyTarget = avatarModalTarget?.type === 'faculty';
  const targetName = avatarModalTarget?.name || user.name || 'User';
  const targetCurrentAvatar =
    avatarModalTarget?.currentAvatar ||
    (isHODTarget
      ? projectCredits.hod.avatar
      : isContributorTarget
      ? projectCredits.contributors.find((c) => c.id === avatarModalTarget?.id)?.avatar
      : user.avatar);

  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'dicebear' | 'url'>('presets');
  const [selectedPreview, setSelectedPreview] = useState<string>(targetCurrentAvatar || user.avatar);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [dicebearStyle, setDicebearStyle] = useState<string>('bottts');
  const [dicebearSeed, setDicebearSeed] = useState<string>(targetName || 'StudentProfile');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial state whenever modal opens or target changes
  React.useEffect(() => {
    if (avatarModalTarget) {
      setSelectedPreview(targetCurrentAvatar || user.avatar);
      setDicebearSeed(avatarModalTarget.name || user.name);
    } else {
      setSelectedPreview(user.avatar);
      setDicebearSeed(user.name || 'StudentProfile');
    }
  }, [avatarModalTarget, isAvatarModalOpen, targetCurrentAvatar, user.avatar, user.name]);

  if (!isAvatarModalOpen) return null;

  // File Upload to DataURL
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file too large. Max size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Optimize and compress via Canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setSelectedPreview(compressed);
            showToast('Image loaded and optimized for avatar');
          } else {
            setSelectedPreview(result);
          }
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const generateDicebearUrl = (style: string, seed: string) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  };

  const randomizeDicebearSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 9);
    setDicebearSeed(randomSeed);
    setSelectedPreview(generateDicebearUrl(dicebearStyle, randomSeed));
  };

  const handleApplyDicebear = (style: string) => {
    setDicebearStyle(style);
    const url = generateDicebearUrl(style, dicebearSeed);
    setSelectedPreview(url);
  };

  const handleSaveAvatar = async () => {
    if (!selectedPreview) {
      showToast('Please select or upload a profile picture.');
      return;
    }

    setIsProcessing(true);
    try {
      if (isContributorTarget && avatarModalTarget?.id) {
        // Update Contributor in Credits
        updateContributor(avatarModalTarget.id, { avatar: selectedPreview });
        showToast(`Updated profile photo for contributor: ${targetName}`);
      } else if (isHODTarget) {
        // Update Head of Department in Credits
        updateHODInfo({ avatar: selectedPreview });
        showToast(`Updated photo for Head of Department: ${targetName}`);
      } else if (isFacultyTarget && avatarModalTarget?.id) {
        // Update Faculty Mentor in Credits
        updateFacultyGuide(avatarModalTarget.id, { avatar: selectedPreview });
        showToast(`Updated photo for faculty mentor: ${targetName}`);
      } else {
        // Standard User Profile Update
        updateAvatar(selectedPreview);

        if (firebaseUser?.uid) {
          await updateUserProfileAvatarInFirestore(firebaseUser.uid, selectedPreview);
        }

        // Sync contributor if matches current user
        const matchingContrib = projectCredits.contributors.find(
          (c) =>
            (c.name && user?.name && c.name.toLowerCase() === user.name.toLowerCase()) ||
            (c.rollNo && user?.btId && c.rollNo === user.btId)
        );
        if (matchingContrib) {
          updateContributor(matchingContrib.id, { avatar: selectedPreview });
        }

        try {
          await fetch('/api/users/profile/avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id || firebaseUser?.uid, avatarUrl: selectedPreview }),
          });
        } catch {
          // Backend offline fallback
        }

        showToast('Profile picture updated successfully everywhere!');
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      closeAvatarModal();
    } catch (err) {
      console.error('Error saving avatar:', err);
      showToast('Profile picture updated locally');
      closeAvatarModal();
    } finally {
      setIsProcessing(false);
    }
  };

  const modalTitle = isContributorTarget
    ? `Update Contributor Photo: ${targetName}`
    : isHODTarget
    ? `Update HOD Photo: ${targetName}`
    : isFacultyTarget
    ? `Update Faculty Photo: ${targetName}`
    : 'Update Profile Picture';

  const modalSubtitle = isContributorTarget || isHODTarget || isFacultyTarget
    ? 'Choose a photo from preset gallery, upload an image file, generate an AI avatar, or paste a link'
    : 'Choose a photo, preset, custom avatar, or link for your profile';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {modalTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {modalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={closeAvatarModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Hero */}
        <div className="p-6 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-5 text-center sm:text-left">
          <div className="relative group">
            <img
              src={selectedPreview}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg ring-2 ring-indigo-500"
              onError={(e) => {
                // Fallback if URL fails
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250';
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{targetName}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                {isContributorTarget
                  ? (avatarModalTarget?.role || 'Project Contributor')
                  : isHODTarget
                  ? 'Head of Department'
                  : isFacultyTarget
                  ? 'Faculty Guide'
                  : (user.role === 'student' ? 'Student' : 'Alumni')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {isContributorTarget
                ? (projectCredits.contributors.find((c) => c.id === avatarModalTarget?.id)?.rollNo || 'Contributor')
                : isHODTarget
                ? projectCredits.hod.designation
                : user.btId}
            </p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              Live Preview • Instant Cloud Sync
            </p>
          </div>
        </div>

        {/* Navigation Modes */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preset Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('dicebear');
              setSelectedPreview(generateDicebearUrl(dicebearStyle, dicebearSeed));
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'dicebear'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>AI Avatar Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Image URL</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Tab 1: Presets Gallery */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any character portrait to set as your primary profile photo:
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = selectedPreview === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPreview(preset.url)}
                      className={`relative group rounded-2xl p-1 transition-all border ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-950/40'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full aspect-square rounded-xl object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-0.5 shadow-xs">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <span className="block text-[9px] font-semibold text-center text-slate-600 dark:text-slate-300 mt-1 truncate">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to browse or drag and drop image here
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Supports PNG, JPG, GIF, WebP (Max 5MB) • Auto-optimized
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: AI / DiceBear Generator */}
          {activeTab === 'dicebear' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Visual Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DICEBEAR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleApplyDicebear(style.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        dicebearStyle === style.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Avatar Seed / Identity Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dicebearSeed}
                    onChange={(e) => {
                      setDicebearSeed(e.target.value);
                      setSelectedPreview(generateDicebearUrl(dicebearStyle, e.target.value));
                    }}
                    placeholder="e.g. CyberNinja, Neo, Aarav"
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={randomizeDicebearSeed}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Shuffle</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Direct URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Direct Web Image Link (HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/my-profile-pic.jpg"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrl.trim()) {
                        setSelectedPreview(customUrl.trim());
                        showToast('Preview loaded from URL');
                      }
                    }}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Preview
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ensure the image link is publicly accessible (e.g., Unsplash, GitHub avatar, Imgur).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={closeAvatarModal}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSaveAvatar}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Applying Photo...'
                : isContributorTarget || isHODTarget || isFacultyTarget
                ? 'Update Section Photo'
                : 'Set as Profile Picture'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
