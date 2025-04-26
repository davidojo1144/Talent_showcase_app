import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

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
        
        // Enhanced query with error handling
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();  // Use maybeSingle instead of single

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (data) {
          setProfile(data);
          if (data.avatar_url) {
            setPreviewUrl(getPublicUrl(data.avatar_url));
          }
        } else {
          // Initialize new profile if doesn't exist
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
      .getPublicUrl(path, {
        download: false
      });
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Upload new avatar if selected
      let avatarPath = profile.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
        avatarPath = fileName;

        // Delete old avatar if exists
        if (profile.avatar_url) {
          await supabase.storage
            .from('avatars')
            .remove([profile.avatar_url]);
        }
      }

      // Upsert profile data
      const updates = {
        id: user.id,
        ...profile,
        avatar_url: avatarPath,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, {
          onConflict: 'id'
        });

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      toast.error(message);
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Your existing form JSX */}
    </div>
  );
};