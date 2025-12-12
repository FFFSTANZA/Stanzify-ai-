import PresentationPage from './pages/PresentationPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Stanzify',
    path: '/',
    element: <PresentationPage />
  }
];

export default routes;
