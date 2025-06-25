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
  CreditCard, 
  Plus, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Eye,
  Edit,
  Receipt,
  History,
  TrendingDown,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import '../App.css';

const Debts = () => {
  const [loading, setLoading] = useState(false);
  const [debts, setDebts] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    totalAmount: '',
    dueDate: '',
    monthlyPayment: '',
    installments: '',
    category: '',
    status: 'Em dia',
    notes: ''
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'PIX',
    notes: '',
    isLate: false
  });

  const categories = [
    'Financiamento',
    'Cartão de Crédito',
    'Empréstimo Pessoal',
    'Empréstimo Consignado',
    'Crediário',
    'Outros'
  ];

  const paymentMethods = [
    'PIX',
    'Dinheiro',
    'Cartão de Débito',
    'Cartão de Crédito',
    'Transferência',
    'Boleto'
  ];

  // Dados de exemplo para demonstração
  const exampleDebts = [
    {
      id: 1,
      description: 'Financiamento Veículo',
      totalAmount: 25000,
      remainingAmount: 18000,
      monthlyPayment: 850,
      dueDate: '2025-07-05',
      status: 'Em dia',
      category: 'Financiamento',
      installments: 36,
      paidInstallments: 8,
      notes: 'Financiamento do Honda Civic',
      payments: [
        { id: 1, amount: 850, date: '2025-05-05', method: 'PIX', notes: 'Pagamento em dia' },
        { id: 2, amount: 850, date: '2025-04-05', method: 'PIX', notes: 'Pagamento em dia' },
        { id: 3, amount: 850, date: '2025-03-05', method: 'PIX', notes: 'Pagamento em dia' }
      ]
    },
    {
      id: 2,
      description: 'Cartão de Crédito',
      totalAmount: 3500,
      remainingAmount: 3500,
      monthlyPayment: 350,
      dueDate: '2025-06-25',
      status: 'Vencido',
      category: 'Cartão de Crédito',
      installments: 10,
      paidInstallments: 0,
      notes: 'Fatura em atraso',
      payments: []
    },
    {
      id: 3,
      description: 'Empréstimo Pessoal',
      totalAmount: 10000,
      remainingAmount: 4500,
      monthlyPayment: 450,
      dueDate: '2025-07-10',
      status: 'Em dia',
      category: 'Empréstimo Pessoal',
      installments: 24,
      paidInstallments: 12,
      notes: 'Empréstimo para reforma',
      payments: [
        { id: 1, amount: 450, date: '2025-06-10', method: 'Débito Automático', notes: 'Pagamento automático' },
        { id: 2, amount: 450, date: '2025-05-10', method: 'Débito Automático', notes: 'Pagamento automático' }
      ]
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true);
    setTimeout(() => {
      setDebts(exampleDebts);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    return status === 'Em dia' ? (
      <Badge className="liberdade-status-available">
        <CheckCircle className="w-3 h-3 mr-1" />
        Em dia
      </Badge>
    ) : (
      <Badge className="liberdade-status-inactive">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Vencido
      </Badge>
    );
  };

  const handleAddDebt = () => {
    setFormData({
      description: '',
      totalAmount: '',
      dueDate: '',
      monthlyPayment: '',
      installments: '',
      category: '',
      status: 'Em dia',
      notes: ''
    });
    setShowAddDialog(true);
  };

  const handleViewDetails = (debt) => {
    setSelectedDebt(debt);
    setShowDetailsDialog(true);
  };

  const handleRegisterPayment = (debt) => {
    setSelectedDebt(debt);
    setPaymentData({
      amount: debt.monthlyPayment.toString(),
      date: new Date().toISOString().split('T')[0],
      method: 'PIX',
      notes: '',
      isLate: false
    });
    setShowPaymentDialog(true);
  };

  const handleSaveDebt = () => {
    if (!formData.description || !formData.totalAmount || !formData.monthlyPayment || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newDebt = {
      id: debts.length + 1,
      description: formData.description,
      totalAmount: parseFloat(formData.totalAmount),
      remainingAmount: parseFloat(formData.totalAmount),
      monthlyPayment: parseFloat(formData.monthlyPayment),
      dueDate: formData.dueDate,
      status: formData.status,
      category: formData.category,
      installments: parseInt(formData.installments) || Math.ceil(parseFloat(formData.totalAmount) / parseFloat(formData.monthlyPayment)),
      paidInstallments: 0,
      notes: formData.notes,
      payments: []
    };

    setDebts([...debts, newDebt]);
    setShowAddDialog(false);
    alert('Dívida cadastrada com sucesso!');
  };

  const handleSavePayment = () => {
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      alert('Por favor, informe um valor válido para o pagamento.');
      return;
    }

    const paymentAmount = parseFloat(paymentData.amount);
    if (paymentAmount > selectedDebt.remainingAmount) {
      alert('O valor do pagamento não pode ser superior ao valor restante da dívida.');
      return;
    }

    const newPayment = {
      id: (selectedDebt.payments?.length || 0) + 1,
      amount: paymentAmount,
      date: paymentData.date,
      method: paymentData.method,
      notes: paymentData.notes,
      isLate: paymentData.isLate
    };

    const updatedDebts = debts.map(debt => {
      if (debt.id === selectedDebt.id) {
        const newRemainingAmount = debt.remainingAmount - paymentAmount;
        const newPaidInstallments = debt.paidInstallments + 1;
        const newStatus = newRemainingAmount <= 0 ? 'Quitado' : 
                         (new Date(debt.dueDate) < new Date() && newRemainingAmount > 0) ? 'Vencido' : 'Em dia';

        return {
          ...debt,
          remainingAmount: Math.max(0, newRemainingAmount),
          paidInstallments: newPaidInstallments,
          status: newStatus,
          payments: [...(debt.payments || []), newPayment]
        };
      }
      return debt;
    });

    setDebts(updatedDebts);
    setShowPaymentDialog(false);
    alert('Pagamento registrado com sucesso!');
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const monthlyTotal = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  const overdueDebts = debts.filter(debt => debt.status === 'Vencido').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Controle de Dívidas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas dívidas e compromissos financeiros</p>
        </div>
        <Button onClick={handleAddDebt} className="liberdade-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Dívida
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total em Dívidas</p>
                <p className="text-2xl font-bold liberdade-expense">R$ {totalDebt.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pagamento Mensal</p>
                <p className="text-2xl font-bold text-orange-600">R$ {monthlyTotal.toLocaleString()}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="liberdade-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dívidas Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{overdueDebts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Dívidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {debts.map((debt) => {
          const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
          
          return (
            <Card key={debt.id} className="liberdade-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{debt.description}</CardTitle>
                    <CardDescription>
                      Vencimento: {new Date(debt.dueDate).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  {getStatusBadge(debt.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Valor Total:</span>
                    <span className="ml-1 font-medium">R$ {debt.totalAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Restante:</span>
                    <span className="ml-1 font-medium liberdade-expense">R$ {debt.remainingAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Parcela:</span>
                    <span className="ml-1 font-medium">R$ {debt.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Progresso:</span>
                    <span className="ml-1 font-medium">{Math.round(progress)}%</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      progress === 100 ? 'bg-green-600' : 
                      progress >= 75 ? 'bg-blue-600' : 
                      progress >= 50 ? 'bg-yellow-600' : 'bg-orange-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewDetails(debt)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  {debt.status !== 'Quitado' && (
                    <Button 
                      size="sm" 
                      className="liberdade-gradient text-white"
                      onClick={() => handleRegisterPayment(debt)}
                    >
                      <Receipt className="w-4 h-4 mr-1" />
                      Registrar Pagamento
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {debts.length === 0 && (
        <Card className="liberdade-card">
          <CardContent className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma dívida cadastrada</p>
            <p className="text-sm text-gray-500 mt-1">Comece adicionando sua primeira dívida</p>
          </CardContent>
        </Card>
      )}

      {/* Dialog para Nova Dívida */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Dívida</DialogTitle>
            <DialogDescription>
              Cadastre uma nova dívida ou compromisso financeiro
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Nome/Descrição *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Financiamento do carro"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalAmount">Valor Total *</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                  placeholder="25000.00"
                />
              </div>
              <div>
                <Label htmlFor="monthlyPayment">Parcela Mensal *</Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  step="0.01"
                  value={formData.monthlyPayment}
                  onChange={(e) => setFormData({...formData, monthlyPayment: e.target.value})}
                  placeholder="850.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="installments">Número de Parcelas</Label>
                <Input
                  id="installments"
                  type="number"
                  value={formData.installments}
                  onChange={(e) => setFormData({...formData, installments: e.target.value})}
                  placeholder="36"
                />
              </div>
            </div>

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
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em dia">Em dia</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveDebt} className="liberdade-gradient text-white">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Ver Detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Detalhes da Dívida
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre {selectedDebt?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDebt && (
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Nome da Dívida</Label>
                    <p className="text-lg font-semibold">{selectedDebt.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Categoria</Label>
                    <p>{selectedDebt.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedDebt.status)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Valor Total</Label>
                    <p className="text-lg font-semibold">R$ {selectedDebt.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Valor Restante</Label>
                    <p className="text-lg font-semibold liberdade-expense">R$ {selectedDebt.remainingAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Próxima Parcela</Label>
                    <p className="text-lg font-semibold">R$ {selectedDebt.monthlyPayment.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Progresso */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium text-gray-600">Progresso do Pagamento</Label>
                  <span className="text-sm font-medium">
                    {Math.round(((selectedDebt.totalAmount - selectedDebt.remainingAmount) / selectedDebt.totalAmount) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${((selectedDebt.totalAmount - selectedDebt.remainingAmount) / selectedDebt.totalAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{selectedDebt.paidInstallments} de {selectedDebt.installments} parcelas pagas</span>
                  <span>Próximo vencimento: {new Date(selectedDebt.dueDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {selectedDebt.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Observações</Label>
                  <p className="text-sm text-gray-700 mt-1">{selectedDebt.notes}</p>
                </div>
              )}

              <Separator />

              {/* Histórico de Pagamentos */}
              <div>
                <div className="flex items-center mb-4">
                  <History className="w-5 h-5 mr-2" />
                  <Label className="text-lg font-medium">Histórico de Pagamentos</Label>
                </div>
                
                {selectedDebt.payments && selectedDebt.payments.length > 0 ? (
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedDebt.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">R$ {payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(payment.date).toLocaleDateString('pt-BR')} • {payment.method}
                            </p>
                            {payment.notes && (
                              <p className="text-xs text-gray-400">{payment.notes}</p>
                            )}
                          </div>
                        </div>
                        {payment.isLate && (
                          <Badge variant="outline" className="text-orange-600">
                            <Clock className="w-3 h-3 mr-1" />
                            Atraso
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Nenhum pagamento registrado</p>
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
              Editar Dívida
            </Button>
            {selectedDebt?.status !== 'Quitado' && (
              <Button 
                className="liberdade-gradient text-white"
                onClick={() => {
                  setShowDetailsDialog(false);
                  handleRegisterPayment(selectedDebt);
                }}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Registrar Pagamento
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Registrar Pagamento */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Registrar Pagamento
            </DialogTitle>
            <DialogDescription>
              Registre um pagamento para {selectedDebt?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDebt && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor restante:</span>
                  <span className="font-medium">R$ {selectedDebt.remainingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Parcela mensal:</span>
                  <span className="font-medium">R$ {selectedDebt.monthlyPayment.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="paymentAmount">Valor do Pagamento *</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="paymentDate">Data do Pagamento *</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentData.date}
                  onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                <Select value={paymentData.method} onValueChange={(value) => setPaymentData({...paymentData, method: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentNotes">Observações do Pagamento</Label>
                <Textarea
                  id="paymentNotes"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                  placeholder="Observações sobre este pagamento..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isLate"
                  checked={paymentData.isLate}
                  onChange={(e) => setPaymentData({...paymentData, isLate: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isLate" className="text-sm">
                  Pagamento em atraso
                </Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePayment} className="liberdade-gradient text-white">
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Debts;

