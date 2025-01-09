// components/ProfilePicture.tsx
import { useRef, useState } from 'react';
import { uploadImage } from '@/utils/storage'; 

interface ProfilePictureProps {
  username: string | null;
  initialImage?: string;
  onImageUpdate: (url: string) => void;
  onError: (error: string) => void;
}

export default function ProfilePicture({ username, initialImage, onImageUpdate, onError }: ProfilePictureProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        onError('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !username) return;

    try {
      setIsUploading(true);
      const imageKey = `profiles/${username}/profile.jpg`;
      const url = await uploadImage(file, imageKey);
      onImageUpdate(url);
    } catch (error) {
      onError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl text-gray-400">
                {username?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageSelect}
      />
      {imagePreview && imagePreview !== initialImage && (
        <button
          onClick={handleImageUpload}
          disabled={isUploading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Save Photo'}
        </button>
      )}
    </div>
  );
}