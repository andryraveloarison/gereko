import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Operations } from './pages/Operations';
import { Sellers } from './pages/Sellers';
import { Tickets } from './pages/Tickets';
import { Expenses } from './pages/Expenses';
import { About } from './pages/About';
import { OperationProvider } from './context/OperationContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OperationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/sellers" element={<Sellers />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </OperationProvider>
    </QueryClientProvider>
  );
}

export default App;
