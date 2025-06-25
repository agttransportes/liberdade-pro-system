import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Eye, 
  Calendar,
  Car,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  FileText,
  CreditCard
} from 'lucide-react';
import '../App.css';

const RentalTransactions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [formData, setFormData] = useState({
    vehicleId: '',
    customerName: '',
    customerPhone: '',
    customerDocument: '',
    startDate: '',
    endDate: '',
    dailyRate: '',
    totalAmount: '',
    paymentMethod: 'Dinheiro',
    status: 'Ativo',
    notes: ''
  });

  // Dados de exemplo para demonstração
  const exampleRentals = [
    {
      id: 1,
      vehicleId: 1,
      vehiclePlate: 'ABC-1234',
      vehicleModel: 'Toyota Corolla',
      customerName: 'João Silva',
      customerPhone: '(11) 99999-9999',
      customerDocument: '123.456.789-00',
      startDate: '2025-06-15',
      endDate: '2025-06-22',
      dailyRate: 120,
      totalAmount: 840,
      paymentMethod: 'PIX',
      status: 'Ativo',
      notes: 'Cliente preferencial',
      createdAt: '2025-06-15'
    },
    {
      id: 2,
      vehicleId: 2,
      vehiclePlate: 'DEF-5678',
      vehicleModel: 'Honda Civic',
      customerName: 'Maria Santos',
      customerPhone: '(11) 88888-8888',
      customerDocument: '987.654.321-00',
      startDate: '2025-06-10',
      endDate: '2025-06-17',
      dailyRate: 110,
      totalAmount: 770,
      paymentMethod: 'Cartão',
      status: 'Finalizado',
      notes: '',
      createdAt: '2025-06-10'
    },
    {
      id: 3,
      vehicleId: 3,
      vehiclePlate: 'GHI-9012',
      vehicleModel: 'Jeep Renegade',
      customerName: 'Carlos Oliveira',
      customerPhone: '(11) 77777-7777',
      customerDocument: '456.789.123-00',
      startDate: '2025-06-20',
      endDate: '2025-06-25',
      dailyRate: 180,
      totalAmount: 900,
      paymentMethod: 'Dinheiro',
      status: 'Pendente',
      notes: 'Aguardando pagamento',
      createdAt: '2025-06-20'
    }
  ];

  const availableVehicles = [
    { id: 1, plate: 'ABC-1234', model: 'Toyota Corolla', dailyRate: 120 },
    { id: 4, plate: 'JKL-3456', model: 'Volkswagen Gol', dailyRate: 80 },
    { id: 5, plate: 'MNO-7890', model: 'Ford Ka', dailyRate: 70 }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true);
    setTimeout(() => {
      setRentals(exampleRentals);
      setFilteredRentals(exampleRentals);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filtrar locações baseado na busca e filtro de status
    let filtered = rentals.filter(rental => {
      const matchesSearch = rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rental.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rental.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredRentals(filtered);
  }, [rentals, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Ativo': { className: 'liberdade-status-rented', icon: Clock },
      'Finalizado': { className: 'liberdade-status-available', icon: CheckCircle },
      'Pendente': { className: 'liberdade-status-maintenance', icon: AlertTriangle },
      'Cancelado': { className: 'liberdade-status-inactive', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig['Pendente'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.className} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddRental = () => {
    setFormData({
      vehicleId: '',
      customerName: '',
      customerPhone: '',
      customerDocument: '',
      startDate: '',
      endDate: '',
      dailyRate: '',
      totalAmount: '',
      paymentMethod: 'Dinheiro',
      status: 'Ativo',
      notes: ''
    });
    setShowAddDialog(true);
  };

  const handleViewRental = (rental) => {
    setSelectedRental(rental);
    setShowViewDialog(true);
  };

  const handleVehicleChange = (vehicleId) => {
    const vehicle = availableVehicles.find(v => v.id.toString() === vehicleId);
    if (vehicle) {
      setFormData({
        ...formData,
        vehicleId,
        dailyRate: vehicle.dailyRate.toString()
      });
      updateTotalAmount(formData.startDate, formData.endDate, vehicle.dailyRate);
    }
  };

  const updateTotalAmount = (startDate, endDate, dailyRate) => {
    if (startDate && endDate && dailyRate) {
      const days = calculateDays(startDate, endDate);
      const total = days * parseFloat(dailyRate);
      setFormData(prev => ({ ...prev, totalAmount: total.toString() }));
    }
  };

  const handleDateChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (newFormData.startDate && newFormData.endDate && newFormData.dailyRate) {
      updateTotalAmount(newFormData.startDate, newFormData.endDate, parseFloat(newFormData.dailyRate));
    }
  };

  const handleSaveRental = () => {
    if (!formData.vehicleId || !formData.customerName || !formData.startDate || !formData.endDate) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const vehicle = availableVehicles.find(v => v.id.toString() === formData.vehicleId);
    const newRental = {
      id: rentals.length + 1,
      ...formData,
      vehicleId: parseInt(formData.vehicleId),
      vehiclePlate: vehicle.plate,
      vehicleModel: vehicle.model,
      dailyRate: parseFloat(formData.dailyRate),
      totalAmount: parseFloat(formData.totalAmount),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRentals([...rentals, newRental]);
    setShowAddDialog(false);
    alert('Locação cadastrada com sucesso!');
  };

  const handleStatusChange = (rentalId, newStatus) => {
    const updatedRentals = rentals.map(rental => 
      rental.id === rentalId ? { ...rental, status: newStatus } : rental
    );
    setRentals(updatedRentals);
    alert(`Status da locação atualizado para: ${newStatus}`);
  };

  const generateContract = (rental) => {
    alert(`Gerando contrato para a locação de ${rental.customerName} - ${rental.vehicleModel}`);
  };

  const getSummary = () => {
    return rentals.reduce((acc, rental) => {
      acc.total++;
      acc.totalRevenue += rental.totalAmount;
      switch (rental.status) {
        case 'Ativo':
          acc.active++;
          break;
        case 'Finalizado':
          acc.completed++;
          break;
        case 'Pendente':
          acc.pending++;
          break;
        case 'Cancelado':
          acc.cancelled++;
          break;
      }
      return acc;
    }, { total: 0, active: 0, completed: 0, pending: 0, cancelled: 0, totalRevenue: 0 });
  };

  const summary = getSummary();

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
          <h1 className="text-3xl font-bold text-gray-900">Locações</h1>
          <p className="text-gray-600 mt-1">Gerencie as locações de veículos</p>
        </div>
        <Button onClick={handleAddRental} className="liberdade-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Locação
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{summary.active}</p>
              <p className="text-sm text-gray-600">Ativas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
              <p className="text-sm text-gray-600">Finalizadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{summary.pending}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{summary.cancelled}</p>
              <p className="text-sm text-gray-600">Canceladas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">R$ {summary.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Receita Total</p>
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
                  placeholder="Buscar por cliente, veículo ou placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Locações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRentals.map((rental) => (
          <Card key={rental.id} className="liberdade-card liberdade-hover-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{rental.vehicleModel}</CardTitle>
                  <CardDescription>{rental.vehiclePlate} • {rental.customerName}</CardDescription>
                </div>
                {getStatusBadge(rental.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Cliente:</span>
                  <span className="ml-1 font-medium">{rental.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Telefone:</span>
                  <span className="ml-1 font-medium">{rental.customerPhone}</span>
                </div>
                <div>
                  <span className="text-gray-600">Início:</span>
                  <span className="ml-1 font-medium">{new Date(rental.startDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Fim:</span>
                  <span className="ml-1 font-medium">{new Date(rental.endDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dias:</span>
                  <span className="ml-1 font-medium">{calculateDays(rental.startDate, rental.endDate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Pagamento:</span>
                  <span className="ml-1 font-medium">{rental.paymentMethod}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-lg font-bold text-green-600">R$ {rental.totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Diária</p>
                  <p className="text-sm font-medium">R$ {rental.dailyRate}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewRental(rental)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => generateContract(rental)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Contrato
                </Button>
                {rental.status === 'Ativo' && (
                  <Button 
                    size="sm" 
                    className="liberdade-gradient text-white"
                    onClick={() => handleStatusChange(rental.id, 'Finalizado')}
                  >
                    Finalizar
                  </Button>
                )}
                {rental.status === 'Pendente' && (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusChange(rental.id, 'Ativo')}
                  >
                    Resolver
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRentals.length === 0 && (
        <Card className="liberdade-card">
          <CardContent className="p-8 text-center">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma locação encontrada</p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece criando sua primeira locação'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog para Nova Locação */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Locação</DialogTitle>
            <DialogDescription>
              Registre uma nova locação de veículo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="vehicle">Veículo *</Label>
              <Select value={formData.vehicleId} onValueChange={handleVehicleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.model} - {vehicle.plate} (R$ {vehicle.dailyRate}/dia)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Nome do Cliente *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  placeholder="João Silva"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Telefone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customerDocument">CPF/CNPJ</Label>
              <Input
                id="customerDocument"
                value={formData.customerDocument}
                onChange={(e) => setFormData({...formData, customerDocument: e.target.value})}
                placeholder="123.456.789-00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Fim *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dailyRate">Valor Diária</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({...formData, dailyRate: e.target.value})}
                  placeholder="120"
                />
              </div>
              <div>
                <Label htmlFor="totalAmount">Valor Total</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Pagamento</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Cartão">Cartão</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
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
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRental} className="liberdade-gradient text-white">
              Salvar Locação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Visualizar Locação */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Locação</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Veículo:</p>
                  <p className="font-medium">{selectedRental.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-gray-600">Placa:</p>
                  <p className="font-medium">{selectedRental.vehiclePlate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Cliente:</p>
                  <p className="font-medium">{selectedRental.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Telefone:</p>
                  <p className="font-medium">{selectedRental.customerPhone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Documento:</p>
                  <p className="font-medium">{selectedRental.customerDocument}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status:</p>
                  {getStatusBadge(selectedRental.status)}
                </div>
                <div>
                  <p className="text-gray-600">Início:</p>
                  <p className="font-medium">{new Date(selectedRental.startDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fim:</p>
                  <p className="font-medium">{new Date(selectedRental.endDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Dias:</p>
                  <p className="font-medium">{calculateDays(selectedRental.startDate, selectedRental.endDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Pagamento:</p>
                  <p className="font-medium">{selectedRental.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-600">Valor Diária:</p>
                  <p className="font-medium">R$ {selectedRental.dailyRate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Valor Total:</p>
                  <p className="font-bold text-green-600">R$ {selectedRental.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              {selectedRental.notes && (
                <div>
                  <p className="text-gray-600 text-sm">Observações:</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedRental.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Fechar
            </Button>
            {selectedRental && (
              <Button onClick={() => generateContract(selectedRental)} className="liberdade-gradient text-white">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Contrato
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RentalTransactions;

