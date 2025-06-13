import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const OptionsPage: React.FC = () => {
  const [isBusinessInfoOpen, setIsBusinessInfoOpen] = useState(false);

  const toggleBusinessInfo = () => {
    setIsBusinessInfoOpen(!isBusinessInfoOpen);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Opciones</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
        <button
          onClick={toggleBusinessInfo}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <span>Información del negocio</span>
          {isBusinessInfoOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {isBusinessInfoOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p>Aquí irá el contenido detallado de la información del negocio.</p>
            {/* Add more business info fields here */}
          </div>
        )}
      </div>

      {/* Add more accordion items here if needed */}
    </div>
  );
};

export default OptionsPage;