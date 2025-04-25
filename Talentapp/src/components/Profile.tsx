
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Profile = {
  id: string;
  username: string;
  location: string;
  bio: string;
  avatar_url: string;
};

export const ProfileEditor = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      if (data?.avatar_url) {
        setPreviewUrl(getPublicUrl(data.avatar_url));
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let avatarPath = profile.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;
        avatarPath = filePath;

        // Delete old avatar if it exists
        if (profile.avatar_url) {
          await supabase.storage
            .from('avatars')
            .remove([profile.avatar_url]);
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: profile.username,
          location: profile.location,
          bio: profile.bio,
          avatar_url: avatarPath,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) return <div>Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#321B15]">Edit Profile</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Avatar Upload */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-[#321B15]">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#ECE5D8] flex items-center justify-center">
                <span className="text-[#321B15]">No photo</span>
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-[#321B15] text-[#ECE5D8] px-4 py-2 rounded-md hover:bg-opacity-90 transition">
            Change Photo
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-[#321B15] mb-2">Display Name</label>
          <input
            type="text"
            value={profile?.username || ''}
            onChange={(e) => setProfile({...profile!, username: e.target.value})}
            className="w-full p-2 border border-[#321B15] rounded-md bg-[#ECE5D8] text-[#321B15]"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-[#321B15] mb-2">Location</label>
          <input
            type="text"
            value={profile?.location || ''}
            onChange={(e) => setProfile({...profile!, location: e.target.value})}
            className="w-full p-2 border border-[#321B15] rounded-md bg-[#ECE5D8] text-[#321B15]"
          />
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-[#321B15] mb-2">Bio</label>
          <textarea
            value={profile?.bio || ''}
            onChange={(e) => setProfile({...profile!, bio: e.target.value})}
            className="w-full p-2 border border-[#321B15] rounded-md bg-[#ECE5D8] text-[#321B15] min-h-[100px]"
            maxLength={200}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#321B15] text-[#ECE5D8] py-2 px-4 rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};