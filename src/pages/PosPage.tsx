import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCircleDollarToSlot } from 'react-icons/fa6';
import { GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { TbCashRegister } from 'react-icons/tb';

import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useAuth } from '../hooks/useAuth';
import Opencashier from '../components/pos/Opencashier';
import Closecashier from '../components/pos/Closecashier';
import { supabase } from '../lib/supabase';

// Define types for table views
type TableView = 'aperturas' | 'ventas' | 'gastos';

interface Apertura {
  id: string;
  fecha: string;
  cajero: string;
  efectivo_apertura: number;
  venta_total: number | null;
  gastos: number | null;
  utilidad: number | null;
  efectivo_cierre: number | null;
  hora_cierre: string | null;
  estado: string | null;
}

interface Venta {
  id: string;
  fecha: string;
  cajero: string;
  numero_orden: string;
  tipo_orden: string | null;
  cliente: string | null;
  producto: string;
  notas: string | null;
  estado: string | null;
  valor: number;
  tipo_pago: string | null;
  factura: string | null;
}

interface Gasto {
  id: string;
  fecha: string;
  tipo: string;
  detalle: string;
  valor: number;
  estado: string | null;
}

const PosPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<TableView>('ventas');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isOpencashierOpen, setIsOpencashierOpen] = useState(false);
  const [isClosecashierOpen, setIsClosecashierOpen] = useState(false);
  const [aperturasData, setAperturasData] = useState<Apertura[]>([]);
  const [ventasData, setVentasData] = useState<Venta[]>([]);
  const [gastosData, setGastosData] = useState<Gasto[]>([]);

  const { settings } = useBusinessSettings();

  // Fetch data when component mounts or activeView changes
  useEffect(() => {
    if (user?.business_id) {
      fetchData();
    }
  }, [activeView, user?.business_id]);

  const fetchData = async () => {
    if (!user?.business_id) return;

    try {
      if (activeView === 'aperturas') {
        const { data, error } = await supabase
          .from('aperturas')
          .select('*')
          .eq('business_id', user.business_id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setAperturasData(data || []);
      } else if (activeView === 'ventas') {
        const { data, error } = await supabase
          .from('ventas')
          .select('*')
          .eq('business_id', user.business_id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setVentasData(data || []);
      } else if (activeView === 'gastos') {
        const { data, error } = await supabase
          .from('gastos')
          .select('*')
          .eq('business_id', user.business_id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setGastosData(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSaveApertura = async (data: { fecha: string; cajero: string; efectivo_apertura: number }) => {
    if (!user?.business_id || !user?.id) return;

    try {
      const { data: newApertura, error } = await supabase
        .from('aperturas')
        .insert([{
          ...data,
          business_id: user.business_id,
          created_by: user.id
        }])
        .select();

      if (error) throw error;
      
      if (newApertura) {
        setAperturasData((prev) => [newApertura[0], ...prev]);
      }
    } catch (error) {
      console.error('Error saving apertura:', error);
    }
  };

  const handleSaveCloseCashier = async (data: { 
    hora_cierre: string; 
    gastos: number; 
    venta_total: number; 
    utilidad: number; 
    efectivo_cierre: number 
  }) => {
    // Find the most recent open apertura and update it
    if (aperturasData.length > 0) {
      const openApertura = aperturasData.find(a => a.estado === 'abierta');
      if (openApertura) {
        try {
          const { error } = await supabase
            .from('aperturas')
            .update({
              hora_cierre: data.hora_cierre,
              gastos: data.gastos,
              venta_total: data.venta_total,
              utilidad: data.utilidad,
              efectivo_cierre: data.efectivo_cierre,
              estado: 'cerrada'
            })
            .eq('id', openApertura.id);

          if (error) throw error;
          
          // Refresh data
          fetchData();
        } catch (error) {
          console.error('Error closing cashier:', error);
        }
      }
    }
  };

  const formatTime = (date: Date) => {
    if (!settings || !settings.time_format) return date.toLocaleTimeString();

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: settings.time_format === '12h',
    };
    return date.toLocaleTimeString('es-ES', options);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    const currency = settings?.currency || 'HNL';
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="mt-3 lg:-mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl lg:text-3xl">
          {(() => {
            const date = new Date();
            const options: Intl.DateTimeFormatOptions = {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            };
            const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(date);
            return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
          })()}
        </h1>
        <div className="flex items-center space-x-1">
          <TbCashRegister className="text-2xl lg:text-3xl" />
          <div
            className={`relative w-10 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
              isEnabled ? 'bg-green-500' : 'bg-gray-500'
            }`}
            onClick={() => {
              const newState = !isEnabled;
              setIsEnabled(newState);
              if (newState) {
                setIsOpencashierOpen(true);
              } else {
                setIsClosecashierOpen(true);
              }
            }}
          >
            <span
              className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Sección de Ventas */}
        <div
          className="bg-white dark:bg-gray-800 p-2 lg:p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/sales')}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex sm:justify-between sm:items-center flex-col sm:flex-row">
            <span className="hidden sm:inline">Realizar una Venta</span>
            <div className="sm:hidden flex flex-col items-center mt-4">
              <GiReceiveMoney className="text-green-500" />
              <span className="text-base mt-2">Realizar Venta</span>
            </div>
            <GiReceiveMoney className="text-green-500 ml-auto hidden sm:block" />
          </h2>
          <p className="hidden sm:block">Ingresa órdenes, Abre cuentas para los clientes, Procesa pagos.</p>
        </div>

        {/* Sección de Gastos */}
        <div className="bg-white dark:bg-gray-800 p-2 lg:p-4 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex sm:justify-between sm:items-center flex-col sm:flex-row">
            <span className="hidden sm:inline">Ingresar un Gasto</span>
            <div className="sm:hidden flex flex-col items-center mt-4">
              <GiPayMoney className="text-red-500" />
              <span className="text-base mt-2">Ingresar Gasto</span>
            </div>
            <GiPayMoney className="text-red-500 ml-auto hidden sm:block" />
          </h2>
          <p className="hidden sm:block">Ingresa pagos a proveedores, Servicios Públicos o Arrendamientos.</p>
        </div>
      </div>

      {/* Sección de Transacciones */}
      <div className="mt-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4">
          <h2 className="text-2xl font-semibold mb-4 lg:mb-0 text-center lg:text-left">Transacciones</h2>
          <div className="flex space-x-2 justify-center lg:justify-end">
            <button 
              className={`px-3 py-1 text-sm rounded-md ${
                activeView === 'aperturas' ? 'text-blue-600' : 'text-black dark:text-white'
              } hover:text-gray-300 flex items-center justify-center gap-2`} 
              onClick={() => setActiveView('aperturas')}
            >
              <TbCashRegister className="text-xl" /> 
              <span className="text-black dark:text-white">Aperturas</span>
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${
                activeView === 'ventas' ? 'text-green-600' : 'text-green-500'
              } hover:text-green-600 flex items-center justify-center gap-2`} 
              onClick={() => setActiveView('ventas')}
            >
              <FaCircleDollarToSlot className="text-xl" /> 
              <span className="text-black dark:text-white">Ventas</span>
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${
                activeView === 'gastos' ? 'text-red-600' : 'text-red-500'
              } hover:text-red-600 flex items-center justify-center gap-2`} 
              onClick={() => setActiveView('gastos')}
            >
              <FaCircleDollarToSlot className="text-xl" /> 
              <span className="text-black dark:text-white">Gastos</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-2 lg:p-4 rounded-lg shadow-md">
          {activeView === 'aperturas' && (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cajero</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Efectivo Apertura</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Venta total</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gastos</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Utilidad</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Efectivo cierre</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hora Cierre</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {aperturasData.map((apertura) => (
                    <tr key={apertura.id}>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {formatDate(apertura.fecha)}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {apertura.cajero}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {formatCurrency(apertura.efectivo_apertura)}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {apertura.venta_total ? formatCurrency(apertura.venta_total) : '-'}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {apertura.gastos ? formatCurrency(apertura.gastos) : '-'}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {apertura.utilidad ? formatCurrency(apertura.utilidad) : '-'}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          apertura.estado === 'abierta' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {apertura.estado || 'abierta'}
                        </span>
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {apertura.efectivo_cierre ? formatCurrency(apertura.efectivo_cierre) : '-'}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {apertura.hora_cierre || '-'}
                      </td>
                    </tr>
                  ))}
                  {aperturasData.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-0 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                        No hay aperturas de caja registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeView === 'ventas' && (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-0 py-0 sm:px-0 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                    <th className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Cajero</th>
                    <th className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#Orden</th>
                    <th className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Tipo de Orden</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
                    <th className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Producto</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Notas</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                    <th className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                    <th className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Tipo Pago</th>
                    <th className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Factura</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {ventasData.map((venta) => (
                    <tr key={venta.id}>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {formatDate(venta.fecha)}
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">
                        {venta.cajero}
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {venta.numero_orden}
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">
                        {venta.tipo_orden || '-'}
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {venta.cliente || '-'}
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {venta.producto}
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">
                        {venta.notas || '-'}
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          venta.estado === 'completada' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {venta.estado || 'pendiente'}
                        </span>
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {formatCurrency(venta.valor)}
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">
                        {venta.tipo_pago || '-'}
                      </td>
                      <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">
                        {venta.factura || '-'}
                      </td>
                    </tr>
                  ))}
                  {ventasData.length === 0 && (
                    <tr>
                      <td colSpan={11} className="px-0 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                        No hay ventas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeView === 'gastos' && (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detalle</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {gastosData.map((gasto) => (
                    <tr key={gasto.id}>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {formatDate(gasto.fecha)}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {gasto.tipo}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {gasto.detalle}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">
                        {formatCurrency(gasto.valor)}
                      </td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          gasto.estado === 'pagado' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {gasto.estado || 'pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {gastosData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-0 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                        No hay gastos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Opencashier
        isOpen={isOpencashierOpen}
        onClose={() => setIsOpencashierOpen(false)}
        onSave={handleSaveApertura}
      />

      <Closecashier
        isOpen={isClosecashierOpen}
        onClose={() => setIsClosecashierOpen(false)}
        onSave={handleSaveCloseCashier}
      />
    </div>
  );
};

export default PosPage;