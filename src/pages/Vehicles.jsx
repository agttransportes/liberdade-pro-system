import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useNotification, useConfirmation } from '../hooks/useNotification';
import { 
  Car, 
  Plus, 
  Edit, 
  Eye, 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Wrench,
  Search,
  Filter,
  Trash2,
  Loader2
} from 'lucide-react';
import '../App.css';

const Vehicles = () => {
  const { showSuccess, showError, showInfo } = useNotification();
  const { confirm } = useConfirmation();
  
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    year: '',
    color: '',
    fuelType: 'Flex',
    category: 'Sedan',
    rentalValue: '',
    status: 'Disponível',
    documentStatus: 'Regular'
  });

  // Dados de exemplo para demonstração
  const exampleVehicles = useMemo(() => [
    {
      id: 1,
      plate: 'ABC-1234',
      model: 'Toyota Corolla',
      year: 2022,
      status: 'Disponível',
      rentalValue: 120,
      documentStatus: 'Regular',
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-11-15',
      color: 'Prata',
      fuelType: 'Flex',
      category: 'Sedan',
      mileage: 15000
    },
    {
      id: 2,
      plate: 'DEF-5678',
      model: 'Honda Civic',
      year: 2021,
      status: 'Alugado',
      rentalValue: 110,
      documentStatus: 'Regular',
      lastMaintenance: '2024-06-20',
      nextMaintenance: '2024-12-20',
      color: 'Preto',
      fuelType: 'Flex',
      category: 'Sedan',
      mileage: 25000
    },
    {
      id: 3,
      plate: 'GHI-9012',
      model: 'Jeep Renegade',
      year: 2023,
      status: 'Manutenção',
      rentalValue: 180,
      documentStatus: 'Pendente',
      lastMaintenance: '2024-07-10',
      nextMaintenance: '2025-01-10',
      color: 'Branco',
      fuelType: 'Flex',
      category: 'SUV',
      mileage: 8000
    },
    {
      id: 4,
      plate: 'JKL-3456',
      model: 'Volkswagen Gol',
      year: 2020,
      status: 'Disponível',
      rentalValue: 80,
      documentStatus: 'Regular',
      lastMaintenance: '2024-04-10',
      nextMaintenance: '2024-10-10',
      color: 'Azul',
      fuelType: 'Flex',
      category: 'Hatch',
      mileage: 45000
    }
  ], []);

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true);
    setTimeout(() => {
      setVehicles(exampleVehicles);
      setLoading(false);
    }, 1000);
  }, [exampleVehicles]);

  // Otimização com useMemo para filtros
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  // Otimização com useMemo para resumo da frota
  const fleetSummary = useMemo(() => {
    return vehicles.reduce((acc, vehicle) => {
      acc.total++;
      switch (vehicle.status) {
        case 'Disponível':
          acc.available++;
          break;
        case 'Alugado':
          acc.rented++;
          break;
        case 'Manutenção':
          acc.maintenance++;
          break;
        default:
          acc.inactive++;
      }
      return acc;
    }, { total: 0, available: 0, rented: 0, maintenance: 0, inactive: 0 });
  }, [vehicles]);

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

  const getDocumentStatusBadge = useCallback((status) => {
    const statusConfig = {
      'Regular': { className: 'bg-green-100 text-green-800 border-green-200' },
      'Pendente': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'Vencido': { className: 'bg-red-100 text-red-800 border-red-200' }
    };
    
    const config = statusConfig[status] || statusConfig['Vencido'];
    
    return (
      <Badge variant="outline" className={config.className}>
        {status}
      </Badge>
    );
  }, []);

  const handleAddVehicle = useCallback(() => {
    setFormData({
      plate: '',
      model: '',
      year: '',
      color: '',
      fuelType: 'Flex',
      category: 'Sedan',
      rentalValue: '',
      status: 'Disponível',
      documentStatus: 'Regular'
    });
    setShowAddDialog(true);
  }, []);

  const handleEditVehicle = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      plate: vehicle.plate,
      model: vehicle.model,
      year: vehicle.year.toString(),
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      category: vehicle.category,
      rentalValue: vehicle.rentalValue.toString(),
      status: vehicle.status,
      documentStatus: vehicle.documentStatus
    });
    setShowEditDialog(true);
  }, []);

  const handleViewVehicle = useCallback((vehicle) => {
    showInfo(
      'Detalhes do Veículo',
      `${vehicle.model} (${vehicle.plate}) - Status: ${vehicle.status}`
    );
  }, [showInfo]);

  const handleDeleteVehicle = useCallback(async (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    const confirmed = await confirm({
      title: 'Excluir Veículo',
      message: `Tem certeza que deseja excluir o veículo ${vehicle?.model} (${vehicle?.plate})?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
        showSuccess(
          'Veículo excluído',
          'O veículo foi removido com sucesso da frota.'
        );
      } catch {
        showError(
          'Erro ao excluir',
          'Não foi possível excluir o veículo. Tente novamente.'
        );
      }
    }
  }, [vehicles, confirm, showSuccess, showError]);

  const validateForm = useCallback(() => {
    const errors = [];
    
    if (!formData.plate.trim()) errors.push('Placa é obrigatória');
    if (!formData.model.trim()) errors.push('Modelo é obrigatório');
    if (!formData.year || isNaN(formData.year)) errors.push('Ano deve ser um número válido');
    if (!formData.rentalValue || isNaN(formData.rentalValue)) errors.push('Valor de aluguel deve ser um número válido');
    
    return errors;
  }, [formData]);

  const handleSaveVehicle = useCallback(async () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      showError(
        'Dados inválidos',
        errors.join(', ')
      );
      return;
    }

    try {
      if (selectedVehicle) {
        // Editar veículo existente
        const updatedVehicles = vehicles.map(v => 
          v.id === selectedVehicle.id 
            ? { ...v, ...formData, year: parseInt(formData.year), rentalValue: parseFloat(formData.rentalValue) }
            : v
        );
        setVehicles(updatedVehicles);
        setShowEditDialog(false);
        showSuccess(
          'Veículo atualizado',
          'As informações do veículo foram atualizadas com sucesso.'
        );
      } else {
        // Adicionar novo veículo
        const newVehicle = {
          id: vehicles.length + 1,
          ...formData,
          year: parseInt(formData.year),
          rentalValue: parseFloat(formData.rentalValue),
          lastMaintenance: new Date().toISOString().split('T')[0],
          nextMaintenance: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mileage: 0
        };
        setVehicles([...vehicles, newVehicle]);
        setShowAddDialog(false);
        showSuccess(
          'Veículo cadastrado',
          'O novo veículo foi adicionado à frota com sucesso.'
        );
      }
      
      setSelectedVehicle(null);
    } catch {
      showError(
        'Erro ao salvar',
        'Não foi possível salvar o veículo. Tente novamente.'
      );
    }
  }, [formData, selectedVehicle, vehicles, validateForm, showSuccess, showError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Veículos</h1>
          <p className="text-gray-600 mt-1">Gerencie sua frota de veículos</p>
        </div>
        <Button onClick={handleAddVehicle} className="liberdade-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Veículo
        </Button>
      </div>

      {/* Resumo da Frota */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{fleetSummary.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{fleetSummary.available}</p>
              <p className="text-sm text-gray-600">Disponíveis</p>
            </div>
          </CardContent>
        </Card>
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{fleetSummary.rented}</p>
              <p className="text-sm text-gray-600">Alugados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{fleetSummary.maintenance}</p>
              <p className="text-sm text-gray-600">Manutenção</p>
            </div>
          </CardContent>
        </Card>
        <Card className="liberdade-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{fleetSummary.inactive}</p>
              <p className="text-sm text-gray-600">Inativos</p>
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
                  placeholder="Buscar por modelo ou placa..."
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
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Alugado">Alugado</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Veículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="liberdade-card liberdade-hover-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.model}</CardTitle>
                  <CardDescription>{vehicle.plate} • {vehicle.year}</CardDescription>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Cor:</span>
                  <span className="ml-1 font-medium">{vehicle.color}</span>
                </div>
                <div>
                  <span className="text-gray-600">Categoria:</span>
                  <span className="ml-1 font-medium">{vehicle.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Combustível:</span>
                  <span className="ml-1 font-medium">{vehicle.fuelType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Km:</span>
                  <span className="ml-1 font-medium">{vehicle.mileage?.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <div>
                  <p className="text-sm text-gray-600">Valor/dia</p>
                  <p className="text-lg font-bold text-green-600">R$ {vehicle.rentalValue}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Documentos</p>
                  {getDocumentStatusBadge(vehicle.documentStatus)}
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewVehicle(vehicle)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleEditVehicle(vehicle)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="liberdade-card">
          <CardContent className="p-8 text-center">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum veículo encontrado</p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece adicionando seu primeiro veículo'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog para Adicionar Veículo */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Veículo</DialogTitle>
            <DialogDescription>
              Adicione um novo veículo à sua frota
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plate">Placa *</Label>
                <Input
                  id="plate"
                  value={formData.plate}
                  onChange={(e) => setFormData({...formData, plate: e.target.value})}
                  placeholder="ABC-1234"
                />
              </div>
              <div>
                <Label htmlFor="year">Ano *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="2023"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                placeholder="Toyota Corolla"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Cor</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  placeholder="Prata"
                />
              </div>
              <div>
                <Label htmlFor="rentalValue">Valor/dia *</Label>
                <Input
                  id="rentalValue"
                  type="number"
                  step="0.01"
                  value={formData.rentalValue}
                  onChange={(e) => setFormData({...formData, rentalValue: e.target.value})}
                  placeholder="120.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fuelType">Combustível</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData({...formData, fuelType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flex">Flex</SelectItem>
                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                    <SelectItem value="Etanol">Etanol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Elétrico">Elétrico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="Hatch">Hatch</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveVehicle} className="liberdade-gradient text-white">
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Veículo */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Veículo</DialogTitle>
            <DialogDescription>
              Atualize as informações do veículo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-plate">Placa *</Label>
                <Input
                  id="edit-plate"
                  value={formData.plate}
                  onChange={(e) => setFormData({...formData, plate: e.target.value})}
                  placeholder="ABC-1234"
                />
              </div>
              <div>
                <Label htmlFor="edit-year">Ano *</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="2023"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-model">Modelo *</Label>
              <Input
                id="edit-model"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                placeholder="Toyota Corolla"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-color">Cor</Label>
                <Input
                  id="edit-color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  placeholder="Prata"
                />
              </div>
              <div>
                <Label htmlFor="edit-rentalValue">Valor/dia *</Label>
                <Input
                  id="edit-rentalValue"
                  type="number"
                  step="0.01"
                  value={formData.rentalValue}
                  onChange={(e) => setFormData({...formData, rentalValue: e.target.value})}
                  placeholder="120.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-fuelType">Combustível</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData({...formData, fuelType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flex">Flex</SelectItem>
                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                    <SelectItem value="Etanol">Etanol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Elétrico">Elétrico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="Hatch">Hatch</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Alugado">Alugado</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-documentStatus">Documentos</Label>
                <Select value={formData.documentStatus} onValueChange={(value) => setFormData({...formData, documentStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveVehicle} className="liberdade-gradient text-white">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vehicles;

