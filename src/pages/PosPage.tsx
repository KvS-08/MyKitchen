import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCircleDollarToSlot } from 'react-icons/fa6';
import { GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { TbCashRegister } from 'react-icons/tb';

import { useBusinessSettings } from '../hooks/useBusinessSettings';
import Opencashier from '../components/pos/Opencashier';
import Closecashier from '../components/pos/Closecashier';
import { supabase } from '../lib/supabase';

// Define types for table views
type TableView = 'aperturas' | 'ventas' | 'gastos';

const PosPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<TableView>('ventas'); // Default to 'ventas'
  const [isEnabled, setIsEnabled] = useState(false); // New state for the toggle
  const [isOpencashierOpen, setIsOpencashierOpen] = useState(false); // State for Opencashier modal
  const [isClosecashierOpen, setIsClosecashierOpen] = useState(false); // State for Closecashier modal
  const [aperturasData, setAperturasData] = useState<any[]>([]); // State to store aperturas data

  const handleSaveApertura = async (data: { fecha: string; cajero: string; monto_inicial: number }) => {
     const { data: newApertura, error } = await supabase
       .from('aperturas')
       .insert([data])
       .select();

     if (error) {
       console.error('Error saving apertura:', error);
     } else if (newApertura) {
       setAperturasData((prev) => [...prev, ...newApertura]);
     }
   };

  const handleSaveCloseCashier = async (data: { hora_cierre: string; gastos: number; venta_total: number; utilidad: number; efectivo_cierre: number }) => {
    // This function will be implemented in Closecashier.tsx
  };

  const { settings } = useBusinessSettings();

  const formatTime = (date: Date) => {
    if (!settings || !settings.time_format) return date.toLocaleTimeString();

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: settings.time_format === '12h',
    };
    return date.toLocaleTimeString('es-ES', options);
  };
  return (
    <>
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
            className={`relative w-10 h-6 rounded-full transition-colors duration-200 ease-in-out ${isEnabled ? 'bg-green-500' : 'bg-gray-500'}`}
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
              className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`}
            ></span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Sección de Ventas */}
        <div
          className="bg-white dark:bg-gray-800 p-2 lg:p-4 rounded-lg shadow-md cursor-pointer"
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
          {/* Aquí iría la lógica y UI para las ventas */}
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
          {/* Aquí iría la lógica y UI para gastos */}
          <p className="hidden sm:block">Ingresa pagos a proveedores, Servicios Públicos o Arrendamientos.</p>
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

      {/* Sección de Transacciones */}
      <div className="mt-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4">
          <h2 className="text-2xl font-semibold mb-4 lg:mb-0 text-center lg:text-left">Transacciones</h2>
          <div className="flex space-x-2 justify-center lg:justify-end">
            <button className={`px-3 py-1 text-sm rounded-md ${activeView === 'aperturas' ? 'text-blue-600' : 'text-black dark:text-white'} hover:text-gray-300 flex items-center justify-center gap-2`} onClick={() => setActiveView('aperturas')}><TbCashRegister className="text-xl" /> <span className="text-black dark:text-white">Aperturas</span></button>
            <button className={`px-3 py-1 text-sm rounded-md ${activeView === 'ventas' ? 'text-green-600' : 'text-green-500'} hover:text-green-600 flex items-center justify-center gap-2`} onClick={() => setActiveView('ventas')}><FaCircleDollarToSlot className="text-xl" /> <span className="text-black dark:text-white">Ventas</span></button>
            <button className={`px-3 py-1 text-sm rounded-md ${activeView === 'gastos' ? 'text-red-600' : 'text-red-500'} hover:text-red-600 flex items-center justify-center gap-2`} onClick={() => setActiveView('gastos')}><FaCircleDollarToSlot className="text-xl" /> <span className="text-black dark:text-white">Gastos</span></button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-2 lg:p-4 rounded-lg shadow-md">
          {activeView === 'aperturas' && (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cajero</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Efectivo Apertura</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Venta total</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gastos</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Utileria</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Efectivo cierre</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hora Cierre</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {aperturasData.map((apertura, index) => (
                    <tr key={index}>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">{new Date(apertura.fecha).toLocaleString()}</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">{apertura.cajero}</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">{apertura.efectivo_apertura}</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                      <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300">-</td>
                    </tr>
                  ))}
                  {aperturasData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300 text-center">No hay aperturas de caja registradas.</td>
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
                    <th scope="col" className="px-0 py-0 sm:px-0 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Cajero</th>
                    <th scope="col" className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#Orden</th>
                    <th scope="col" className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Tipo de Orden</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Producto</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Notas</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                    <th scope="col" className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Tipo Pago</th>
                    <th scope="col" className="px-0 py-1 sm:px-2 sm:py-1 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Factura</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {/* Example Row - Replace with dynamic data later */}
                  <tr>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td className="px-1 py-2 sm:px-2 sm:py-3 md:px-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">-</td>
                  </tr>
                  {/* Add more rows or a message for no data */}
                </tbody>
              </table>
            </div>
          )}
          {activeView === 'gastos' && (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detalle</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {/* Example Row - Replace with dynamic data later */}
                  <tr>
                    <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300 hidden sm:table-cell">{venta.tipo_orden}</td>
                    <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300 hidden sm:table-cell">{venta.tipo_orden}</td>
                    <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300 hidden sm:table-cell">{venta.tipo_orden}</td>
                    <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300 hidden sm:table-cell">{venta.tipo_orden}</td>
                    <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300 hidden sm:table-cell">{venta.tipo_orden}</td>
                    <td className="px-0 py-0.5 sm:px-0.5 sm:py-1 md:px-1 md:py-2 whitespace-nowrap text-3xs sm:text-2xs text-gray-500 dark:text-gray-300 hidden sm:table-cell">{venta.tipo_orden}</td>
                  </tr>
                  {/* Add more rows or a message for no data */}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>


    </div>
    <Opencashier isOpen={isOpencashierOpen} onClose={() => setIsOpencashierOpen(false)} onSave={handleSaveApertura} />
    </>
  );
};

export default PosPage;