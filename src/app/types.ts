// types.ts
export interface AuthFormProps {
  redirectUrl?: string;
  afterSignInUrl?: string;
  afterSignUpUrl?: string;
}

export interface SocialButtonProps {
  onClick: () => Promise<void>;
  children: React.ReactNode;
}