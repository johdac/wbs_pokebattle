declare global {
  type User = {
    _id: string;
    createdAt: string;
    __v: number;
    email: string;
    username: string;
    roles: string[];
  };
  type LoginInput = { email: string; password: string };

  type AuthContextType = {
    signedIn: boolean;
    user: User | null;
    isLoading: boolean;
    handleSignIn: ({ email, password }: LoginInput) => Promise<void>;
    handleSignOut: () => Promise<void>;
    handleRegister: (formData: RegisterFormState) => Promise<void>;
  };

  type RegisterFormState = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}
export interface LeaderboardEntry {
  id: string;
  score: number;
  date: string;
  userId: {
    username: string;
    id: string;
  };
}
