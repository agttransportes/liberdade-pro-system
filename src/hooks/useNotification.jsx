import React from 'react';
import { toast } from 'sonner';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

// Hook personalizado para notificações
export const useNotification = () => {
  const showSuccess = (message, description) => {
    toast.success(message, {
      description,
      icon: <CheckCircle className="w-4 h-4" />,
      duration: 4000,
    });
  };

  const showError = (message, description) => {
    toast.error(message, {
      description,
      icon: <XCircle className="w-4 h-4" />,
      duration: 5000,
    });
  };

  const showWarning = (message, description) => {
    toast.warning(message, {
      description,
      icon: <AlertTriangle className="w-4 h-4" />,
      duration: 4000,
    });
  };

  const showInfo = (message, description) => {
    toast.info(message, {
      description,
      icon: <Info className="w-4 h-4" />,
      duration: 3000,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

// Componente de confirmação personalizado
export const useConfirmation = () => {
  const confirm = (options) => {
    return new Promise((resolve) => {
      const {
        title = 'Confirmar ação',
        message = 'Tem certeza que deseja continuar?',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        variant = 'default'
      } = options;

      toast.custom((t) => (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {variant === 'destructive' ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <Info className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    resolve(true);
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    variant === 'destructive'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    resolve(false);
                  }}
                  className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ), {
        duration: Infinity,
      });
    });
  };

  return { confirm };
};

