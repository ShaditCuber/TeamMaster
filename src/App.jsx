import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import RouterApp from '../Router';
import { UsuarioProvider } from './context/AuthContext.jsx';
import { Toaster } from 'sonner'
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();


export default function App() {
  return (
    <>
      <Toaster richColors closeButton position="top-center" />
      <QueryClientProvider client={queryClient}>
        <UsuarioProvider>
          <BrowserRouter>
            <RouterApp />
            <Analytics />
          </BrowserRouter>
        </UsuarioProvider>
      </QueryClientProvider>
    </>
  );
}