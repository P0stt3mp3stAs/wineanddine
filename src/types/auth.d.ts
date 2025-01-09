// types/auth.d.ts
export interface AuthResponse {
    success: boolean;
    user?: {
      id: string;
      email: string;
      accessToken: string;
      idToken: string;
      refreshToken: string;
    };
    error?: string;
  }
  
  export interface UserProfile {
    id: string;
    email: string;
    username: string;
    isVerified: boolean;
  }
  