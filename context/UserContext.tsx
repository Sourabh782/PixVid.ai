'use client';

import { createContext, useState, Dispatch, SetStateAction } from "react";

export type User = {
  username: string
}

export interface UserContextType {
  user: User,
  setUser: Dispatch<SetStateAction<User>>
}

const defaultState = {
  user: {
    username: ""
  },
  setUser: (user: User)=>{}
} as UserContextType

const UserContext = createContext(defaultState);

export default UserContext;