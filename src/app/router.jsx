import { createHashRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import React from 'react';
import { ContractProvider } from '../context/ContractContext';

const router = createHashRouter([
  {
    path: '/',
    element: (
      <ContractProvider>
        <Layout />
      </ContractProvider>
    ),
    errorElement: (
      <ContractProvider>
        <Layout />
      </ContractProvider>
    ),
  },
]);

export default router;
