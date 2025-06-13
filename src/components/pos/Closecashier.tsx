import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FaCircleDollarToSlot } from 'react-icons/fa6';
import { GiMoneyStack } from 'react-icons/gi';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface ClosecashierProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { hora_cierre: string; gastos: number; venta_total: number; utilidad: number; efectivo_cierre: number }) => void;
}

const Closecashier: React.FC<ClosecashierProps> = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuth();
  const [totalSales, setTotalSales] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [utility, setUtility] = useState<number>(0);
  const [cashClose, setCashClose] = useState<number>(0);
  const [closeTime, setCloseTime] = useState<string>('');

  useEffect(() => {
    if (isOpen && user?.business_id) {
      fetchTotalSales();
      fetchExpenses();
      
      // Set current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCloseTime(`${hours}:${minutes}`);
    }
  }, [isOpen, user?.business_id]);

  useEffect(() => {
    setUtility(totalSales - expenses);
  }, [totalSales, expenses]);

  const fetchTotalSales = async () => {
    if (!user?.business_id) return;

    try {
      // Get today's sales
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('ventas')
        .select('valor')
        .eq('business_id', user.business_id)
        .gte('fecha', today)
        .lt('fecha', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching sales data:', error);
        return;
      }

      if (data) {
        const sum = data.reduce((acc, sale) => acc + sale.valor, 0);
        setTotalSales(sum);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const fetchExpenses = async () => {
    if (!user?.business_id) return;

    try {
      // Get today's expenses
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('gastos')
        .select('valor')
        .eq('business_id', user.business_id)
        .gte('fecha', today)
        .lt('fecha', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching expenses data:', error);
        return;
      }

      if (data) {
        const sum = data.reduce((acc, expense) => acc + expense.valor, 0);
        setExpenses(sum);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  if (!isOpen) return null;

  const handleSaveCloseCashier = () => {
    if (!closeTime || cashClose === 0) {
      alert('Por favor completa todos los campos');
      return;
    }

    const data = {
      hora_cierre: closeTime,
      gastos: expenses,
      venta_total: totalSales,
      utilidad: utility,
      efectivo_cierre: cashClose,
    };

    onSave(data);
    onClose();
    
    // Reset form
    setCashClose(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500"
        >
          <FaTimes size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4 dark:text-white">Cerrar Caja</h2>
        <hr className="mb-4 border-gray-300 dark:border-gray-600" />
        
        <div className="flex space-x-4 mb-4">
          <div className="w-full">
            <label htmlFor="closeTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hora de Cierre
            </label>
            <input
              type="time"
              id="closeTime"
              name="closeTime"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="mt-1 block w-full pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="w-full">
            <label htmlFor="expenses" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gastos del Día
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaCircleDollarToSlot className="text-red-500" size={16} />
              </div>
              <input
                type="number"
                id="expenses"
                name="expenses"
                className="mt-1 block w-full pl-8 pr-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0.00"
                step="0.01"
                value={expenses.toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <div className="w-full">
            <label htmlFor="totalSales" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Venta Total del Día
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaCircleDollarToSlot className="text-green-500" size={16} />
              </div>
              <input
                type="number"
                id="totalSales"
                name="totalSales"
                className="mt-1 block w-full pl-8 pr-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0.00"
                step="0.01"
                value={totalSales.toFixed(2)}
                readOnly
              />
            </div>
          </div>
          
          <div className="w-full">
            <label htmlFor="utility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Utilidad del Día
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaCircleDollarToSlot className="text-blue-500" size={16} />
              </div>
              <input
                type="number"
                id="utility"
                name="utility"
                className="mt-1 block w-full pl-8 pr-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0.00"
                step="0.01"
                value={utility.toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <div className="w-full">
            <label htmlFor="cashClose" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Efectivo en Caja al Cierre
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <GiMoneyStack className="text-green-500" size={16} />
              </div>
              <input
                type="number"
                id="cashClose"
                name="cashClose"
                className="mt-1 block w-full pl-8 pr-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={cashClose}
                onChange={(e) => setCashClose(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
        
        <hr className="mb-4 border-gray-300 dark:border-gray-600" />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveCloseCashier}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cerrar Caja
          </button>
        </div>
      </div>
    </div>
  );
};

export default Closecashier;