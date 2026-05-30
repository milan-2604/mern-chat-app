import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Mail, MessageSquare, User } from 'lucide-react';
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
    if(!formData.fullName.trim())return toast.error("Full name is required");
    if(!formData.email.trim())return toast.error("Email is required");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))return toast.error("Invalid email format");
    if(!formData.password)return toast.error("Password is required");
    if(formData.password.length<6)return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if(success===true) signup(formData);
  };
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div >
        <div>
          {/* logo */}
          <div>
            <div>
              <MessageSquare />
            </div>
            <h1>Create Account</h1>
            <p>Get started with your free account</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='form-control'>
            <label className='label'>
              <span className='lable-text font-medium'>Full Name</span>
            </label>
            <div className='relative'>
              <div>
                <User />
              </div>
              <input
               type="text"
               className=''
               placeholder='John Doe'
               value={formData.fullName}
               onChange={(e)=>setFormData({...formData,fullName:e.target.value})}
               />
            </div>
            </div>


            <div className='form-control'>
            <label className='label'>
              <span className='lable-text font-medium'>Email</span>
            </label>
            <div className='relative'>
              <div>
                <Mail />
              </div>
              <input
               type="email"
               className=''
               placeholder='you@example.com'
               value={formData.email}
               onChange={(e)=>setFormData({...formData,email:e.target.value})}
               />
            </div>
            </div>


            <div className='form-control'>
            <label className='label'>
              <span className='lable-text font-medium'>Password</span>
            </label>
            <div className='relative'>
              <div>
                <Lock />
              </div>
              <input
               type={showPassword ? "text" : "password"}
               className=''
               placeholder='••••••••'
               value={formData.password}
               onChange={(e)=>setFormData({...formData,password:e.target.value})}
               />
               <button type='button' onClick={()=>setShowPassword(!showPassword)}>
                  {showPassword ? (<EyeOff />) : (<Eye />)}

               </button>
            </div>
            </div>

            <button type='submit' disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                <Loader2 />
                Loading...
                </>
              ): (
                "Create Account"
              )
              }
            </button>
        </form>
        <div>
          <p>Already have an account?</p>
          <Link to='/login'>Sign in</Link>
        </div>
      </div>

    </div>
  )
}

export default SignupPage
