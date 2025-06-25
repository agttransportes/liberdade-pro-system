import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import '../App.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Perfil
    name: 'Administrador',
    email: 'admin@liberdadepro.com',
    phone: '(11) 99999-9999',
    
    // Notificações
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    maintenanceAlerts: true,
    paymentReminders: true,
    
    // Sistema
    theme: 'light',
    language: 'pt-BR',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    
    // Negócio
    companyName: 'Liberdade Pro Locações',
    companyDocument: '12.345.678/0001-90',
    companyAddress: 'Rua das Flores, 123 - São Paulo, SP',
    
    // Backup
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  const handleExportData = () => {
    alert('Exportando dados do sistema...');
  };

  const handleImportData = () => {
    alert('Importando dados para o sistema...');
  };

  const handleResetData = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      alert('Dados resetados com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Gerencie as configurações do sistema</p>
        </div>
        <Button onClick={handleSave} className="liberdade-gradient text-white hover:opacity-90">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil do Usuário */}
        <Card className="liberdade-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>Informações pessoais e de contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => handleSettingChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleSettingChange('phone', e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="liberdade-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notificações
            </CardTitle>
            <CardDescription>Configure como receber alertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email</Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS</Label>
              <Switch
                id="sms-notifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push</Label>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-alerts">Alertas de Manutenção</Label>
              <Switch
                id="maintenance-alerts"
                checked={settings.maintenanceAlerts}
                onCheckedChange={(checked) => handleSettingChange('maintenanceAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="payment-reminders">Lembretes de Pagamento</Label>
              <Switch
                id="payment-reminders"
                checked={settings.paymentReminders}
                onCheckedChange={(checked) => handleSettingChange('paymentReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sistema */}
        <Card className="liberdade-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Preferências do Sistema
            </CardTitle>
            <CardDescription>Personalize a interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Tema</Label>
              <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Idioma</Label>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Moeda</Label>
              <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFormat">Formato de Data</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                  <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações da Empresa */}
        <Card className="liberdade-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>Dados da sua empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="companyDocument">CNPJ</Label>
              <Input
                id="companyDocument"
                value={settings.companyDocument}
                onChange={(e) => handleSettingChange('companyDocument', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="companyAddress">Endereço</Label>
              <Input
                id="companyAddress"
                value={settings.companyAddress}
                onChange={(e) => handleSettingChange('companyAddress', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Backup e Dados */}
        <Card className="liberdade-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Backup e Dados
            </CardTitle>
            <CardDescription>Gerencie seus dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">Backup Automático</Label>
              <Switch
                id="auto-backup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
              />
            </div>
            
            {settings.autoBackup && (
              <div>
                <Label htmlFor="backupFrequency">Frequência</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Dados
              </Button>
              <Button variant="outline" className="w-full" onClick={handleImportData}>
                <Upload className="w-4 h-4 mr-2" />
                Importar Dados
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:bg-red-50" onClick={handleResetData}>
                <Trash2 className="w-4 h-4 mr-2" />
                Resetar Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Sistema */}
      <Card className="liberdade-card">
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
          <CardDescription>Detalhes sobre a versão e status do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-medium">Versão</p>
              <p className="text-lg font-bold text-blue-700">v2.1.0</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-green-600 font-medium">Status</p>
              <p className="text-lg font-bold text-green-700">Online</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-purple-600 font-medium">Último Backup</p>
              <p className="text-lg font-bold text-purple-700">Hoje</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-orange-600 font-medium">Uptime</p>
              <p className="text-lg font-bold text-orange-700">99.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

