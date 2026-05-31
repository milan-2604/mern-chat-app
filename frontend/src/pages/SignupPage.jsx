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
    /* 1. Changed bg-[#fafafa] to bg-base-200 */
    <div className='min-h-screen bg-base-200 flex flex-col justify-center items-center p-4 antialiased'>
      
      {/* Outer elegant container */}
      {/* 2. Changed bg-white to bg-base-100, and border-neutral-200 to border-base-300 */}
      <div className='w-full max-w-[440px] bg-base-100 border border-base-300 rounded-2xl shadow-md p-8 sm:p-10 transition-all duration-300'>
        
        {/* Logo & Header */}
        <div className='flex flex-col items-center mb-8 text-center'>
          {/* 3. Changed bg-neutral-900 to bg-primary (or keep neutral if you want an intentional dark accent) */}
          <div className='w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content shadow-sm mb-4'>
            <MessageSquare className="w-5 h-5 stroke-[1.75]" />
          </div>
          {/* 4. Changed text-neutral-950 to text-base-content */}
          <h1 className='text-xl font-semibold tracking-tight text-base-content'>Create your account</h1>
          <p className='text-sm opacity-70 mt-1.5'>Get started with your free profile workspace</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          
          {/* Full Name Input Box */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium opacity-80 tracking-wide uppercase'>
              Full Name
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity'>
                <User className="w-4 h-4 stroke-[1.75]" />
              </div>
              {/* 5. Replaced strict neutral input styling with a semantic DaisyUI style approach or cleaner base styling */}
              <input
                type="text"
                className='w-full pl-10 pr-4 py-2.5 bg-base-200/50 border border-base-300 rounded-lg text-sm text-base-content transition-all duration-200 placeholder:opacity-50 focus:outline-none focus:bg-base-100 focus:border-primary focus:ring-4 focus:ring-primary/10'
                placeholder='John Doe'
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          {/* Email Input Box */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium opacity-80 tracking-wide uppercase'>
              Email Address
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity'>
                <Mail className="w-4 h-4 stroke-[1.75]" />
              </div>
              <input
                type="email"
                className='w-full pl-10 pr-4 py-2.5 bg-base-200/50 border border-base-300 rounded-lg text-sm text-base-content transition-all duration-200 placeholder:opacity-50 focus:outline-none focus:bg-base-100 focus:border-primary focus:ring-4 focus:ring-primary/10'
                placeholder='you@example.com'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input Box */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium opacity-80 tracking-wide uppercase'>
              Password
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity'>
                <Lock className="w-4 h-4 stroke-[1.75]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className='w-full pl-10 pr-11 py-2.5 bg-base-200/50 border border-base-300 rounded-lg text-sm text-base-content transition-all duration-200 placeholder:opacity-50 focus:outline-none focus:bg-base-100 focus:border-primary focus:ring-4 focus:ring-primary/10'
                placeholder='••••••••'
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type='button' 
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 pr-3 flex items-center opacity-50 hover:opacity-100 transition-opacity'
              >
                {showPassword ? <EyeOff className="w-4 h-4 stroke-[1.75]" /> : <Eye className="w-4 h-4 stroke-[1.75]" />}
              </button>
            </div>
          </div>

          {/* Clean Action Button */}
          {/* 6. Transformed custom neutral button into a DaisyUI styled interactive element */}
          <button 
            type='submit' 
            disabled={isSigningUp}
            className='btn btn-primary w-full normal-case font-medium text-sm rounded-lg flex items-center justify-center gap-2 mt-4'
          >
            {isSigningUp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating workspace...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Navigation Link */}
        <div className='text-center text-xs opacity-70 mt-6 border-t border-base-300 pt-5'>
          <p>
            Already have an account?{' '}
            <Link to='/login' className='font-medium text-primary hover:underline underline-offset-4 transition-all'>
              Sign in
            </Link>
          </p>
        </div>
        
      </div>

      <span className="text-[11px] opacity-40 tracking-wide mt-6 font-mono">Protected by industry secure encryption standard</span>
    </div>
  );
};

export default SignupPage;