import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

type Profile = {
  id: string;
  username: string;
  full_name: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
};

export const ProfileEditor = () => {
  const { user } = useAuth();
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
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile(data);
          if (data.avatar_url) {
            setPreviewUrl(getPublicUrl(data.avatar_url));
          }
        } else {
          setProfile({
            username: user.email?.split('@')[0] || '',
            full_name: '',
            bio: '',
            location: ''
          });
        }
      } catch (error) {
        toast.error('Failed to load profile');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

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
    if (!user?.id) return;
    
    try {
      setLoading(true);
      let avatarPath = profile.avatar_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;
        avatarPath = fileName;

        if (profile.avatar_url) {
          await supabase.storage.from('avatars').remove([profile.avatar_url]);
        }
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          avatar_url: avatarPath,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Profile update failed');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;

  return (
    <div className="container mx-auto p-6 bg-secondary rounded-lg shadow-xl border-primary mt-20">
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

        {/* Form Fields */}
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

        <div>
          <label className="block text-[#321B15] mb-1">Full Name</label>
          <input
            type="text"
            value={profile.full_name || ''}
            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
            className="w-full p-2 border border-[#321B15] rounded-md bg-[#ECE5D8] text-[#321B15]"
          />
        </div>

        <div>
          <label className="block text-[#321B15] mb-1">Location</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={(e) => setProfile({...profile, location: e.target.value})}
            className="w-full p-2 border border-[#321B15] rounded-md bg-[#ECE5D8] text-[#321B15]"
          />
        </div>

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
