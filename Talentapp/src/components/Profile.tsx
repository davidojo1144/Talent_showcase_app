import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Profile = {
  id: string;
  username: string;
  full_name: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  updated_at?: string;
};

export const ProfileEditor = () => {
  const [profile, setProfile] = useState<Partial<Profile>>({
    username: '',
    full_name: '',
    bio: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setProfile(data);
          if (data.avatar_url) {
            setPreviewUrl(getPublicUrl(data.avatar_url));
          }
        }
      } catch (error) {
        toast.error('Failed to load profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: false
          });

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
      const updates = {
        id: user.id,
        ...profile,
        avatar_url: avatarPath,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.username) return <div>Loading profile...</div>;

  return (
    <div className="container  mx-auto p-6 bg-secondary rounded-lg shadow-xl border-primary mt-20">
      <h2 className="text-2xl text-center font-bold mb-6 text-[#321B15]">Edit Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
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
            {profile.avatar_url ? 'Change Photo' : 'Upload Photo'}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Username */}
        <div>
          <label className="block text-[#321B15] mb-1">Username*</label>
          <input
            type="text"
            value={profile.username || ''}
            onChange={(e) => setProfile({...profile, username: e.target.value})}
            className="w-full p-2 border border-[#321B15] rounded-md bg-[#ECE5D8] text-[#321B15]"
            required
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-[#321B15] mb-1">Full Name</label>
          <input
            type="text"
            value={profile.full_name || ''}
            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
            className="w-full p-2 border border-[#321B15] rounded-md bg-[#ECE5D8] text-[#321B15]"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-[#321B15] mb-1">Location</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={(e) => setProfile({...profile, location: e.target.value})}
            className="w-full p-2 border border-[#321B15] rounded-md bg-[#ECE5D8] text-[#321B15]"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-[#321B15] mb-1">Bio</label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            className="w-full p-2 border border-[#321B15] rounded-md bg-[#ECE5D8] text-[#321B15] min-h-[100px]"
            maxLength={200}
          />
        </div>

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