import React from 'react';
import Portal from '../ui/Portal';
import { FaTimes } from 'react-icons/fa';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>
          
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Crear Nueva Orden</h2>
          <hr className="my-4 border-gray-300 dark:border-gray-600" />

          {/* Content for creating a new order will go here */}
          <p className="dark:text-gray-300">Este es el contenido del modal para crear una nueva orden.</p>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cerrar
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar Orden
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default CreateOrderModal;