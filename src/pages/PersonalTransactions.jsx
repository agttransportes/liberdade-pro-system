import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { useNotification, useConfirmation } from '../hooks/useNotification';
import { useErrorHandler, ValidationError } from '../hooks/useErrorHandler';
import { 
  Wallet, 
  Plus, 
  Edit, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Trash2,
  PieChart,
  Loader2
} from 'lucide-react';
import '../App.css';

const PersonalTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Dinheiro',
    notes: ''
  });

  const { showSuccess, showError } = useNotification();
  const { confirm } = useConfirmation();
  const { errors, validateForm, withErrorHandling } = useErrorHandler();

  const categories = useMemo(() => ({
    income: [
      'Salário',
      'Freelance',
      'Investimentos',
      'Vendas',
      'Outros'
    ],
    expense: [
      'Alimentação',
      'Transporte',
      'Moradia',
      'Saúde',
      'Educação',
      'Lazer',
      'Compras',
      'Contas',
      'Manutenção Veículos',
      'Combustível',
      'Outros'
    ]
  }), []);

  // Dados de exemplo para demonstração
  const exampleTransactions = useMemo(() => [
    {
      id: 1,
      description: 'Salário Mensal',
      amount: 5000,
      type: 'income',
      category: 'Salário',
      date: '2025-06-01',
      paymentMethod: 'Transferência',
      notes: 'Salário do mês de junho'
    },
    {
      id: 2,
      description: 'Supermercado',
      amount: 350,
      type: 'expense',
      category: 'Alimentação',
      date: '2025-06-15',
      paymentMethod: 'Cartão',
      notes: 'Compras da semana'
    },
    {
      id: 3,
      description: 'Combustível',
      amount: 200,
      type: 'expense',
      category: 'Combustível',
      date: '2025-06-14',
      paymentMethod: 'PIX',
      notes: 'Abastecimento dos veículos'
    },
    {
      id: 4,
      description: 'Freelance Design',
      amount: 1200,
      type: 'income',
      category: 'Freelance',
      date: '2025-06-10',
      paymentMethod: 'PIX',
      notes: 'Projeto de identidade visual'
    },
    {
      id: 5,
      description: 'Conta de Luz',
      amount: 180,
      type: 'expense',
      category: 'Contas',
      date: '2025-06-08',
      paymentMethod: 'Débito Automático',
      notes: 'Conta de energia elétrica'
    }
  ], []);

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true);
    setTimeout(() => {
      setTransactions(exampleTransactions);
      setLoading(false);
    }, 1000);
  }, [exampleTransactions]);

  // Otimização com useMemo para filtros
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  // Otimização com useMemo para resumo financeiro
  const financialSummary = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpense += transaction.amount;
      }
      acc.balance = acc.totalIncome - acc.totalExpense;
      return acc;
    }, { totalIncome: 0, totalExpense: 0, balance: 0 });
  }, [transactions]);

  // Otimização com useMemo para breakdown por categoria
  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    transactions.forEach(transaction => {
      if (!breakdown[transaction.category]) {
        breakdown[transaction.category] = { income: 0, expense: 0 };
      }
      breakdown[transaction.category][transaction.type] += transaction.amount;
    });
    return breakdown;
  }, [transactions]);

  const validationRules = useMemo(() => ({
    description: { required: true, minLength: 3 },
    amount: { 
      required: true,
      custom: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) return 'Valor deve ser um número positivo';
        return true;
      }
    },
    category: { required: true },
    date: { required: true }
  }), []);

  const getTypeBadge = useCallback((type) => {
    return type === 'income' ? (
      <Badge className="liberdade-income border">
        <TrendingUp className="w-3 h-3 mr-1" />
        Receita
      </Badge>
    ) : (
      <Badge className="liberdade-expense border">
        <TrendingDown className="w-3 h-3 mr-1" />
        Despesa
      </Badge>
    );
  }, []);

  const handleAddTransaction = useCallback(() => {
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Dinheiro',
      notes: ''
    });
    setShowAddDialog(true);
  }, []);

  const handleEditTransaction = useCallback((transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      paymentMethod: transaction.paymentMethod,
      notes: transaction.notes || ''
    });
    setShowEditDialog(true);
  }, []);

  const handleDeleteTransaction = useCallback(async (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    
    const confirmed = await confirm({
      title: 'Excluir Transação',
      message: `Tem certeza que deseja excluir a transação "${transaction?.description}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        setTransactions(transactions.filter(t => t.id !== transactionId));
        showSuccess(
          'Transação excluída',
          'A transação foi removida com sucesso.'
        );
      } catch (error) {
        showError(
          'Erro ao excluir',
          'Não foi possível excluir a transação. Tente novamente.'
        );
      }
    }
  }, [transactions, confirm, showSuccess, showError]);

  const handleSaveTransaction = withErrorHandling(async () => {
    // Validação do formulário
    if (!validateForm(formData, validationRules)) {
      throw new ValidationError('Por favor, corrija os erros no formulário');
    }

    try {
      if (selectedTransaction) {
        // Editar transação existente
        const updatedTransactions = transactions.map(t => 
          t.id === selectedTransaction.id 
            ? { ...t, ...formData, amount: parseFloat(formData.amount) }
            : t
        );
        setTransactions(updatedTransactions);
        setShowEditDialog(false);
        showSuccess(
          'Transação atualizada',
          'As informações da transação foram atualizadas com sucesso.'
        );
      } else {
        // Adicionar nova transação
        const newTransaction = {
          id: transactions.length + 1,
          ...formData,
          amount: parseFloat(formData.amount)
        };
        setTransactions([...transactions, newTransaction]);
        setShowAddDialog(false);
        showSuccess(
          'Transação cadastrada',
          'A nova transação foi adicionada com sucesso.'
        );
      }
      
      setSelectedTransaction(null);
    } catch (error) {
      throw new Error('Não foi possível salvar a transação. Tente novamente.');
    }
  }, 'Salvar transação');

  const handleTypeChange = useCallback((type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: '' // Reset category when type changes
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Carregando transações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transações Pessoais</h1>
          <p className="text-gray-600 mt-1">Gerencie suas receitas e despesas</p>
        </div>
        <Button onClick={handleAddTransaction} className="liberdade-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                <p className="text-2xl font-bold liberdade-income">
                  R$ {financialSummary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Despesas</p>
                <p className="text-2xl font-bold liberdade-expense">
                  R$ {financialSummary.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${
                  financialSummary.balance >= 0 ? 'liberdade-income' : 'liberdade-expense'
                }`}>
                  R$ {financialSummary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                financialSummary.balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  financialSummary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="liberdade-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por descrição ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <PieChart className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {[...categories.income, ...categories.expense].map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card className="liberdade-card">
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg liberdade-hover-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <span>{transaction.paymentMethod}</span>
                    </div>
                    {transaction.notes && (
                      <p className="text-sm text-gray-500 mt-1">{transaction.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'liberdade-income' : 'liberdade-expense'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {getTypeBadge(transaction.type)}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma transação encontrada</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Comece adicionando sua primeira transação'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Adicionar Transação */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogDescription>
              Adicione uma nova receita ou despesa
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Salário, Supermercado..."
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Valor *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0,00"
                  className={errors.amount ? 'border-red-500' : ''}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                )}
              </div>
              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[formData.type].map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                )}
              </div>
              <div>
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Cartão">Cartão</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
                    <SelectItem value="Débito Automático">Débito Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Informações adicionais (opcional)"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTransaction} className="liberdade-gradient text-white">
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Transação */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
            <DialogDescription>
              Atualize as informações da transação
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-type">Tipo *</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descrição *</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Salário, Supermercado..."
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-amount">Valor *</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0,00"
                  className={errors.amount ? 'border-red-500' : ''}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-date">Data *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Categoria *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[formData.type].map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-paymentMethod">Forma de Pagamento</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Cartão">Cartão</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
                    <SelectItem value="Débito Automático">Débito Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-notes">Observações</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Informações adicionais (opcional)"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTransaction} className="liberdade-gradient text-white">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalTransactions;

