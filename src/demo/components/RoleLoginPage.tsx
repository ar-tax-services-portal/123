/**
 * A/R Tax Services, LLC - Role-Based Temporary Login Page
 * Enforces strict credentials validation without rendering credentials in DOM.
 * Includes show/hide password, rate-limiting lockout, and developer contact notice.
 */

import React, { useState, useEffect } from 'react';
import { DemoRole, DEMO_ROLES, DemoRoleConfig } from '../types';
import { DemoAuthService } from '../services/DemoAuthService';
import { DeveloperContactNotice } from './DeveloperContactNotice';
import { DemoBanner } from './DemoBanner';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

interface RoleLoginPageProps {
  role: DemoRole;
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const RoleLoginPage: React.FC<RoleLoginPageProps> = ({
  role,
  onSuccess,
  onNavigateHome
}) => {
  const roleConfig: DemoRoleConfig = DEMO_ROLES[role];

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check if already authenticated
  useEffect(() => {
    if (DemoAuthService.isAuthenticated(role)) {
      onSuccess();
    }
  }, [role, onSuccess]);

  // Periodic lockout timer countdown
  useEffect(() => {
    const checkLockout = () => {
      const remaining = DemoAuthService.getRemainingLockoutSeconds(role);
      setLockoutRemaining(remaining);
      if (remaining > 0 && !errorMessage) {
        setErrorMessage(`Account temporarily locked due to repeated failed attempts. Retry in ${remaining}s.`);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [role, errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginId.trim() || !password) {
      setErrorMessage('Please enter both Login ID and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await DemoAuthService.authenticate(role, loginId, password);

      if (result.success) {
        setPassword('');
        onSuccess();
      } else {
        // Clear password field upon failure per requirements
        setPassword('');
        setErrorMessage(result.error || 'Invalid Login ID or password.');
        const remaining = DemoAuthService.getRemainingLockoutSeconds(role);
        setLockoutRemaining(remaining);
      }
    } catch {
      setPassword('');
      setErrorMessage('Unexpected authentication failure. Please contact developer support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans antialiased selection:bg-black selection:text-white">
      {/* Persistent Demo Banner */}
      <DemoBanner />

      {/* Navigation Return Header */}
      <div className="border-b border-neutral-300 px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        <div className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500">
          A/R Tax Services, LLC • {roleConfig.department}
        </div>
      </div>

      {/* Main Login Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md border border-neutral-300 bg-white p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5 border-b border-neutral-200 pb-4">
            <div className="inline-flex p-2 border border-black mb-1">
              <Lock className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-base font-bold uppercase tracking-tight text-black">
              {roleConfig.title} Sign In
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {roleConfig.description}
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div 
              className="border border-black bg-white p-3 text-xs text-black space-y-2"
              role="alert"
            >
              <div className="flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
              
              {/* Show developer contact notice on authentication error/lockout */}
              <DeveloperContactNotice reason="Authentication / Access Verification Assistance" />
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login ID Input */}
            <div className="space-y-1">
              <label 
                htmlFor="demo-login-id" 
                className="block text-xs font-bold uppercase tracking-wider text-black"
              >
                Login ID
              </label>
              <input
                id="demo-login-id"
                name="username"
                type="text"
                autoComplete="username"
                disabled={lockoutRemaining > 0 || isSubmitting}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 text-sm border border-neutral-300 bg-white text-black focus:outline-none focus:border-black disabled:bg-neutral-100 disabled:cursor-not-allowed rounded-none"
              />
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div className="space-y-1">
              <label 
                htmlFor="demo-password" 
                className="block text-xs font-bold uppercase tracking-wider text-black"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="demo-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={lockoutRemaining > 0 || isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full px-3 py-2 pr-10 text-sm border border-neutral-300 bg-white text-black focus:outline-none focus:border-black disabled:bg-neutral-100 disabled:cursor-not-allowed rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Security Assurance Line */}
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span>Isolated demonstration session token issued upon authentication.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={lockoutRemaining > 0 || isSubmitting}
              className="w-full py-2.5 px-4 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors rounded-none"
            >
              {isSubmitting ? 'Authenticating...' : lockoutRemaining > 0 ? `Locked (${lockoutRemaining}s)` : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Demonstration Architecture Footer */}
          <div className="pt-2 border-t border-neutral-200 text-center text-[11px] text-neutral-500 space-y-1">
            <div>
              Protected Endpoint: <span className="font-mono text-black">{roleConfig.dashboardPath}</span>
            </div>
            <div>
              Rate limiting: 5 consecutive attempts permitted before 60s temporary lockout.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
