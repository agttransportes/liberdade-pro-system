import { useState, useCallback } from 'react';
import { useNotification } from './useNotification';

// Hook para tratamento de erros
export const useErrorHandler = () => {
  const { showError } = useNotification();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error, context = 'Operação') => {
    console.error(`Erro em ${context}:`, error);
    
    let errorMessage = 'Ocorreu um erro inesperado';
    let errorDescription = 'Tente novamente em alguns instantes';

    // Tratamento específico por tipo de erro
    if (error.name === 'ValidationError') {
      errorMessage = 'Dados inválidos';
      errorDescription = error.message || 'Verifique os dados informados';
    } else if (error.name === 'NetworkError') {
      errorMessage = 'Erro de conexão';
      errorDescription = 'Verifique sua conexão com a internet';
    } else if (error.name === 'AuthenticationError') {
      errorMessage = 'Erro de autenticação';
      errorDescription = 'Faça login novamente';
    } else if (error.name === 'AuthorizationError') {
      errorMessage = 'Acesso negado';
      errorDescription = 'Você não tem permissão para esta ação';
    } else if (error.message) {
      errorDescription = error.message;
    }

    showError(errorMessage, errorDescription);
    
    return {
      message: errorMessage,
      description: errorDescription,
      context
    };
  }, [showError]);

  const setFieldError = useCallback((field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateField = useCallback((field, value, rules = {}) => {
    const { required, minLength, maxLength, pattern, custom } = rules;
    
    // Campo obrigatório
    if (required && (!value || value.toString().trim() === '')) {
      const message = `${field} é obrigatório`;
      setFieldError(field, message);
      return false;
    }

    // Comprimento mínimo
    if (minLength && value && value.toString().length < minLength) {
      const message = `${field} deve ter pelo menos ${minLength} caracteres`;
      setFieldError(field, message);
      return false;
    }

    // Comprimento máximo
    if (maxLength && value && value.toString().length > maxLength) {
      const message = `${field} deve ter no máximo ${maxLength} caracteres`;
      setFieldError(field, message);
      return false;
    }

    // Padrão regex
    if (pattern && value && !pattern.test(value.toString())) {
      const message = `${field} tem formato inválido`;
      setFieldError(field, message);
      return false;
    }

    // Validação customizada
    if (custom && value) {
      const customResult = custom(value);
      if (customResult !== true) {
        setFieldError(field, customResult || `${field} é inválido`);
        return false;
      }
    }

    clearFieldError(field);
    return true;
  }, [setFieldError, clearFieldError]);

  const validateForm = useCallback((data, validationRules) => {
    clearAllErrors();
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldValid = validateField(field, data[field], validationRules[field]);
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  }, [validateField, clearAllErrors]);

  const withErrorHandling = useCallback((asyncFn, context) => {
    return async (...args) => {
      try {
        setIsLoading(true);
        clearAllErrors();
        const result = await asyncFn(...args);
        return result;
      } catch (error) {
        handleError(error, context);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
  }, [handleError, clearAllErrors]);

  return {
    errors,
    isLoading,
    handleError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    validateField,
    validateForm,
    withErrorHandling
  };
};

// Classe de erro personalizada para validação
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Classe de erro personalizada para rede
export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Classe de erro personalizada para autenticação
export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Classe de erro personalizada para autorização
export class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

