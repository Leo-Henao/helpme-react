import React, { useEffect, useReducer, useState } from 'react';
import { InfoUsers } from '../utils/InfoUsers';
import { AuthContext } from './AuthContext';
import { authReducer } from './authReducer';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

const init = () => JSON.parse(sessionStorage.getItem(USER_KEY)) || { logged: false };

export default function AuthProvider({ children }) {
  const [user, dispatch] = useReducer(authReducer, {}, init);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    if (user.user) {
      sessionStorage.setItem(TOKEN_KEY, user.user.access_token);
    }
    const existe = InfoUsers.roleExiste('ROLE_ADMIN');
    setIsAdmin(existe);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, dispatch, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}