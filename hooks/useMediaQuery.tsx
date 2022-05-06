import { useReducer, useEffect } from 'react';

export function useMediaQuery(query: string) {
  const [matches, toggle] = useReducer((state: boolean) => !state, false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      toggle();
    }
    const listener = (media: MediaQueryListEvent) => {
      console.log(media);
      toggle();
    };
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}