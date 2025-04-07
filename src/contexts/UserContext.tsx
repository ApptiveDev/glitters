import { createContext, useContext, useMemo, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  birth: string;
  termsAccepted: boolean;
  joinedAt: string;
  reportedCount: number;
  isDeactivated: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
