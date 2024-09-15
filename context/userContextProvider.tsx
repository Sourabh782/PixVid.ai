"use client";
import { useState } from "react";
import UserContext, { User } from "./UserContext";

export default function UserContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User>({
    username: ""
  });
  
  return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
  );
}