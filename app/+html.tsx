import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { ReactNode } from 'react';

/**
 * Web-only root document. The nav CSS lives here (not in a client effect) so
 * the browser can paint the correct navigation on the very first frame: the
 * sidebar above 980px and the tab bar at 980px and below.
 */
const NAV_CSS = `
@media (max-width: 980px) {
  [data-ma-sidebar] { display: none !important; }
}
@media (min-width: 981px) {
  [data-ma-tabbar] { display: none !important; }
}
`;

export default function Root({ children }: { children: ReactNode }) {
  // Required for server-side rendering: Expo Router injects its own document
  // attributes and script/style nodes through this context.
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
