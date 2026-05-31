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
    <div className='min-h-screen bg-neutral-50 flex flex-col justify-center items-center p-6 antialiased selection:bg-neutral-200'>

      {/* Main Container with beautiful depth and shadow */}
      <div className='w-full max-w-md bg-white border border-neutral-200/60 rounded-2xl shadow-xl shadow-neutral-200/50 p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl hover:shadow-neutral-200/60'>

        {/* Header Title */}
        <div className='flex flex-col items-center mb-8 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight text-neutral-900'>Profile</h1>
          <p className='text-sm text-neutral-500 mt-1'>Manage your account information</p>
        </div>

        {/* Avatar Upload Section */}
        <div className='flex flex-col items-center justify-center pb-8 border-b border-neutral-100 mb-6'>
          <div className='relative group'>
            <img
              src={selectedImg || authUser?.profilePic || '/avatar.png'}
              alt="Profile"
              className='w-24 h-24 rounded-full object-cover border-2 border-white ring-4 ring-neutral-100 bg-neutral-50 shadow-inner'
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 p-2.5 bg-neutral-900 text-white rounded-full cursor-pointer shadow-md hover:bg-neutral-800 transition-all duration-200 ${isUpdatingProfile ? 'opacity-50 pointer-events-none' : ''}`}
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
          <p className='text-xs font-medium text-neutral-400 mt-3'>
            {isUpdatingProfile ? "Uploading picture..." : "Click camera icon to change avatar"}
          </p>
        </div>

        {/* Core Profile Details */}
        <div className='space-y-5'>

          {/* Full Name */}
          <div className='space-y-2'>
            <label className='text-xs font-semibold text-neutral-500 tracking-wider uppercase flex items-center gap-2'>
              <User className="w-3.5 h-3.5 text-neutral-400 stroke-[2]" />
              Full Name
            </label>
            <div className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200/80 rounded-xl text-sm text-neutral-800 font-medium select-all transition-colors hover:bg-neutral-100/50'>
              {authUser?.fullName || "—"}
            </div>
          </div>

          {/* Email Address */}
          <div className='space-y-2'>
            <label className='text-xs font-semibold text-neutral-500 tracking-wider uppercase flex items-center gap-2'>
              <Mail className="w-3.5 h-3.5 text-neutral-400 stroke-[2]" />
              Email Address
            </label>
            <div className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200/80 rounded-xl text-sm text-neutral-800 font-medium select-all transition-colors hover:bg-neutral-100/50'>
              {authUser?.email || "—"}
            </div>
          </div>

        </div>

        {/* Meta / Account Details Section */}
        <div className='mt-8 border-t border-neutral-100 pt-6 space-y-4'>
          <h2 className='text-xs font-semibold text-neutral-500 tracking-wider uppercase mb-1'>Account Information</h2>

          <div className='space-y-3 text-sm'>
            {/* Member Since */}
            <div className='flex items-center justify-between py-1'>
              <span className='text-neutral-500 flex items-center gap-2.5'>
                <Calendar className="w-4 h-4 text-neutral-400 stroke-[2]" />
                Member Since
              </span>
              <span className='font-medium text-neutral-800 bg-neutral-50 border border-neutral-200/60 px-2.5 py-1 rounded-lg text-xs'>
                {formatMemberDate(authUser?.createdAt)}
              </span>
            </div>

            {/* Account Status */}
            <div className='flex items-center justify-between py-1'>
              <span className='text-neutral-500 flex items-center gap-2.5'>
                <ShieldCheck className="w-4 h-4 text-neutral-400 stroke-[2]" />
                Account Status
              </span>
              <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></span>
                Active
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Subtle bottom modern accent */}
      <span className="text-[11px] text-neutral-400 tracking-widest mt-8 uppercase font-medium">
        Secure Profile Management
      </span>
    </div>
  );
};

export default ProfilePage;