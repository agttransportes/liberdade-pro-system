import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary, PageErrorBoundary } from './components/ui/error-boundary';
import { LoadingState } from './components/ui/loading';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import RentalTransactions from './pages/RentalTransactions';
import PersonalTransactions from './pages/PersonalTransactions';
import Debts from './pages/Debts';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

// Estilos
import './App.css';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingState 
          message="Verificando autenticação..." 
          size="lg"
          className="py-16"
        />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <PageErrorBoundary>
      {children}
    </PageErrorBoundary>
  );
};

// Componente de rota pública (apenas para login)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingState 
          message="Carregando aplicação..." 
          size="lg"
          className="py-16"
        />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <PageErrorBoundary>
      {children}
    </PageErrorBoundary>
  );
};

function App() {
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rota de login */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Rotas protegidas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="rental-transactions" element={<RentalTransactions />} />
              <Route path="personal-transactions" element={<PersonalTransactions />} />
              <Route path="debts" element={<Debts />} />
              <Route path="goals" element={<Goals />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Rota de fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

