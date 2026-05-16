import { create } from "zustand";

interface User {
  userId: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  verified: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  initFromStorage: () => void;
}

const safeParseUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr || userStr === "undefined" || userStr === "null") return null;
    return JSON.parse(userStr);
  } catch {
    localStorage.clear();
    return null;
  }
};

const safeGetToken = (): string | null => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token || token === "undefined") return null;
    return token;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: safeParseUser(),
  accessToken: safeGetToken(),
  isAuthenticated: !!safeGetToken() && !!safeParseUser(),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, accessToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  initFromStorage: () => {
    try {
      const user = safeParseUser();
      const token = safeGetToken();
      if (user && token) {
        set({ user, accessToken: token, isAuthenticated: true });
      } else {
        localStorage.clear();
        set({ user: null, accessToken: null, isAuthenticated: false });
      }
    } catch {
      localStorage.clear();
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
}));
