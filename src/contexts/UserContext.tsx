import { createContext, useContext, useMemo, useState } from 'react';

import type { SignUpUser } from '@/types/user';

const initialUserState: SignUpUser = {
  email: '',
  password: '',
  name: '',
  birth: '',
  termsAccepted: false,
};

interface UserContextType {
  user: SignUpUser;
  setUser: (user: SignUpUser) => void;
  updateUser: (fields: Partial<SignUpUser>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SignUpUser>(initialUserState);

  const updateUser = (fields: Partial<SignUpUser>) => {
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
