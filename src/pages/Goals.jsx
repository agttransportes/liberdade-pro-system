import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Eye,
  Edit,
  PlusCircle,
  CheckCircle,
  Pause,
  Trash2,
  Trophy,
  TrendingDown,
  Clock,
  Star,
  BarChart3,
  History,
  Zap
} from 'lucide-react';
import '../App.css';

const Goals = () => {
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAddValueDialog, setShowAddValueDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: '',
    status: 'Em andamento',
    initialValue: '',
    type: 'Valor monetário'
  });

  const [valueData, setValueData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    source: 'Economia',
    isImportant: false
  });

  const categories = [
    'Negócio',
    'Pessoal',
    'Investimento',
    'Infraestrutura',
    'Tecnologia',
    'Educação',
    'Saúde',
    'Outros'
  ];

  const goalTypes = [
    'Valor monetário',
    'Quantidade',
    'Percentual'
  ];

  const valueSources = [
    'Economia',
    'Investimento',
    'Venda',
    'Salário',
    'Freelance',
    'Bônus',
    'Outros'
  ];

  // Dados de exemplo para demonstração
  const exampleGoals = [
    {
      id: 1,
      title: 'Expansão da Frota',
      description: 'Comprar 5 novos veículos para locação e aumentar a receita mensal',
      targetAmount: 150000,
      currentAmount: 45000,
      deadline: '2025-12-31',
      category: 'Negócio',
      status: 'Em andamento',
      type: 'Valor monetário',
      createdAt: '2025-01-15',
      contributions: [
        { id: 1, amount: 15000, date: '2025-02-01', description: 'Lucro Janeiro', source: 'Economia', isImportant: true },
        { id: 2, amount: 20000, date: '2025-03-01', description: 'Lucro Fevereiro', source: 'Economia', isImportant: false },
        { id: 3, amount: 10000, date: '2025-04-01', description: 'Venda equipamento antigo', source: 'Venda', isImportant: false }
      ]
    },
    {
      id: 2,
      title: 'Reserva de Emergência',
      description: 'Criar reserva para 6 meses de despesas operacionais',
      targetAmount: 30000,
      currentAmount: 18000,
      deadline: '2025-09-30',
      category: 'Pessoal',
      status: 'Em andamento',
      type: 'Valor monetário',
      createdAt: '2025-01-01',
      contributions: [
        { id: 1, amount: 5000, date: '2025-01-31', description: 'Economia mensal', source: 'Economia', isImportant: false },
        { id: 2, amount: 8000, date: '2025-02-28', description: 'Bônus trimestral', source: 'Bônus', isImportant: true },
        { id: 3, amount: 5000, date: '2025-03-31', description: 'Economia mensal', source: 'Economia', isImportant: false }
      ]
    },
    {
      id: 3,
      title: 'Reforma da Garagem',
      description: 'Reformar espaço para acomodar mais veículos',
      targetAmount: 25000,
      currentAmount: 25000,
      deadline: '2025-06-30',
      category: 'Infraestrutura',
      status: 'Concluída',
      type: 'Valor monetário',
      createdAt: '2024-12-01',
      contributions: [
        { id: 1, amount: 25000, date: '2025-05-15', description: 'Investimento completo', source: 'Investimento', isImportant: true }
      ]
    },
    {
      id: 4,
      title: 'Sistema de Gestão',
      description: 'Implementar sistema completo de gestão',
      targetAmount: 8000,
      currentAmount: 2000,
      deadline: '2025-08-15',
      category: 'Tecnologia',
      status: 'Em andamento',
      type: 'Valor monetário',
      createdAt: '2025-02-01',
      contributions: [
        { id: 1, amount: 2000, date: '2025-02-15', description: 'Primeira parcela', source: 'Investimento', isImportant: false }
      ]
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true);
    setTimeout(() => {
      setGoals(exampleGoals);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Concluída':
        return (
          <Badge className="liberdade-status-available">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluída
          </Badge>
        );
      case 'Em andamento':
        return (
          <Badge className="liberdade-status-rented">
            <Clock className="w-3 h-3 mr-1" />
            Em andamento
          </Badge>
        );
      case 'Pausada':
        return (
          <Badge className="liberdade-status-maintenance">
            <Pause className="w-3 h-3 mr-1" />
            Pausada
          </Badge>
        );
      case 'Atrasada':
        return (
          <Badge className="liberdade-status-inactive">
            <TrendingDown className="w-3 h-3 mr-1" />
            Atrasada
          </Badge>
        );
      default:
        return <Badge className="liberdade-status-maintenance">Pendente</Badge>;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Negócio': 'bg-blue-100 text-blue-800',
      'Pessoal': 'bg-green-100 text-green-800',
      'Investimento': 'bg-purple-100 text-purple-800',
      'Infraestrutura': 'bg-orange-100 text-orange-800',
      'Tecnologia': 'bg-cyan-100 text-cyan-800',
      'Educação': 'bg-yellow-100 text-yellow-800',
      'Saúde': 'bg-red-100 text-red-800',
      'Outros': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleAddGoal = () => {
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      deadline: '',
      category: '',
      status: 'Em andamento',
      initialValue: '',
      type: 'Valor monetário'
    });
    setShowAddDialog(true);
  };

  const handleViewDetails = (goal) => {
    setSelectedGoal(goal);
    setShowDetailsDialog(true);
  };

  const handleAddValue = (goal) => {
    setSelectedGoal(goal);
    setValueData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      source: 'Economia',
      isImportant: false
    });
    setShowAddValueDialog(true);
  };

  const handleSaveGoal = () => {
    if (!formData.title || !formData.targetAmount || !formData.deadline || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
      alert('A data limite não pode ser no passado.');
      return;
    }

    if (parseFloat(formData.targetAmount) <= 0) {
      alert('O valor da meta deve ser positivo.');
      return;
    }

    const initialValue = parseFloat(formData.initialValue) || 0;
    const targetAmount = parseFloat(formData.targetAmount);

    if (initialValue > targetAmount) {
      alert('O valor inicial não pode ser maior que o valor da meta.');
      return;
    }

    const newGoal = {
      id: goals.length + 1,
      title: formData.title,
      description: formData.description,
      targetAmount: targetAmount,
      currentAmount: initialValue,
      deadline: formData.deadline,
      category: formData.category,
      status: formData.status,
      type: formData.type,
      createdAt: new Date().toISOString().split('T')[0],
      contributions: initialValue > 0 ? [{
        id: 1,
        amount: initialValue,
        date: new Date().toISOString().split('T')[0],
        description: 'Valor inicial',
        source: 'Investimento',
        isImportant: true
      }] : []
    };

    setGoals([...goals, newGoal]);
    setShowAddDialog(false);
    alert('Meta criada com sucesso!');
  };

  const handleSaveValue = () => {
    if (!valueData.amount || parseFloat(valueData.amount) <= 0) {
      alert('Por favor, informe um valor válido.');
      return;
    }

    const addAmount = parseFloat(valueData.amount);
    const newCurrentAmount = selectedGoal.currentAmount + addAmount;

    if (newCurrentAmount > selectedGoal.targetAmount * 1.2) {
      const confirm = window.confirm(
        `O valor adicionado fará com que a meta ultrapasse significativamente o objetivo (${Math.round((newCurrentAmount / selectedGoal.targetAmount) * 100)}%). Deseja continuar?`
      );
      if (!confirm) return;
    }

    const newContribution = {
      id: (selectedGoal.contributions?.length || 0) + 1,
      amount: addAmount,
      date: valueData.date,
      description: valueData.description,
      source: valueData.source,
      isImportant: valueData.isImportant
    };

    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const updatedCurrentAmount = goal.currentAmount + addAmount;
        const newStatus = updatedCurrentAmount >= goal.targetAmount ? 'Concluída' : goal.status;
        
        return {
          ...goal,
          currentAmount: updatedCurrentAmount,
          status: newStatus,
          contributions: [...(goal.contributions || []), newContribution]
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    setShowAddValueDialog(false);

    // Verificar se a meta foi atingida
    if (newCurrentAmount >= selectedGoal.targetAmount && selectedGoal.status !== 'Concluída') {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }

    alert('Valor adicionado com sucesso!');
  };

  const handleCompleteGoal = (goalId) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, status: 'Concluída' } : goal
    );
    setGoals(updatedGoals);
    setShowDetailsDialog(false);
    alert('Meta marcada como concluída!');
  };

  const handlePauseGoal = (goalId) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, status: 'Pausada' } : goal
    );
    setGoals(updatedGoals);
    setShowDetailsDialog(false);
    alert('Meta pausada!');
  };

  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateProjection = (goal) => {
    if (!goal.contributions || goal.contributions.length === 0) return null;
    
    const contributions = goal.contributions.filter(c => c.amount > 0);
    if (contributions.length === 0) return null;

    const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
    const avgContribution = totalContributed / contributions.length;
    const remaining = goal.targetAmount - goal.currentAmount;
    const contributionsNeeded = Math.ceil(remaining / avgContribution);
    
    return {
      avgContribution,
      contributionsNeeded,
      projectedDays: contributionsNeeded * 30 // Assumindo contribuições mensais
    };
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.status === 'Concluída').length;
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Celebração */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center animate-bounce">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Parabéns!</h2>
            <p className="text-gray-600">Você atingiu sua meta!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metas e Objetivos</h1>
          <p className="text-gray-600 mt-1">Defina e acompanhe suas metas financeiras</p>
        </div>
        <Button onClick={handleAddGoal} className="liberdade-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Metas</p>
                <p className="text-2xl font-bold text-gray-900">{totalGoals}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-purple-600">R$ {totalTargetAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progresso Geral</p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysLeft = calculateDaysLeft(goal.deadline);
          
          return (
            <Card key={goal.id} className="liberdade-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(goal.status)}
                    <Badge variant="outline" className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Meta:</span>
                    <span className="ml-1 font-medium">R$ {goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Atual:</span>
                    <span className="ml-1 font-medium text-green-600">R$ {goal.currentAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Prazo:</span>
                    <span className="ml-1 font-medium">{new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Restam:</span>
                    <span className={`ml-1 font-medium ${daysLeft < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                      {daysLeft > 0 ? `${daysLeft} dias` : 'Vencido'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        progress >= 100 ? 'bg-green-600' : 
                        progress >= 75 ? 'bg-blue-600' : 
                        progress >= 50 ? 'bg-yellow-600' : 'bg-orange-600'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewDetails(goal)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  {goal.status !== 'Concluída' && (
                    <Button 
                      size="sm" 
                      className="liberdade-gradient text-white"
                      onClick={() => handleAddValue(goal)}
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Adicionar Valor
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card className="liberdade-card">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma meta cadastrada</p>
            <p className="text-sm text-gray-500 mt-1">Comece definindo sua primeira meta</p>
          </CardContent>
        </Card>
      )}

      {/* Resumo do Progresso */}
      {goals.length > 0 && (
        <Card className="liberdade-card">
          <CardHeader>
            <CardTitle>Resumo do Progresso</CardTitle>
            <CardDescription>Visão geral do andamento de todas as suas metas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Progresso Geral das Metas</span>
                <span className="font-bold text-lg">
                  {totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full" 
                  style={{ width: `${totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-600 font-medium">Valor Alcançado</p>
                  <p className="text-xl font-bold text-blue-700">R$ {totalCurrentAmount.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-purple-600 font-medium">Valor Restante</p>
                  <p className="text-xl font-bold text-purple-700">R$ {(totalTargetAmount - totalCurrentAmount).toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-medium">Taxa de Sucesso</p>
                  <p className="text-xl font-bold text-green-700">
                    {totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog para Nova Meta */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Meta</DialogTitle>
            <DialogDescription>
              Crie uma nova meta para acompanhar seus objetivos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Nome/Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Comprar carro novo"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição Detalhada *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva sua meta em detalhes..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAmount">Valor da Meta *</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  placeholder="50000.00"
                />
              </div>
              <div>
                <Label htmlFor="initialValue">Valor Inicial</Label>
                <Input
                  id="initialValue"
                  type="number"
                  step="0.01"
                  value={formData.initialValue}
                  onChange={(e) => setFormData({...formData, initialValue: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Data Limite/Prazo *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Tipo de Meta</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Pausada">Pausada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveGoal} className="liberdade-gradient text-white">
              Criar Meta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Ver Detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Detalhes da Meta
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre {selectedGoal?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedGoal && (
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Nome da Meta</Label>
                    <p className="text-lg font-semibold">{selectedGoal.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Descrição</Label>
                    <p className="text-sm text-gray-700">{selectedGoal.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Categoria</Label>
                      <div className="mt-1">
                        <Badge className={getCategoryColor(selectedGoal.category)}>
                          {selectedGoal.category}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedGoal.status)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Valor da Meta</Label>
                      <p className="text-lg font-semibold">R$ {selectedGoal.targetAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Valor Atual</Label>
                      <p className="text-lg font-semibold text-green-600">R$ {selectedGoal.currentAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Data de Criação</Label>
                      <p>{new Date(selectedGoal.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Prazo Limite</Label>
                      <p>{new Date(selectedGoal.deadline).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Dias Restantes</Label>
                    <p className={`font-medium ${calculateDaysLeft(selectedGoal.deadline) < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                      {calculateDaysLeft(selectedGoal.deadline) > 0 ? 
                        `${calculateDaysLeft(selectedGoal.deadline)} dias` : 
                        'Vencido'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Progresso */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium text-gray-600">Progresso da Meta</Label>
                  <span className="text-lg font-bold">
                    {Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full ${
                      (selectedGoal.currentAmount / selectedGoal.targetAmount) * 100 >= 100 ? 'bg-green-600' : 
                      (selectedGoal.currentAmount / selectedGoal.targetAmount) * 100 >= 75 ? 'bg-blue-600' : 
                      (selectedGoal.currentAmount / selectedGoal.targetAmount) * 100 >= 50 ? 'bg-yellow-600' : 'bg-orange-600'
                    }`}
                    style={{ width: `${Math.min((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>R$ {selectedGoal.currentAmount.toLocaleString()}</span>
                  <span>R$ {selectedGoal.targetAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Estatísticas */}
              {selectedGoal.contributions && selectedGoal.contributions.length > 0 && (
                <div>
                  <Label className="text-lg font-medium mb-4 block">Estatísticas</Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-blue-600 font-medium text-sm">Contribuições</p>
                      <p className="text-lg font-bold text-blue-700">{selectedGoal.contributions.length}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-green-600 font-medium text-sm">Média por Contribuição</p>
                      <p className="text-lg font-bold text-green-700">
                        R$ {Math.round(selectedGoal.currentAmount / selectedGoal.contributions.length).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-purple-600 font-medium text-sm">Valor Restante</p>
                      <p className="text-lg font-bold text-purple-700">
                        R$ {Math.max(0, selectedGoal.targetAmount - selectedGoal.currentAmount).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Zap className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                      <p className="text-orange-600 font-medium text-sm">Marcos Importantes</p>
                      <p className="text-lg font-bold text-orange-700">
                        {selectedGoal.contributions.filter(c => c.isImportant).length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Histórico de Contribuições */}
              <div>
                <div className="flex items-center mb-4">
                  <History className="w-5 h-5 mr-2" />
                  <Label className="text-lg font-medium">Histórico de Contribuições</Label>
                </div>
                
                {selectedGoal.contributions && selectedGoal.contributions.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedGoal.contributions.map((contribution) => (
                      <div key={contribution.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${contribution.isImportant ? 'bg-yellow-100' : 'bg-green-100'}`}>
                            {contribution.isImportant ? (
                              <Star className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <PlusCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">R$ {contribution.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(contribution.date).toLocaleDateString('pt-BR')} • {contribution.source}
                            </p>
                            {contribution.description && (
                              <p className="text-xs text-gray-400">{contribution.description}</p>
                            )}
                          </div>
                        </div>
                        {contribution.isImportant && (
                          <Badge variant="outline" className="text-yellow-600">
                            <Star className="w-3 h-3 mr-1" />
                            Marco
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <PlusCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Nenhuma contribuição registrada</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fechar
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar Meta
            </Button>
            {selectedGoal?.status !== 'Concluída' && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => handlePauseGoal(selectedGoal.id)}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar Meta
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleCompleteGoal(selectedGoal.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Concluída
                </Button>
                <Button 
                  className="liberdade-gradient text-white"
                  onClick={() => {
                    setShowDetailsDialog(false);
                    handleAddValue(selectedGoal);
                  }}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Adicionar Valor
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Adicionar Valor */}
      <Dialog open={showAddValueDialog} onOpenChange={setShowAddValueDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" />
              Adicionar Valor
            </DialogTitle>
            <DialogDescription>
              Adicione um valor à meta {selectedGoal?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedGoal && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor atual:</span>
                  <span className="font-medium">R$ {selectedGoal.currentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor da meta:</span>
                  <span className="font-medium">R$ {selectedGoal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Restante:</span>
                  <span className="font-medium">R$ {Math.max(0, selectedGoal.targetAmount - selectedGoal.currentAmount).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="valueAmount">Valor a ser Adicionado *</Label>
                <Input
                  id="valueAmount"
                  type="number"
                  step="0.01"
                  value={valueData.amount}
                  onChange={(e) => setValueData({...valueData, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="valueDate">Data da Adição *</Label>
                <Input
                  id="valueDate"
                  type="date"
                  value={valueData.date}
                  onChange={(e) => setValueData({...valueData, date: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="valueSource">Origem do Valor</Label>
                <Select value={valueData.source} onValueChange={(value) => setValueData({...valueData, source: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {valueSources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="valueDescription">Descrição/Observação</Label>
                <Textarea
                  id="valueDescription"
                  value={valueData.description}
                  onChange={(e) => setValueData({...valueData, description: e.target.value})}
                  placeholder="Descreva a origem deste valor..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={valueData.isImportant}
                  onChange={(e) => setValueData({...valueData, isImportant: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isImportant" className="text-sm">
                  Marcar como marco importante
                </Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddValueDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveValue} className="liberdade-gradient text-white">
              Adicionar Valor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;

