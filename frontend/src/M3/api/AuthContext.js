import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USERS = [
  { id: 1, name: 'Standard User', role: 'USER', email: 'user@example.com' },
  { id: 2, name: 'Admin User', role: 'ADMIN', email: 'admin@example.com' },
  { id: 3, name: 'Technician User', role: 'TECHNICIAN', email: 'tech@example.com' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(USERS[0]);
  const [platform, setPlatform] = useState('Mac');

  useEffect(() => {
    const isWin = navigator.platform.indexOf('Win') > -1;
    setPlatform(isWin ? 'Windows' : 'Mac');
  }, []);

  const switchUser = (id) => {
    const found = USERS.find(u => u.id === id);
    if (found) setUser(found);
  };

  return (
    <AuthContext.Provider value={{ user, platform, switchUser, USERS }}>
      <div className={`platform-${platform.toLowerCase()}`}>
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
