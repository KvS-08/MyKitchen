import React from 'react';
import { Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface KitchenStatsProps {
  averagePreparationTime: string;
  completedOrders: number;
  topDishes: Array<{ name: string; count: number }>;
  estimatedWaitTime: string;
}

export const KitchenStats: React.FC<KitchenStatsProps> = ({
  averagePreparationTime,
  completedOrders,
  topDishes,
  estimatedWaitTime,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tiempo promedio de preparación
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {averagePreparationTime}
            </p>
          </div>
          <div className="p-2 rounded-md bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Órdenes completadas hoy
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {completedOrders}
            </p>
          </div>
          <div className="p-2 rounded-md bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Platos más vendidos hoy
          </h3>
          <div className="p-2 rounded-md bg-secondary-50 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        
        <ul className="space-y-2">
          {topDishes.map((dish, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300">{dish.name}</span>
              <span className="text-sm font-medium">{dish.count}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tiempo estimado de espera
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {estimatedWaitTime}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Para nuevas órdenes
            </p>
          </div>
          <div className="p-2 rounded-md bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};