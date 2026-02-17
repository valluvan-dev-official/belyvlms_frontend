import { Progress } from '../ui/progress';
import { Users } from 'lucide-react';

interface CapacityIndicatorProps {
  enrolled: number;
  capacity: number;
  waitlist?: number;
  showDetails?: boolean;
  className?: string;
}

export function CapacityIndicator({ 
  enrolled, 
  capacity, 
  waitlist = 0, 
  showDetails = true,
  className = '' 
}: CapacityIndicatorProps) {
  const utilizationPercentage = (enrolled / capacity) * 100;
  const isFull = enrolled >= capacity;

  const getUtilizationColor = () => {
    if (utilizationPercentage >= 95) return 'bg-red-500';
    if (utilizationPercentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">
              {enrolled} / {capacity} enrolled
            </span>
          </div>
          <span className={`font-medium ${isFull ? 'text-red-600' : 'text-gray-600'}`}>
            {utilizationPercentage.toFixed(0)}%
          </span>
        </div>
      )}
      
      <Progress 
        value={utilizationPercentage} 
        className="h-2"
      />
      
      {waitlist > 0 && (
        <div className="text-xs text-gray-500">
          +{waitlist} on waitlist
        </div>
      )}
    </div>
  );
}
