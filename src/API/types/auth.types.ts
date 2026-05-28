export interface RegisterData { fullName: string; email: string; password: string; }
export interface LoginData { email: string; password: string; }
export interface LoginResponse { token: string; role: string; refreshToken?: string; }
export interface GoogleLoginData { idToken: string; }
export interface FacebookLoginData { accessToken: string; }
export interface ForgotPasswordData { email: string; }
export interface ResetPasswordData { email: string; token: string; newPassword: string; confirmPassword: string; }
