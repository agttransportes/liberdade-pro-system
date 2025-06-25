import React from 'react';
import { Loader2 } from 'lucide-react';

// Componente de loading simples
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]} ${className}`} />
  );
};

// Componente de loading com texto
export const LoadingState = ({ 
  message = 'Carregando...', 
  size = 'md',
  className = '',
  showSpinner = true 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {showSpinner && <LoadingSpinner size={size} />}
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
};

// Componente de loading para cards
export const CardLoadingState = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
};

// Componente de loading para tabelas
export const TableLoadingState = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Componente de loading para botões
export const ButtonLoadingState = ({ children, loading, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Hook para estados de loading
export const useLoadingState = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);

  const withLoading = React.useCallback(async (asyncFn) => {
    try {
      setLoading(true);
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    setLoading,
    withLoading
  };
};

// Componente de skeleton para listas
export const ListSkeleton = ({ items = 5, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

// Componente de skeleton para cards de veículos
export const VehicleCardSkeleton = ({ count = 3, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="flex space-x-2 pt-3">
            <div className="h-8 bg-gray-200 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 rounded w-10"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de estado vazio
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action}
    </div>
  );
};

