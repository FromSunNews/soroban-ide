import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './app/router';
import MobileGuard from './components/common/MobileGuard';

const App = () => (
  <React.StrictMode>
    <MobileGuard>
      <RouterProvider router={router} />
    </MobileGuard>
  </React.StrictMode>
);

export default App;
