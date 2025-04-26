import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Add this import

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
  const navigate = useNavigate(); // Initialize navigate
  const [profile, setProfile] = useState<Partial<Profile>>({
    username: '',
    full_name: '',
    bio: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // New state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          toast.error('Please login to access your profile');
          navigate('/login'); // Redirect to login
          return;
        }

        setAuthChecked(true); // Mark auth as verified
        
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
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

    checkAuthAndFetchProfile();
  }, [navigate]);

  // ... keep your existing getPublicUrl, handleFileChange functions ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      // ... rest of your existing handleSubmit logic ...
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return <div>Checking authentication...</div>;
  }

  if (loading && !profile.username) {
    return <div>Loading profile...</div>;
  }

  // ... keep your existing return JSX ...
};