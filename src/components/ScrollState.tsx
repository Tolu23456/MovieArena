import React from 'react';

export interface PageScrollState {
  /** True when the page is scrolled to (or within a few px of) the bottom. */
  atEnd: boolean;
  /** True when the content is taller than the viewport. */
  scrollable: boolean;
}

const ScrollStateContext = React.createContext<PageScrollState>({
  atEnd: false,
  scrollable: false,
});

export const ScrollStateProvider = ScrollStateContext.Provider;

/** Read the shell scroll position from inside a page. */
export function usePageScrollState(): PageScrollState {
  return React.useContext(ScrollStateContext);
}
