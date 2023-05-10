import '../../design-system/styles/global.css'
import { initializeTheme } from '../../design-system/utils/initializeTheme.ts'
import '../hmr'
import Layout from './_layout.tsx'
import CreateWallet from './create-wallet.tsx'
import DesignSystem from './ds.tsx'
import Index from './index.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'

initializeTheme()

const router = createHashRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/create-wallet',
    element: <CreateWallet />,
  },
  {
    path: '/ds',
    element: <DesignSystem />,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </React.StrictMode>,
)