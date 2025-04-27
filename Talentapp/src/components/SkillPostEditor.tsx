// src/components/SkillPostEditor.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { Link } from 'react-router-dom';

type SkillPost = {
  id?: string;
  title: string;
  description: string;
  image_url?: string | null;
  category: string;
  user_id: string;
  created_at?: string;
};

export const SkillPostEditor = ({ postId }: { postId?: string }) => {
  const { user } = useAuth();
  const [post, setPost] = useState<Omit<SkillPost, 'user_id'>>({ 
    title: '',
    description: '',
    category: '',
    image_url: null
  });
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const categories = ['Design', 'Development', 'Marketing', 'Writing', 'Other'];

  useEffect(() => {
    if (postId) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [postId, user?.id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('skill_posts')
        .select('*')
        .eq('id', postId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPost(data);
        if (data.image_url) {
          setPreviewUrl(getPublicUrl(data.image_url));
        }
      }
    } catch (error) {
      toast.error('Failed to load post');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage
      .from('skill_images')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      setLoading(true);
      let imagePath = post.image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('skill_images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        imagePath = fileName;

        if (post.image_url) {
          await supabase.storage.from('skill_images').remove([post.image_url]);
        }
      }

      const { error } = await supabase
        .from('skill_posts')
        .upsert({
          ...post,
          id: postId || undefined,
          user_id: user.id,
          image_url: imagePath,
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      toast.success(postId ? 'Post updated successfully!' : 'Post created successfully!');
      
      if (!postId) {
        setPost({ title: '', description: '', category: '', image_url: null });
        setPreviewUrl(null);
        setImageFile(null);
      }
    } catch (error) {
      toast.error(postId ? 'Post update failed' : 'Post creation failed');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-8"><LoadingSpinner/></div>;

  // Show login prompt if user isn't logged in and not editing an existing post
  if (!user?.id && !postId) {
    return (
        <div className="flex items-center justify-center text-xl prata-regular py-8">Login to be able to make a post!</div>
    )
  }

  return (
    <div className="container mx-auto p-6 bg-secondary rounded-lg shadow-2xl w-full mt-32">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {postId ? 'Edit Skill Post' : 'Create New Skill Post'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div className="flex flex-col items-start">
          <label className="block text-gray-700 mb-2">Featured Image</label>
          <div className="relative w-36 h-48 mb-4 rounded-2xl overflow-hidden border border-black">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Post preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <span className="text-gray-500">No image selected</span>
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-secondary text-secondary px-4 py-2 rounded-md transition">
            {post.image_url ? 'Change Image' : 'Upload Image'}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-1">Title*</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({...post, title: e.target.value})}
            className="w-full p-2 border bg-secondary border-black rounded-md"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 mb-1">Category*</label>
          <select
            value={post.category}
            onChange={(e) => setPost({...post, category: e.target.value})}
            className="w-full p-2 border bg-secondary border-black rounded-md"
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-1">Description*</label>
          <textarea
            value={post.description}
            onChange={(e) => setPost({...post, description: e.target.value})}
            className="w-full p-2 border bg-secondary border-black rounded-md min-h-[150px]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-secondary py-2 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? (postId ? 'Updating...' : 'Creating...') : (postId ? 'Update Post' : 'Create Post')}
        </button>
      </form>
    </div>
  );
};