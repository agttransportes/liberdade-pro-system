import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrorHandler, ValidationError } from '../hooks/useErrorHandler';
import { useNotification } from '../hooks/useNotification';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Eye, EyeOff, Car, Lock, Mail, Loader2 } from 'lucide-react';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('admin@liberdadepro.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { errors, validateForm, withErrorHandling } = useErrorHandler();

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value) => {
        if (!value.includes('@')) return 'Email deve conter @';
        return true;
      }
    },
    password: {
      required: true,
      minLength: 6
    }
  };

  const handleSubmit = withErrorHandling(async (e) => {
    e.preventDefault();
    
    const formData = { email, password };
    
    // Validação do formulário
    if (!validateForm(formData, validationRules)) {
      throw new ValidationError('Por favor, corrija os erros no formulário');
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        showSuccess(
          'Login realizado com sucesso!',
          'Redirecionando para o dashboard...'
        );
        setTimeout(() => navigate('/'), 1000);
      } else {
        throw new ValidationError(result.error || 'Credenciais inválidas');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new Error('Erro interno do servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, 'Login');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      // Re-validar em tempo real se houver erro
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
      if (isValid) {
        // clearFieldError seria chamado automaticamente na próxima validação
      }
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      // Re-validar em tempo real se houver erro
      if (e.target.value.length >= 6) {
        // clearFieldError seria chamado automaticamente na próxima validação
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 liberdade-gradient rounded-full flex items-center justify-center">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Liberdade Pro
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Gestão de Locação de Veículos
          </p>
        </div>

        <Card className="liberdade-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full liberdade-gradient text-white hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Credenciais de demonstração</span>
                </div>
              </div>
              
              <Alert className="mt-4 bg-blue-50 border-blue-200">
                <AlertDescription className="text-sm text-blue-800">
                  <strong>Email:</strong> admin@liberdadepro.com<br />
                  <strong>Senha:</strong> admin123
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Liberdade Pro. Sistema de gestão de locação de veículos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

