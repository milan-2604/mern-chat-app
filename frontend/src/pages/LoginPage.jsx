import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Mail, MessageSquare,Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {login, isLoggingIn} = useAuthStore();
  const handleSubmit = (e) =>{
    e.preventDefault();
    login(formData)
  }
  return (
    <div className='min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-4 antialiased selection:bg-neutral-200'>
      
      {/* Outer elegant container */}
      <div className='w-full max-w-[440px] bg-white border border-neutral-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)] p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]'>
        
        {/* Logo & Header */}
        <div className='flex flex-col items-center mb-8 text-center'>
          <div className='w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-sm mb-4'>
            <MessageSquare className="w-5 h-5 stroke-[1.75]" />
          </div>
          <h1 className='text-xl font-semibold tracking-tight text-neutral-950'>Welcome Back</h1>
          <p className='text-sm text-neutral-500 mt-1.5'>Sign in to your account</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className='space-y-4'>

          {/* Email Input Box */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-neutral-600 tracking-wide uppercase'>
              Email
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
            disabled={isLoggingIn}
            className='w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group mt-4'
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Navigation Link */}
        <div className='text-center text-xs text-neutral-500 mt-6 border-t border-neutral-100 pt-5'>
          <p>
            Dont have an account?{' '}
            <Link to='/signup' className='font-medium text-neutral-950 hover:underline underline-offset-4 transition-all'>
              Create account
            </Link>
          </p>
        </div>
        
      </div>

      {/* Subtle bottom modern accent */}
      <span className="text-[11px] text-neutral-400 tracking-wide mt-6 font-mono">Protected by industry secure encryption standard</span>
    </div>
  )
}

export default LoginPage
