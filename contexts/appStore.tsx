import { createContext, useState} from 'react';

/**
 * Default Values
 */
const DEFAULT_VALUES = {
  lang: 'en',
  theme: 'light'
};

/**
 * App Context.
 */
const AppContext = createContext(DEFAULT_VALUES);

/**
 * App Provider
 */
export const AppProvider: React.FC = ({ children }) => {
  const [lang, setLang] = useState(DEFAULT_VALUES['lang']);
  const [theme, setTheme] = useState(DEFAULT_VALUES['theme']);

  return (
  <AppContext.Provider
    value={{
      lang,
      theme
    }}
  >
    {children}
  </AppContext.Provider>
  );
};

  export default AppContext;