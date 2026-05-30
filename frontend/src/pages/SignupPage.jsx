import React from 'react';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Mail, MessageSquare, User, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { isSigningUp, signup } = useAuthStore();

  const validateForm = () => { 
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className='min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-4 antialiased selection:bg-neutral-200'>
      
      {/* Outer elegant container */}
      <div className='w-full max-w-[440px] bg-white border border-neutral-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)] p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]'>
        
        {/* Logo & Header */}
        <div className='flex flex-col items-center mb-8 text-center'>
          <div className='w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-sm mb-4'>
            <MessageSquare className="w-5 h-5 stroke-[1.75]" />
          </div>
          <h1 className='text-xl font-semibold tracking-tight text-neutral-950'>Create your account</h1>
          <p className='text-sm text-neutral-500 mt-1.5'>Get started with your free profile workspace</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          
          {/* Full Name Input Box */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-neutral-600 tracking-wide uppercase'>
              Full Name
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-neutral-600 transition-colors'>
                <User className="w-4 h-4 stroke-[1.75]" />
              </div>
              <input
                type="text"
                className='w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200/80 rounded-lg text-sm text-neutral-900 transition-all duration-200 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100'
                placeholder='John Doe'
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          {/* Email Input Box */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-neutral-600 tracking-wide uppercase'>
              Email Address
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-neutral-600 transition-colors'>
                <Mail className="w-4 h-4 stroke-[1.75]" />
              </div>
              <input
                type="email"
                className='w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200/80 rounded-lg text-sm text-neutral-900 transition-all duration-200 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100'
                placeholder='you@example.com'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input Box */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-neutral-600 tracking-wide uppercase'>
              Password
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-neutral-600 transition-colors'>
                <Lock className="w-4 h-4 stroke-[1.75]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className='w-full pl-10 pr-11 py-2.5 bg-neutral-50/50 border border-neutral-200/80 rounded-lg text-sm text-neutral-900 transition-all duration-200 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100'
                placeholder='••••••••'
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type='button' 
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors'
              >
                {showPassword ? <EyeOff className="w-4 h-4 stroke-[1.75]" /> : <Eye className="w-4 h-4 stroke-[1.75]" />}
              </button>
            </div>
          </div>

          {/* Clean Action Button */}
          <button 
            type='submit' 
            disabled={isSigningUp}
            className='w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group mt-4'
          >
            {isSigningUp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                <span>Creating workspace...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Navigation Link */}
        <div className='text-center text-xs text-neutral-500 mt-6 border-t border-neutral-100 pt-5'>
          <p>
            Already have an account?{' '}
            <Link to='/login' className='font-medium text-neutral-950 hover:underline underline-offset-4 transition-all'>
              Sign in
            </Link>
          </p>
        </div>
        
      </div>

      {/* Subtle bottom modern accent */}
      <span className="text-[11px] text-neutral-400 tracking-wide mt-6 font-mono">Protected by industry secure encryption standard</span>
    </div>
  );
};

export default SignupPage;