import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const MenuPage: React.FC = () => {
  return (
    <div className="space-y-6 md:ml-32 pt-4 md:pt-0 md:-mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">
          {(() => {
            const formattedDate = format(new Date(), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es });
            const parts = formattedDate.split(',');
            if (parts.length > 0) {
              const day = parts[0];
              const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
              return [capitalizedDay, ...parts.slice(1)].join(',');
            }
            return formattedDate; // Fallback if split fails
          })()}
        </h1>
        <ThemeToggle />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Menú</h2>
        <div className="flex space-x-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Agregar Producto</button>
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Agregar Categoría</button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <p>Aquí puedes agregar el contenido de tu menú.</p>
      </div>
    </div>
  );
};

export default MenuPage;