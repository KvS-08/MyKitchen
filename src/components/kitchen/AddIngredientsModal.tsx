import React from 'react';
import Portal from '../ui/Portal';

interface AddIngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useState, useEffect } from 'react';

const AddIngredientsModal: React.FC<AddIngredientsModalProps> = ({ isOpen, onClose }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [idp, setIdp] = useState('');
  const [dailyCounter, setDailyCounter] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, '0');

      const lastIdpDate = localStorage.getItem('lastIdpDate');
      const lastIdpCounter = parseInt(localStorage.getItem('lastIdpCounter') || '0');

      let currentCounter = lastIdpCounter;

      if (lastIdpDate) {
        const [lastYear, lastMonth, lastDay] = lastIdpDate.split('-');
        if (parseInt(lastYear) !== today.getFullYear() || parseInt(lastMonth) !== (today.getMonth() + 1)) {
          // New month, reset counter
          currentCounter = 1;
        } else {
          // Same month, increment counter
          currentCounter++;
        }
      } else {
        // First time, start counter at 1
        currentCounter = 1;
      }

      const formattedCounter = currentCounter.toString().padStart(2, '0');
      setIdp(`${year}${month}${formattedCounter}`);
      setDailyCounter(currentCounter);

      localStorage.setItem('lastIdpDate', `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`);
      localStorage.setItem('lastIdpCounter', currentCounter.toString());
    }
  }, [isOpen]);
  const [nombre, setNombre] = useState('');
  const [costo, setCosto] = useState('');
  const [cu, setCu] = useState('');
  const [precio, setPrecio] = useState('');
  const [stockInicial, setStockInicial] = useState('');
  const [stockActual, setStockActual] = useState('');

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Agregar Ingrediente</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
              <input type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="idp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">IDP</label>
              <input type="text" id="idp" value={idp} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="costo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Costo</label>
              <input type="number" id="costo" value={costo} onChange={(e) => setCosto(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="cu" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Costo Unitario</label>
              <input type="text" id="cu" value={cu} onChange={(e) => setCu(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
              <input type="number" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="stockInicial" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Inicial</label>
              <input type="number" id="stockInicial" value={stockInicial} onChange={(e) => setStockInicial(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="stockActual" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Actual</label>
              <input type="number" id="stockActual" value={stockActual} onChange={(e) => setStockActual(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AddIngredientsModal;