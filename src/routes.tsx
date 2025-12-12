import PromptPage from './pages/PromptPage';
import CustomizePage from './pages/CustomizePage';
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
    name: 'Prompt',
    path: '/',
    element: <PromptPage />
  },
  {
    name: 'Customize',
    path: '/customize',
    element: <CustomizePage />
  },
  {
    name: 'Viewer',
    path: '/viewer',
    element: <ViewerPage />
  }
];

export default routes;
