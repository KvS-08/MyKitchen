import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  prefix?: string;
  suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  prefix,
  suffix
}) => {
  return (
    <div className="card hover:border-l-4 hover:border-l-primary-500 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {prefix}{value}{suffix}
          </h3>
          
          {(change !== undefined && trend) && (
            <div className="mt-1 flex items-center">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-success-500" />
              ) : trend === 'down' ? (
                <ArrowDown className="h-4 w-4 text-danger-500" />
              ) : null}
              
              <span className={`text-sm font-medium ml-1 ${
                trend === 'up' ? 'text-success-500' : 
                trend === 'down' ? 'text-danger-500' : 
                'text-gray-500 dark:text-gray-400'
              }`}>
                {change}% desde ayer
              </span>
            </div>
          )}
        </div>
        
        <div className="p-2 rounded-md bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
          {icon}
        </div>
      </div>
    </div>
  );
};