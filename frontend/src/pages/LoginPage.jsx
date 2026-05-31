import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Mail, MessageSquare, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    /* 1. Changed fixed background color to theme background token */
    <div className='min-h-screen bg-base-200 flex flex-col justify-center items-center p-4 antialiased'>
      
      {/* Outer elegant container */}
      {/* 2. Changed card background to bg-base-100 and borders to base theme borders */}
      <div className='w-full max-w-[440px] bg-base-100 border border-base-300 rounded-2xl shadow-md p-8 sm:p-10 transition-all duration-300'>
        
        {/* Logo & Header */}
        <div className='flex flex-col items-center mb-8 text-center'>
          {/* 3. Uses the theme's core primary branding colors */}
          <div className='w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content shadow-sm mb-4'>
            <MessageSquare className="w-5 h-5 stroke-[1.75]" />
          </div>
          {/* 4. Changed text color to use theme typography token */}
          <h1 className='text-xl font-semibold tracking-tight text-base-content'>Welcome Back</h1>
          <p className='text-sm opacity-70 mt-1.5'>Sign in to your account</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className='space-y-4'>

          {/* Email Input Box */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium opacity-80 tracking-wide uppercase'>
              Email
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
          {/* 5. Transformed to full DaisyUI theme action button */}
          <button 
            type='submit' 
            disabled={isLoggingIn}
            className='btn btn-primary w-full normal-case font-medium text-sm rounded-lg flex items-center justify-center gap-2 mt-4'
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Navigation Link */}
        <div className='text-center text-xs opacity-70 mt-6 border-t border-base-300 pt-5'>
          <p>
            Don't have an account?{' '}
            <Link to='/signup' className='font-medium text-primary hover:underline underline-offset-4 transition-all'>
              Create account
            </Link>
          </p>
        </div>
        
      </div>

      {/* Subtle bottom modern accent */}
      <span className="text-[11px] opacity-40 tracking-wide mt-6 font-mono">Protected by industry secure encryption standard</span>
    </div>
  )
}

export default LoginPage;