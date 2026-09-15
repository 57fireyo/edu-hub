import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { supabase } from '../../lib/supabase';
import {
  GraduationCap,
  Briefcase,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  RefreshCw,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ChevronLeft,
  Check,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, showToast } = useApp();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'register' | 'login' | 'verify'>('login');
  const [accountType, setAccountType] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [unverifiedNotice, setUnverifiedNotice] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('Alex Rivera');
  const [emailInput, setEmailInput] = useState('alex.rivera@eduhub.edu');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [btId, setBtId] = useState('BT22CS089');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('6th');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');
  const [rollNo, setRollNo] = useState('42');
  const [passoutYear, setPassoutYear] = useState('2023');

  // Verification code state
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingProfile, setPendingProfile] = useState<any>(null);

  // Listen for Supabase email confirmation redirect/auth changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (session.user.email_confirmed_at || (session.user as any).confirmed_at)) {
        if (mode === 'verify') {
          const profile = pendingProfile || {
            name,
            email: session.user.email || emailInput,
            btId: btId || (session.user.email || emailInput).split('@')[0].toUpperCase(),
            branch,
            semester,
            yearOfStudy,
            rollNo,
            passoutYear,
            role: accountType,
          };
          register(profile);
          setIsAuthModalOpen(false);
          showToast(`Email confirmed! Welcome to EduHub, ${profile.name}!`);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [mode, pendingProfile, name, emailInput, btId, branch, semester, yearOfStudy, rollNo, passoutYear, accountType]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);
    setUnverifiedNotice(null);

    try {
      // Supabase: For logging in existing users (Log In)
      const { data, error } = (await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      })) as any;

      if (error) {
        const errorMsg = error.message?.toLowerCase() || '';
        // Strict check: if email is not confirmed, block login completely!
        if (errorMsg.includes('confirm') || errorMsg.includes('not confirmed') || errorMsg.includes('verification')) {
          setUnverifiedNotice(
            `Your email (${emailInput}) has not been verified yet. We sent a verification email to your inbox. Please verify before signing in.`
          );
          setAuthError('Email verification required before logging in.');
          showToast('Please confirm your email address to log in.');
          setIsSubmitting(false);
          return;
        }

        console.warn('Supabase sign-in note:', error.message);
        setAuthError(error.message);
        showToast(error.message);
        setIsSubmitting(false);
        return;
      }

      // Check if user session returned but email is not verified
      const user = data?.user;
      const isEmailConfirmed = user?.email_confirmed_at || user?.confirmed_at;
      if (user && !isEmailConfirmed && user?.app_metadata?.provider === 'email') {
        setUnverifiedNotice(
          `Your email (${emailInput}) is not verified yet. Please check your inbox for the confirmation email.`
        );
        setAuthError('Please verify your email before logging in.');
        showToast('Email verification required.');
        setIsSubmitting(false);
        return;
      }

      showToast(`Welcome back, ${user?.email || emailInput}!`);
      login(emailInput.split('@')[0] || btId, accountType);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Supabase auth error:', err);
      setAuthError(err.message || 'Authentication error');
      showToast(err.message || 'Authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);
    setUnverifiedNotice(null);

    try {
      // 1. Send sign up request to Supabase to trigger confirmation email
      const { data, error } = (await supabase.auth.signUp({
        email: emailInput,
        password: passwordInput,
        options: {
          data: {
            name,
            btId: btId || emailInput.split('@')[0].toUpperCase(),
            role: accountType,
            branch,
            semester,
            yearOfStudy,
          },
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      })) as any;

      if (error) {
        console.warn('Supabase sign-up note:', error.message);
        setAuthError(error.message);
        showToast(error.message);
        setIsSubmitting(false);
        return;
      }

      // 2. Prepare pending profile object - DO NOT complete registration yet!
      const profileToSave = {
        name,
        email: emailInput,
        btId: btId || emailInput.split('@')[0].toUpperCase(),
        branch,
        semester,
        yearOfStudy,
        rollNo,
        passoutYear,
        role: accountType,
      };
      setPendingProfile(profileToSave);

      // 3. Check if user already confirmed or requires confirmation
      const isConfirmed = data?.user?.email_confirmed_at || data?.user?.confirmed_at;

      if (!isConfirmed) {
        // Enforce verification: switch view to verification screen
        setMode('verify');
        showToast(`Verification email sent to ${emailInput}! Please confirm to complete registration.`);
      } else {
        // Only if email is already verified by provider:
        register(profileToSave);
        setIsAuthModalOpen(false);
        showToast(`Account registered in Supabase for ${data?.user?.email || emailInput}!`);
      }
    } catch (err: any) {
      console.error('Supabase sign-up error:', err);
      setAuthError(err.message || 'Registration error');
      showToast(err.message || 'Registration error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setAuthError('Please enter the 6-digit confirmation code or OTP');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      // Try verifying with Supabase verifyOtp
      let verifyRes = await supabase.auth.verifyOtp({
        email: emailInput,
        token: verificationCode.trim(),
        type: 'signup',
      });

      if (verifyRes.error) {
        verifyRes = await supabase.auth.verifyOtp({
          email: emailInput,
          token: verificationCode.trim(),
          type: 'email',
        });
      }

      if (verifyRes.error) {
        throw verifyRes.error;
      }

      // Verification confirmed! Complete the registration now
      const profile = pendingProfile || {
        name,
        email: emailInput,
        btId: btId || emailInput.split('@')[0].toUpperCase(),
        branch,
        semester,
        yearOfStudy,
        rollNo,
        passoutYear,
        role: accountType,
      };

      register(profile);
      setIsAuthModalOpen(false);
      showToast(`Email confirmed successfully! Welcome to EduHub, ${profile.name}!`);
    } catch (err: any) {
      console.error('Verification error:', err);
      setAuthError(err.message || 'Invalid or expired confirmation code. Please check your inbox.');
      showToast(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCheckEmailLinkConfirmed = async () => {
    setIsVerifying(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });

      if (error) {
        const errorMsg = error.message?.toLowerCase() || '';
        if (errorMsg.includes('confirm') || errorMsg.includes('not confirmed')) {
          setAuthError('Email has not been confirmed yet. Please click the link sent to your email or enter the OTP.');
          showToast('Email not confirmed yet. Please check your inbox.');
        } else {
          setAuthError(error.message);
          showToast(error.message);
        }
        setIsVerifying(false);
        return;
      }

      // Successfully signed in with confirmed email
      const profile = pendingProfile || {
        name,
        email: emailInput,
        btId: btId || emailInput.split('@')[0].toUpperCase(),
        branch,
        semester,
        yearOfStudy,
        rollNo,
        passoutYear,
        role: accountType,
      };

      register(profile);
      setIsAuthModalOpen(false);
      showToast(`Email verified! Welcome to EduHub, ${profile.name}!`);
    } catch (err: any) {
      setAuthError(err.message || 'Could not verify confirmation status');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    setIsResending(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailInput,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });

      if (error) {
        throw error;
      }

      setResendSuccess(true);
      showToast(`Fresh verification email sent to ${emailInput}!`);
      setTimeout(() => setResendSuccess(false), 6000);
    } catch (err: any) {
      console.warn('Resend error:', err);
      setAuthError(err.message || 'Failed to resend confirmation email.');
      showToast(err.message || 'Could not resend email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-card"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Visual */}
        <div className="bg-indigo-600 dark:bg-indigo-700 px-6 pt-6 pb-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">EduHub Portal</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Supabase Auth
            </span>
          </div>
          <h2 className="text-xl font-bold">
            {mode === 'verify'
              ? 'Verify Your Email Address'
              : mode === 'login'
              ? 'Welcome Back to EduHub'
              : 'Join the Academic & Earning Network'}
          </h2>
          <p className="text-xs text-indigo-100 mt-0.5">
            {mode === 'verify'
              ? `Verification email sent to ${emailInput}. Confirm email to complete registration.`
              : mode === 'login'
              ? 'Sign in to access your dashboard, code sandbox, and freelance hub.'
              : 'Collaborate with peers, book alumni mentors, and land student freelance gigs.'}
          </p>
        </div>

        {/* Tab Switcher & Content */}
        <div className="p-6">
          {mode === 'verify' ? (
            /* Email Verification Mode */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthError(null);
                    setMode('register');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Sign Up</span>
                </button>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Step 2 of 2: Verify Email
                </span>
              </div>

              {/* Email Sent Notice Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Mail className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verification Email Dispatched
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    We sent an email verification link and 6-digit confirmation code to:
                  </p>
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 break-all font-mono">
                    {emailInput}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                    Registration will be finalized as soon as your email is verified.
                  </p>
                </div>
              </div>

              {/* Verification Code Form */}
              <form onSubmit={handleVerifyCode} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enter 6-digit Confirmation Code / Token
                  </label>
                  <div className="relative">
                    <input
                      id="verification-code-input"
                      type="text"
                      required
                      maxLength={10}
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full text-center tracking-[0.25em] font-mono font-bold text-base px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Check your email inbox or spam folder for the confirmation code.
                  </p>
                </div>

                {authError && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>{authError}</span>
                  </div>
                )}

                {resendSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Verification email resent! Please check your inbox.</span>
                  </div>
                )}

                <button
                  id="verify-code-btn"
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isVerifying ? 'Verifying with Supabase...' : 'Verify Code & Complete Registration'}</span>
                </button>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <button
                    id="check-link-confirmed-btn"
                    type="button"
                    onClick={handleCheckEmailLinkConfirmed}
                    disabled={isVerifying}
                    className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>I Clicked the Link in My Email — Check Status</span>
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleResendVerificationEmail}
                      disabled={isResending}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                      <span>{isResending ? 'Resending email...' : 'Resend Verification Email'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthError(null);
                        setMode('login');
                      }}
                      className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Already verified? Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Tab Switcher: Sign In vs Create Account */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 mb-5">
                <button
                  id="tab-btn-login"
                  type="button"
                  onClick={() => {
                    setAuthError(null);
                    setMode('login');
                  }}
                  className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    mode === 'login'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="tab-btn-register"
                  type="button"
                  onClick={() => {
                    setAuthError(null);
                    setMode('register');
                  }}
                  className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    mode === 'register'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

          {/* Role Toggle: Student vs Alumni */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5 border border-slate-200 dark:border-slate-700">
            <button
              id="role-toggle-student"
              type="button"
              onClick={() => setAccountType('student')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                accountType === 'student'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Current Student</span>
            </button>
            <button
              id="role-toggle-alumni"
              type="button"
              onClick={() => setAccountType('alumni')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                accountType === 'alumni'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Alumni / Mentor</span>
            </button>
          </div>

          {/* Sign In Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {unverifiedNotice && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-xs text-amber-800 dark:text-amber-200 space-y-2.5 animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-amber-900 dark:text-amber-100 block">
                        Email Confirmation Required
                      </span>
                      <p className="leading-relaxed">{unverifiedNotice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthError(null);
                        setMode('verify');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Verify Email Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResendVerificationEmail}
                      disabled={isResending}
                      className="px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 font-medium hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                      <span>{isResending ? 'Resending...' : 'Resend Email'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  placeholder="name@eduhub.edu or your-email@domain.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to registered email!')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
                  {authError}
                </div>
              )}

              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Authenticating with Supabase...' : 'Sign In to EduHub'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  login('BT22CS089', 'student');
                  setIsAuthModalOpen(false);
                  showToast('Signed in with Demo Student Account!');
                }}
                className="w-full py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors text-center"
              >
                ⚡ Fast Demo Sign In (1-Click)
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  id="reg-name-input"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Supabase Auth)
                </label>
                <input
                  id="reg-email-input"
                  type="email"
                  required
                  placeholder="name@eduhub.edu or your-email@domain.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  College ID (BT ID)
                </label>
                <input
                  id="reg-btid-input"
                  type="text"
                  required
                  placeholder="e.g. BT24CS101"
                  value={btId}
                  onChange={(e) => setBtId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {accountType === 'student' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Branch
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Computer Science & Engineering">CSE</option>
                      <option value="Electronics & Communication">ECE</option>
                      <option value="Mechanical Engineering">ME</option>
                      <option value="Civil Engineering">CE</option>
                      <option value="Information Technology">IT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="1st">1st Semester</option>
                      <option value="2nd">2nd Semester</option>
                      <option value="3rd">3rd Semester</option>
                      <option value="4th">4th Semester</option>
                      <option value="5th">5th Semester</option>
                      <option value="6th">6th Semester</option>
                      <option value="7th">7th Semester</option>
                      <option value="8th">8th Semester</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Year of Study
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Roll No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 42"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Graduation Branch
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Computer Science & Engineering">CSE</option>
                      <option value="Electronics & Communication">ECE</option>
                      <option value="Mechanical Engineering">ME</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Passout Year
                    </label>
                    <input
                      type="number"
                      min="1990"
                      max="2025"
                      value={passoutYear}
                      onChange={(e) => setPassoutYear(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
                  {authError}
                </div>
              )}

              <div className="pt-1">
                <button
                  id="reg-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Verification Email...' : 'Send Verification Email & Register'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                  A verification email will be sent to your inbox. You must confirm your email before your account is activated.
                </p>
              </div>
            </form>
          )}
        </>
      )}
    </div>
      </div>
    </div>
  );
};
