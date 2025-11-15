import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "user" | "viewer";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  company_name?: string;
  subscription_type: string;
  subscription_status: string;
  subscription_expires_at?: string;
}

export interface Permission {
  resource: string;
  action: string;
}

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [{ resource: "all", action: "all" }],
  user: [
    { resource: "dashboard", action: "read" },
    { resource: "data", action: "read" },
    { resource: "profile", action: "write" },
  ],
  viewer: [
    { resource: "dashboard", action: "read" },
  ],
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@arctic.com",
    role: "admin",
    company_name: "Arctic Network Inc",
    subscription_type: "enterprise",
    subscription_status: "active",
    password: "admin123"
  },
  {
    id: 2,
    username: "user",
    email: "user@arctic.com",
    role: "user",
    company_name: "Polar Research Ltd",
    subscription_type: "professional",
    subscription_status: "active",
    password: "user123"
  },
  {
    id: 3,
    username: "viewer",
    email: "viewer@arctic.com",
    role: "viewer",
    company_name: "Arctic Observer",
    subscription_type: "starter",
    subscription_status: "active",
    password: "viewer123"
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("arctic_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("arctic_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("arctic_user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("arctic_user");
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    if (user.role === "admin") return true;

    const permissions = rolePermissions[user.role] || [];
    return permissions.some(p =>
      (p.resource === resource || p.resource === "all") &&
      (p.action === action || p.action === "all")
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}