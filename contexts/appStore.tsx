/**
 *  cEDH Analytics - A website that analyzes and cross-references several
 *  EDH (Magic: The Gathering format) community's resources to give insights
 *  on the competitive metagame.
 *  Copyright (C) 2021-present CoCoCov
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  Original Repo: https://github.com/cococov/cedh-analytics
 *  https://www.cedh-analytics.com/
 */

"use client";

import { createContext, useState, useReducer, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
/* Own */
import SnackBarLoading from '@/components/snackBarLoading';

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
