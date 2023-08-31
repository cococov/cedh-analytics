"use client";

import { createContext, useState, useReducer } from 'react';

/**
 * Default Values
 */
const DEFAULT_VALUES = {
  lang: 'en',
  theme: 'light',
  isLoading: false,
  toggleLoading: (_a: boolean) => {},
};

/**
 * App Context.
 */
const AppContext = createContext(DEFAULT_VALUES);

export interface IProviderProps {
  children?: any;
}

/**
 * App Provider
 */
export const AppProvider: React.FC<IProviderProps> = ({ children }) => {
  const [lang, setLang] = useState(DEFAULT_VALUES['lang']);
  const [theme, setTheme] = useState(DEFAULT_VALUES['theme']);
  const [isLoading, toggleLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);


  return (
  <AppContext.Provider
    value={{
      lang,
      theme,
      isLoading,
      toggleLoading,
    }}
  >
    {children}
  </AppContext.Provider>
  );
};

  export default AppContext;
