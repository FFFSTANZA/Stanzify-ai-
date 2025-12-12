import CreatePage from './pages/CreatePage';
import ViewerPage from './pages/ViewerPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Create',
    path: '/',
    element: <CreatePage />
  },
  {
    name: 'Viewer',
    path: '/viewer',
    element: <ViewerPage />
  }
];

export default routes;
