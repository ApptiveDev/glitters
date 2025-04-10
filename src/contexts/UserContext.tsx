import { createContext, useContext, useMemo, useState } from 'react';

import type { User } from '@/types/user';

const initialUserState: User = {
  id: 0,
  name: '',
  email: '',
  password: '',
  birth: '',
  termsAccepted: false,
  joinedAt: '',
  reportedCount: 0,
  isDeactivated: false,
};

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  updateUser: (fields: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(initialUserState);

  const updateUser = (fields: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  const value = useMemo(() => ({ user, setUser, updateUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
