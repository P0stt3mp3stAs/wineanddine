// utils/storage.ts
import { uploadData, getUrl } from 'aws-amplify/storage';

export const uploadImage = async (file: File, key: string) => {
  try {
    await uploadData({
      key,
      data: file,
      options: {
        contentType: file.type
      }
    });
    
    const url = await getUrl({
      key,
      options: {
        validateObjectExistence: true
      }
    });
    
    return url.url.toString();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getImageUrl = async (key: string) => {
  try {
    const url = await getUrl({
      key,
      options: {
        validateObjectExistence: true
      }
    });
    return url.url.toString();
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
};
