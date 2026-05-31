import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, User, Mail, Calendar, ShieldCheck, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant local preview for an elegant, snappy feel
    setSelectedImg(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image });
    };
  };

  const formatMemberDate = (dateString) => {
    if (!dateString) return "—";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "—";

      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "—";
    }
  }; 

  return (
    /* 1. Changed fixed background color to theme layout background */
    <div className='min-h-screen bg-base-200 flex flex-col justify-center items-center p-6 antialiased'>

      {/* Main Container with beautiful depth and shadow */}
      {/* 2. Replaced strict white card background with semantic bg-base-100 */}
      <div className='w-full max-w-md bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300'>

        {/* Header Title */}
        <div className='flex flex-col items-center mb-8 text-center'>
          {/* 3. Replaced fixed dark text with theme text variable */}
          <h1 className='text-2xl font-semibold tracking-tight text-base-content'>Profile</h1>
          <p className='text-sm opacity-60 mt-1'>Manage your account information</p>
        </div>

        {/* Avatar Upload Section */}
        {/* 4. Swapped fixed borders to theme dividers */}
        <div className='flex flex-col items-center justify-center pb-8 border-b border-base-300 mb-6'>
          <div className='relative group'>
            <img
              src={selectedImg || authUser?.profilePic || '/avatar.png'}
              alt="Profile"
              /* 5. Cleaned ring and border setups to safely overlay onto themed backgrounds */
              className='w-24 h-24 rounded-full object-cover border-2 border-base-100 ring-4 ring-base-200 bg-base-200 shadow-inner'
            />
            <label
              htmlFor="avatar-upload"
              /* 6. Made upload button inherit the theme's default dark contrast (neutral) */
              className={`absolute bottom-0 right-0 p-2.5 bg-neutral text-neutral-content rounded-full cursor-pointer shadow-md hover:opacity-90 transition-all duration-200 ${isUpdatingProfile ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isUpdatingProfile ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 stroke-[2]" />
              )}
              <input
                type="file"
                id='avatar-upload'
                className='hidden'
                accept='image/*'
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className='text-xs font-medium opacity-50 mt-3'>
            {isUpdatingProfile ? "Uploading picture..." : "Click camera icon to change avatar"}
          </p>
        </div>

        {/* Core Profile Details */}
        <div className='space-y-5'>

          {/* Full Name */}
          <div className='space-y-2'>
            <label className='text-xs font-semibold opacity-70 tracking-wider uppercase flex items-center gap-2'>
              <User className="w-3.5 h-3.5 opacity-60 stroke-[2]" />
              Full Name
            </label>
            {/* 7. Read-only field styling matches retro card background system */}
            <div className='w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl text-sm text-base-content font-medium select-all transition-colors hover:bg-base-300/30'>
              {authUser?.fullName || "—"}
            </div>
          </div>

          {/* Email Address */}
          <div className='space-y-2'>
            <label className='text-xs font-semibold opacity-70 tracking-wider uppercase flex items-center gap-2'>
              <Mail className="w-3.5 h-3.5 opacity-60 stroke-[2]" />
              Email Address
            </label>
            <div className='w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl text-sm text-base-content font-medium select-all transition-colors hover:bg-base-300/30'>
              {authUser?.email || "—"}
            </div>
          </div>

        </div>

        {/* Meta / Account Details Section */}
        <div className='mt-8 border-t border-base-300 pt-6 space-y-4'>
          <h2 className='text-xs font-semibold opacity-70 tracking-wider uppercase mb-1'>Account Information</h2>

          <div className='space-y-3 text-sm'>
            {/* Member Since */}
            <div className='flex items-center justify-between py-1'>
              <span className='opacity-70 flex items-center gap-2.5'>
                <Calendar className="w-4 h-4 opacity-60 stroke-[2]" />
                Member Since
              </span>
              {/* 8. Adaptive theme container badge */}
              <span className='font-medium text-base-content bg-base-200 border border-base-300 px-2.5 py-1 rounded-lg text-xs'>
                {formatMemberDate(authUser?.createdAt)}
              </span>
            </div>

            {/* Account Status */}
            <div className='flex items-center justify-between py-1'>
              <span className='opacity-70 flex items-center gap-2.5'>
                <ShieldCheck className="w-4 h-4 opacity-60 stroke-[2]" />
                Account Status
              </span>
              {/* 9. DaisyUI contextual status indicators instead of manual colors */}
              <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-success bg-success/10 border border-success/20'>
                <span className='w-1.5 h-1.5 rounded-full bg-success animate-pulse'></span>
                Active
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Subtle bottom modern accent */}
      <span className="text-[11px] opacity-40 tracking-widest mt-8 uppercase font-medium">
        Secure Profile Management
      </span>
    </div>
  );
};

export default ProfilePage;