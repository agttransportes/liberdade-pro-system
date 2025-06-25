import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

// Error Boundary principal
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para mostrar a UI de erro
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para monitoramento
    console.error('Error Boundary capturou um erro:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Simular envio para serviço de monitoramento
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    console.log('Erro reportado:', errorReport);
    
    // Em produção, você enviaria para um serviço real:
    // errorReportingService.captureException(error, { extra: errorReport });
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;
      
      // Se um componente de fallback customizado foi fornecido
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onGoHome={this.handleGoHome}
          />
        );
      }

      // UI de erro padrão
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Oops! Algo deu errado
              </CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir para Início
                </Button>
              </div>
              
              {showDetails && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    Detalhes técnicos
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Erro:</strong> {this.state.error.message}
                    </div>
                    <div className="mb-2">
                      <strong>ID:</strong> {this.state.errorId}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Boundary específico para páginas
export class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro na página:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar a página
            </h2>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar o conteúdo desta página.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recarregar Página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Boundary para componentes específicos
export class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro no componente:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { fallbackMessage = 'Erro ao carregar componente' } = this.props;
      
      return (
        <div className="flex items-center justify-center p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-700">{fallbackMessage}</p>
            <Button 
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => this.setState({ hasError: false })}
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para capturar erros assíncronos
export const useAsyncError = () => {
  const [, setError] = React.useState();
  
  return React.useCallback((error) => {
    setError(() => {
      throw error;
    });
  }, []);
};

// HOC para adicionar Error Boundary a componentes
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Componente de fallback customizável
export const ErrorFallback = ({ 
  error, 
  onRetry, 
  onGoHome,
  title = 'Algo deu errado',
  description = 'Ocorreu um erro inesperado. Tente novamente ou volte ao início.',
  showRetry = true,
  showGoHome = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4 p-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
          {showGoHome && (
            <Button onClick={onGoHome}>
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

