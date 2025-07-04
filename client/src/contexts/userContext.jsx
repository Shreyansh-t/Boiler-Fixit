import React, { createContext, useState } from 'react';

export const UserDataContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: '',
    fullName: {
      firstname: '',
      lastName: ''
    }
  });

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContextProvider;
