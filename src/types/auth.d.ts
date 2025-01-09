// types/auth.d.ts
export interface AuthResponse {
    user: {
      id: string;
      email: string;
      accessToken: string;
      idToken: string;
      refreshToken: string;
    }
  }
  
  export interface AuthError {
    error: string;
  }
  