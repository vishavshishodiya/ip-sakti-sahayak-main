import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Eye,
  EyeOff,
  Languages
} from 'lucide-react';
import { AuthUser, AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AuthPortalProps {
  onAuthSuccess: (user: AuthUser, token?: string) => void;
  onContinueAsGuest?: () => void;
  language: AppLanguage;
  onToggleLanguage: (lang: AppLanguage) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  onAuthSuccess,
  onContinueAsGuest,
  language,
  onToggleLanguage
}) => {
  const t = TRANSLATIONS[language].auth;
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP step state
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Email format validator
  const isValidEmailFormat = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSendOtp = async (purpose: 'register' | 'login') => {
    setStatusMessage(null);
    setDevOtpCode(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setStatusMessage({
        text: language === 'hi' ? 'कृपया अपना ईमेल पता दर्ज करें।' : 'Please enter your email address.',
        type: 'error'
      });
      return;
    }

    if (!isValidEmailFormat(cleanEmail)) {
      setStatusMessage({
        text: language === 'hi' ? 'कृपया एक मान्य ईमेल पता दर्ज करें (उदा. name@example.com)।' : 'Please enter a valid email address (e.g. name@example.com).',
        type: 'error'
      });
      return;
    }

    if (purpose === 'register' && !fullName.trim()) {
      setStatusMessage({
        text: language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.',
        type: 'error'
      });
      return;
    }

    if (purpose === 'register' && password.length < 6) {
      setStatusMessage({
        text: language === 'hi' ? 'कृपया कम से कम ६ अक्षरों का पासवर्ड चुनें।' : 'Please choose a password with at least 6 characters.',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          purpose,
          fullName: fullName.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || (language === 'hi' ? 'सत्यापन कोड भेजने में विफल।' : 'Failed to send verification code.'));
      }

      setOtpStep(true);
      setOtp('');
      if (data.devOtp) {
        setDevOtpCode(data.devOtp);
      }

      setStatusMessage({
        text: data.realEmailSent
          ? (language === 'hi' ? `सत्यापन ओटीपी ${cleanEmail} पर भेज दिया गया है। कृपया अपना इनबॉक्स देखें।` : `Verification OTP sent to ${cleanEmail}. Please check your inbox.`)
          : (language === 'hi' ? `${cleanEmail} के लिए सत्यापन कोड तैयार हुआ।` : (data.message || `Verification code generated for ${cleanEmail}.`)),
        type: 'success'
      });

      // Start 60-second resend cooldown
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setStatusMessage({ text: err.message || (language === 'hi' ? 'त्रुटि उत्पन्न हुई।' : 'An error occurred.'), type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    setStatusMessage(null);
    if (!otp.trim() || otp.trim().length !== 6) {
      setStatusMessage({
        text: language === 'hi' ? 'कृपया पूर्ण ६-अंकों का ओटीपी दर्ज करें।' : 'Please enter the complete 6-digit OTP code.',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = mode === 'register' ? '/api/auth/verify-otp-and-register' : '/api/auth/verify-otp-and-login';
      const payload = mode === 'register'
        ? { email: email.trim(), otp: otp.trim(), fullName: fullName.trim(), password }
        : { email: email.trim(), otp: otp.trim() };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || (language === 'hi' ? 'सत्यापन विफल हुआ। पुनः प्रयास करें।' : 'Verification failed. Please try again.'));
      }

      setStatusMessage({
        text: language === 'hi' ? 'सत्यापन सफल! प्रवेश कराया जा रहा है...' : 'Verification successful! Logging you in...',
        type: 'success'
      });
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 700);
    } catch (err: any) {
      setStatusMessage({ text: err.message || (language === 'hi' ? 'सत्यापन विफल।' : 'Verification failed.'), type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !isValidEmailFormat(cleanEmail)) {
      setStatusMessage({
        text: language === 'hi' ? 'कृपया एक मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.',
        type: 'error'
      });
      return;
    }

    if (!password) {
      setStatusMessage({
        text: language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || (language === 'hi' ? 'लॉगिन विफल। कृपया अपने क्रेडेंशियल जांचें।' : 'Login failed. Please check your credentials.'));
      }

      setStatusMessage({
        text: language === 'hi' ? `नमस्ते, ${data.user.fullName}! पोर्टल में प्रवेश...` : `Namaste, ${data.user.fullName}! Entering portal...`,
        type: 'success'
      });
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 600);
    } catch (err: any) {
      setStatusMessage({ text: err.message || (language === 'hi' ? 'लॉगिन विफल।' : 'Login failed.'), type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f5fbf6] via-[#eff5f0] to-[#f5fbf6] relative overflow-hidden">
      {/* Subtle Botanical Mandala Watermark Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
        <svg className="w-[900px] h-[900px] text-[#042e1e]" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" fill="none" r="90" stroke="currentColor" strokeDasharray="2 3" strokeWidth="0.75" />
          <circle cx="100" cy="100" fill="none" r="68" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100 10 C120 50 150 80 190 100 C150 120 120 150 100 190 C80 150 50 120 10 100 C50 80 80 50 100 10 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Language Toggle in Top Corner */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full p-1 border border-[#c1c8c2]/40 shadow-sm">
          <Languages className="w-4 h-4 text-[#845400] ml-2 mr-1" />
          <button
            type="button"
            onClick={() => onToggleLanguage('en')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-[#042e1e] text-white shadow-sm'
                : 'text-[#414844] hover:text-[#042e1e]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onToggleLanguage('hi')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              language === 'hi'
                ? 'bg-[#042e1e] text-white shadow-sm'
                : 'text-[#414844] hover:text-[#042e1e]'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <img
              alt="IP-SAKTI Sahayak Emblem"
              className="h-12 w-12 object-contain rounded-full shadow-md border border-[#ffb958]/50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1wnUFVomatJXGkqpJLnstW0Bgunc3lSIOg8a1PjUrgL9_6reaG2-1aCsJz3U-F_Wl_3rI156WSzfNLeWfrSCu9FIMmo7wcoYaxfVpmQ--rA-R0wPWj9ZbsmTQkiBGTzLsOQTX8jS3B6DFWnU1NsCu4FElsCgFx5eJSA76lvJ_SsGkmgFz0yPyBrOZzsEPbdrmawHwvSD_Bf32up28vzRR-JTlaqvc84ujfSuK-iXSryRdhZlXn9hT"
            />
            <h1 className="font-serif text-3xl font-bold text-[#042e1e] tracking-tight">
              IP-SAKTI Sahayak
            </h1>
          </div>
          <p className="text-sm font-medium text-[#845400]">
            {t.subtitle}
          </p>
          <p className="text-xs text-[#717973] mt-1">
            {language === 'hi'
              ? 'प्रवेश हेतु सत्यापित ईमेल से साइन इन अथवा पंजीकरण करें।'
              : 'Please sign in or register with a verified email to enter.'}
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#c1c8c2]/40 overflow-hidden relative">
          {/* Top Gold Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#845400] via-[#ffb958] to-[#042e1e]" />

          {/* Mode Switch Tabs */}
          {!otpStep && (
            <div className="flex border-b border-[#c1c8c2]/30 bg-[#eff5f0]/60">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setStatusMessage(null);
                }}
                className={`flex-1 py-3.5 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all ${
                  mode === 'register'
                    ? 'bg-white text-[#042e1e] border-b-2 border-[#845400] shadow-sm'
                    : 'text-[#717973] hover:text-[#171d1a]'
                }`}
              >
                {t.registerTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setStatusMessage(null);
                }}
                className={`flex-1 py-3.5 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all ${
                  mode === 'login'
                    ? 'bg-white text-[#042e1e] border-b-2 border-[#845400] shadow-sm'
                    : 'text-[#717973] hover:text-[#171d1a]'
                }`}
              >
                {t.loginTab}
              </button>
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Status Alert */}
            {statusMessage && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                  statusMessage.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-[#eff5f0] text-[#042e1e] border border-[#c1c8c2]/40'
                }`}
              >
                {statusMessage.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed font-medium">{statusMessage.text}</span>
              </div>
            )}

            {/* Dev Mode OTP Quick Preview Box */}
            {devOtpCode && (
              <div className="mb-5 p-3.5 bg-[#eff5f0] rounded-xl border border-[#ffb958]/60 text-xs">
                <div className="flex items-center justify-between font-bold text-[#845400] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {language === 'hi' ? 'सत्यापन कोड (ओटीपी)' : 'Verification Code (OTP)'}
                  </span>
                  <span className="font-mono text-sm tracking-widest bg-white px-2 py-0.5 rounded border border-[#ffb958]/50 text-[#042e1e]">
                    {devOtpCode}
                  </span>
                </div>
                <p className="text-[11px] text-[#414844] mt-1">
                  {language === 'hi'
                    ? 'अपने ईमेल के सत्यापन हेतु नीचे यह ६-अंकों का कोड दर्ज करें।'
                    : 'Enter this 6-digit code below to verify your email. (When SMTP credentials are set in environment, OTP arrives in your inbox).'}
                </p>
              </div>
            )}

            {/* OTP VERIFICATION VIEW */}
            {otpStep ? (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#eff5f0] text-[#845400] flex items-center justify-center mx-auto mb-3 border border-[#c1c8c2]/40">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#042e1e]">
                    {t.enterOtpTitle}
                  </h3>
                  <p className="text-xs text-[#414844] mt-1">
                    {t.enterOtpSubtitle}
                  </p>
                  <p className="text-xs font-bold text-[#042e1e] mt-0.5 bg-[#eff5f0] py-1 px-3 rounded-md inline-block">
                    {email}
                  </p>
                </div>

                <div>
                  <label htmlFor="otp-input" className="block text-xs font-bold text-[#042e1e] uppercase tracking-wider mb-2 text-center">
                    {language === 'hi' ? '६-अंकों का कोड दर्ज करें' : 'Enter 6-Digit Code'}
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    autoFocus
                    className="w-full text-center tracking-[0.4em] font-mono text-2xl font-bold py-3 px-4 bg-[#f5fbf6] rounded-xl border border-[#c1c8c2]/50 focus:outline-none focus:ring-2 focus:ring-[#845400] text-[#042e1e]"
                  />
                  <p className="text-[11px] text-center text-[#717973] mt-2">
                    {language === 'hi' ? '१० मिनट के लिए मान्य।' : 'Valid for 10 minutes.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting || otp.length !== 6}
                    onClick={handleVerifyAndRegister}
                    className="w-full py-3.5 px-4 bg-[#845400] hover:bg-[#744900] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm shadow-[0_4px_14px_rgba(132,84,0,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>{language === 'hi' ? 'कोड सत्यापित हो रहा है...' : 'Verifying Code...'}</span>
                    ) : (
                      <>
                        <span>{t.verifyBtn}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isSubmitting}
                      onClick={() => handleSendOtp(mode)}
                      className="text-[#845400] hover:underline font-semibold disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>
                        {resendCooldown > 0
                          ? (language === 'hi' ? `${resendCooldown}s में पुनः भेजें` : `Resend OTP in ${resendCooldown}s`)
                          : t.resendOtp}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep(false);
                        setStatusMessage(null);
                        setDevOtpCode(null);
                      }}
                      className="text-[#717973] hover:text-[#171d1a]"
                    >
                      {t.changeEmail}
                    </button>
                  </div>
                </div>
              </div>
            ) : mode === 'register' ? (
              /* REGISTRATION FORM (EMAIL + OTP DISPATCH) */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendOtp('register');
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="reg-fullname" className="block text-xs font-bold text-[#042e1e] uppercase tracking-wider mb-1.5">
                    {t.fullNameLabel}
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-[#845400]" />
                    <input
                      id="reg-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={language === 'hi' ? 'उदा. वैद्य रमन शर्मा' : 'e.g. Vaidya Raman Sharma'}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#f5fbf6] rounded-xl border border-[#c1c8c2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#845400] text-[#171d1a]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-bold text-[#042e1e] uppercase tracking-wider mb-1.5">
                    {t.emailLabel} <span className="text-[#845400]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-[#845400]" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.name@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#f5fbf6] rounded-xl border border-[#c1c8c2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#845400] text-[#171d1a]"
                    />
                  </div>
                  <p className="text-[11px] text-[#717973] mt-1">
                    {t.otpHelp}
                  </p>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-xs font-bold text-[#042e1e] uppercase tracking-wider mb-1.5">
                    {t.passwordLabel}
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-[#845400]" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={language === 'hi' ? 'कम से कम ६ अक्षर' : 'At least 6 characters'}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#f5fbf6] rounded-xl border border-[#c1c8c2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#845400] text-[#171d1a]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#717973] hover:text-[#171d1a]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-[#845400] hover:bg-[#744900] disabled:opacity-60 text-white rounded-xl font-semibold text-sm shadow-[0_4px_14px_rgba(132,84,0,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>{language === 'hi' ? 'सत्यापन कोड भेजा जा रहा है...' : 'Sending Verification Code...'}</span>
                    ) : (
                      <>
                        <span>{t.sendOtpBtn}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-[#717973] justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#845400]" />
                  <span>{language === 'hi' ? 'सत्यापन प्रामाणिक संहिता अनुसंधान की सुरक्षा सुनिश्चित करता है' : 'Real verification ensures strict access to canonical texts'}</span>
                </div>
              </form>
            ) : (
              /* LOGIN FORM */
              <div className="space-y-4">
                {/* Method selector: Password vs OTP */}
                <div className="flex items-center justify-center gap-2 mb-2 p-1 bg-[#eff5f0] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      loginMethod === 'password'
                        ? 'bg-white text-[#042e1e] shadow-sm'
                        : 'text-[#717973] hover:text-[#171d1a]'
                    }`}
                  >
                    {t.passwordSignIn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      loginMethod === 'otp'
                        ? 'bg-white text-[#042e1e] shadow-sm'
                        : 'text-[#717973] hover:text-[#171d1a]'
                    }`}
                  >
                    {t.otpSignIn}
                  </button>
                </div>

                {loginMethod === 'password' ? (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <label htmlFor="login-email" className="block text-xs font-bold text-[#042e1e] uppercase tracking-wider mb-1.5">
                        {t.emailLabel}
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 w-4 h-4 text-[#845400]" />
                        <input
                          id="login-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@gmail.com"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-[#f5fbf6] rounded-xl border border-[#c1c8c2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#845400] text-[#171d1a]"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-password" className="block text-xs font-bold text-[#042e1e] uppercase tracking-wider mb-1.5">
                        {t.passwordLabel}
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 w-4 h-4 text-[#845400]" />
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-[#f5fbf6] rounded-xl border border-[#c1c8c2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#845400] text-[#171d1a]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-[#717973] hover:text-[#171d1a]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 bg-[#042e1e] hover:bg-[#1e4433] disabled:opacity-60 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <span>{language === 'hi' ? 'प्रमाणीकरण हो रहा है...' : 'Authenticating...'}</span>
                        ) : (
                          <>
                            <span>{t.loginBtn}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Pre-filled demo credentials tip */}
                    <div className="pt-2 p-2.5 bg-[#eff5f0] rounded-xl border border-[#c1c8c2]/30 text-[11px] text-[#414844]">
                      <span className="font-bold text-[#042e1e] block mb-0.5">
                        {language === 'hi' ? 'डेमो क्रेडेंशियल्स:' : 'Quick Demo Credentials:'}
                      </span>
                      <div className="flex items-center justify-between">
                        <span>vaidya.acharya@ipsakti.ai</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail('vaidya.acharya@ipsakti.ai');
                            setPassword('Ayurveda@2026');
                          }}
                          className="text-[#845400] font-bold hover:underline"
                        >
                          {language === 'hi' ? 'डेमो भरें' : 'Fill Demo'}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* LOGIN VIA OTP */
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendOtp('login');
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="login-otp-email" className="block text-xs font-bold text-[#042e1e] uppercase tracking-wider mb-1.5">
                        {language === 'hi' ? 'पंजीकृत ईमेल पता' : 'Registered Email Address'}
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 w-4 h-4 text-[#845400]" />
                        <input
                          id="login-otp-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.registered.email@gmail.com"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-[#f5fbf6] rounded-xl border border-[#c1c8c2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#845400] text-[#171d1a]"
                        />
                      </div>
                      <p className="text-[11px] text-[#717973] mt-1">
                        {language === 'hi'
                          ? 'हम आपके पंजीकृत ईमेल पर एक बार उपयोग होने वाला लॉगिन कोड भेजेंगे।'
                          : 'We will send a one-time login code to your registered email.'}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 bg-[#845400] hover:bg-[#744900] disabled:opacity-60 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <span>{language === 'hi' ? 'कोड भेजा जा रहा है...' : 'Sending Code...'}</span>
                        ) : (
                          <>
                            <span>{language === 'hi' ? 'लॉगिन कोड (ओटीपी) भेजें' : 'Send Login Code (OTP)'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Guest Vaidya Exploration Option */}
          {onContinueAsGuest && !otpStep && (
            <div className="p-4 bg-[#eff5f0]/80 border-t border-[#c1c8c2]/30 text-center">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs font-semibold text-[#845400] hover:text-[#744900] hover:underline"
              >
                {t.continueAsGuest}
              </button>
            </div>
          )}
        </div>

        {/* Footer Attribution */}
        <div className="text-center mt-6 text-xs text-[#717973]">
          {language === 'hi'
            ? 'बृहत्त्रयी संहिता ज्ञान • चरक | सुश्रुत | वाग्भट'
            : 'Brihat Trayi Codified Intelligence • Charaka | Sushruta | Vagbhata'}
        </div>
      </div>
    </div>
  );
};
