"use client";

import { createContext, useState, useReducer, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
/* Own */
import { SnackBarLoading } from '../components';

/**
 * Default Values
 */
const DEFAULT_VALUES = {
  lang: 'en',
  theme: 'light',
  isLoading: false,
  toggleLoading: (_a: boolean) => { },
};

/**
 * App Context.
 */
const AppContext = createContext(DEFAULT_VALUES);

export interface IProviderProps {
  children: React.ReactNode;
};

/**
 * App Provider
 */
export const AppProvider: React.FC<IProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [lang, setLang] = useState(DEFAULT_VALUES['lang']);
  const [theme, setTheme] = useState(DEFAULT_VALUES['theme']);
  const [isLoading, toggleLoading] = useReducer((_state: boolean, newValue: boolean) => newValue, false);
  const pathNameRef = useRef(pathname);

  useEffect(() => {
    const handleStop = () => { toggleLoading(false) };
    if (pathNameRef.current !== pathname) {

      handleStop();
      pathNameRef.current = pathname;
    }
  }, [pathname]);

  return (
    <AppContext.Provider
      value={{
        lang,
        theme,
        isLoading,
        toggleLoading,
      }}
    >
      <SnackBarLoading isOpen={isLoading} />
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
