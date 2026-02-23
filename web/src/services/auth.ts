import { api } from "@/services/api";
type TokenRes = { accessToken: string; refreshToken: string };

export const authService = {
  login: async (credentials: LoginInput) => {
    const { data } = await api.post<TokenRes>("/login", credentials);
    return data;
  },
  register: async (formData: RegisterFormState) => {
    const { data } = await api.post<TokenRes>("/register", formData);
    return data;
  },
  getMe: async () => {
    const { data } = await api.get<{ user: User }>("/me");
    return data.user || data || null;
  },
  logout: async (refreshToken: string) => {
    await api.post("/logout", { refreshToken });
  },
};
