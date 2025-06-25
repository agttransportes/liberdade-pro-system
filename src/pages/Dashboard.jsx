import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useNotification } from '../hooks/useNotification';
import { 
  Car, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Plus,
  Wallet,
  CreditCard,
  BarChart3,
  Calendar,
  Users,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Wrench,
  Loader2
} from 'lucide-react';
import '../App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotification();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Dados simulados para demonstração
  const stats = [
    {
      title: 'Total de Veículos',
      value: '12',
      description: 'Frota total',
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 18.500',
      description: '+12% vs mês anterior',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Veículos Disponíveis',
      value: '8',
      description: '4 alugados',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Alertas Pendentes',
      value: '3',
      description: 'Requer atenção',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Veículo',
      description: 'Cadastrar veículo',
      icon: Car,
      path: '/vehicles',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Nova Locação',
      description: 'Registrar aluguel',
      icon: DollarSign,
      path: '/rental-transactions',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Transação Pessoal',
      description: 'Adicionar transação',
      icon: Wallet,
      path: '/personal-transactions',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Nova Dívida',
      description: 'Registrar dívida',
      icon: CreditCard,
      path: '/debts',
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'high',
      title: 'Licenciamento Vencido',
      description: 'Veículo ABC-1234 com licenciamento vencido há 5 dias',
      date: '2025-06-15',
      action: 'Resolver'
    },
    {
      id: 2,
      type: 'medium',
      title: 'Manutenção Programada',
      description: 'Honda Civic precisa de revisão em 2 dias',
      date: '2025-06-21',
      action: 'Agendar'
    },
    {
      id: 3,
      type: 'low',
      title: 'Pagamento Pendente',
      description: 'Locação #123 com pagamento em atraso',
      date: '2025-06-18',
      action: 'Cobrar'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'income',
      description: 'Aluguel Toyota Corolla',
      amount: 1200,
      date: '2025-06-15',
      status: 'paid'
    },
    {
      id: 2,
      type: 'expense',
      description: 'Manutenção Honda Civic',
      amount: 350,
      date: '2025-06-14',
      status: 'paid'
    },
    {
      id: 3,
      type: 'income',
      description: 'Aluguel Jeep Renegade',
      amount: 1800,
      date: '2025-06-13',
      status: 'pending'
    }
  ];

  const vehicles = [
    {
      id: 1,
      plate: 'ABC-1234',
      model: 'Toyota Corolla',
      year: 2022,
      status: 'Disponível',
      rentalValue: 120,
      color: 'Prata',
      nextMaintenance: '2024-11-15'
    },
    {
      id: 2,
      plate: 'DEF-5678',
      model: 'Honda Civic',
      year: 2021,
      status: 'Alugado',
      rentalValue: 110,
      color: 'Preto',
      nextMaintenance: '2024-12-20'
    },
    {
      id: 3,
      plate: 'GHI-9012',
      model: 'Jeep Renegade',
      year: 2023,
      status: 'Manutenção',
      rentalValue: 180,
      color: 'Branco',
      nextMaintenance: '2025-01-10'
    }
  ];

  const getAlertColor = useCallback((type) => {
    switch (type) {
      case 'high': return 'liberdade-alert-high';
      case 'medium': return 'liberdade-alert-medium';
      case 'low': return 'liberdade-alert-low';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  }, []);

  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      'Disponível': { className: 'liberdade-status-available', icon: CheckCircle },
      'Alugado': { className: 'liberdade-status-rented', icon: Clock },
      'Manutenção': { className: 'liberdade-status-maintenance', icon: Wrench },
      'Inativo': { className: 'liberdade-status-inactive', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig['Inativo'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.className} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  }, []);

  const handleAlertAction = useCallback((alertId, action) => {
    showSuccess(
      'Ação executada',
      `Ação "${action}" executada para o alerta ${alertId}`
    );
  }, [showSuccess]);

  const handleVehicleAction = useCallback((vehicleId, action) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    switch (action) {
      case 'view':
        showInfo(
          'Visualizar Veículo',
          `Redirecionando para detalhes do veículo ${vehicle?.model} (${vehicle?.plate})`
        );
        // Em vez de navegar para rota inexistente, redireciona para a lista de veículos
        navigate('/vehicles');
        break;
      case 'edit':
        showInfo(
          'Editar Veículo',
          `Redirecionando para edição do veículo ${vehicle?.model} (${vehicle?.plate})`
        );
        // Em vez de navegar para rota inexistente, redireciona para a lista de veículos
        navigate('/vehicles');
        break;
      case 'rent':
        showInfo(
          'Nova Locação',
          `Iniciando nova locação para o veículo ${vehicle?.model} (${vehicle?.plate})`
        );
        navigate('/rental-transactions');
        break;
      default:
        showSuccess(
          'Ação executada',
          `Ação "${action}" executada para o veículo ${vehicleId}`
        );
    }
  }, [vehicles, navigate, showInfo, showSuccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
        </div>
        <Button 
          onClick={() => navigate('/vehicles')} 
          className="liberdade-gradient text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      {/* Ações Rápidas */}
      <Card className="liberdade-card">
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
          <CardDescription>Ações mais utilizadas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 liberdade-hover-lift"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="w-6 h-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="liberdade-card liberdade-hover-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo Financeiro e Status da Frota */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 liberdade-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-green-600">Receitas do Mês</p>
                  <p className="text-2xl font-bold text-green-700">R$ 18.500</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm text-red-600">Despesas do Mês</p>
                  <p className="text-2xl font-bold text-red-700">R$ 8.200</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600 rotate-180" />
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-blue-600">Lucro Líquido</p>
                  <p className="text-2xl font-bold text-blue-700">R$ 10.300</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="liberdade-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Status da Frota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="liberdade-indicator liberdade-indicator-green"></div>
                  <span className="text-sm text-gray-600">Disponíveis</span>
                </div>
                <Badge className="liberdade-status-available">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="liberdade-indicator liberdade-indicator-blue"></div>
                  <span className="text-sm text-gray-600">Alugados</span>
                </div>
                <Badge className="liberdade-status-rented">4</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="liberdade-indicator liberdade-indicator-orange"></div>
                  <span className="text-sm text-gray-600">Manutenção</span>
                </div>
                <Badge className="liberdade-status-maintenance">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="liberdade-indicator liberdade-indicator-red"></div>
                  <span className="text-sm text-gray-600">Total</span>
                </div>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">12</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Veículos em Destaque */}
      <Card className="liberdade-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Veículos em Destaque
            </div>
            <Button variant="outline" onClick={() => navigate('/vehicles')}>
              Ver Todos
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 border rounded-lg liberdade-hover-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{vehicle.model}</h3>
                    <p className="text-sm text-gray-600">{vehicle.plate} • {vehicle.year}</p>
                  </div>
                  {getStatusBadge(vehicle.status)}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valor/dia:</span>
                    <span className="font-medium">R$ {vehicle.rentalValue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cor:</span>
                    <span>{vehicle.color}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleVehicleAction(vehicle.id, 'view')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleVehicleAction(vehicle.id, 'edit')}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Transações Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="liberdade-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Alertas e Pendências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm opacity-80">{alert.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      {new Date(alert.date).toLocaleDateString('pt-BR')}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleAlertAction(alert.id, alert.action)}
                  >
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="liberdade-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      transaction.type === 'income' ? 'liberdade-income' : 'liberdade-expense'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount}
                    </p>
                    <Badge 
                      variant={transaction.status === 'paid' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {transaction.status === 'paid' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

