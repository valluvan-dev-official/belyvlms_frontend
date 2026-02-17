import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface RiskLevelBadgeProps {
  level: 'low' | 'medium' | 'high';
  className?: string;
  showIcon?: boolean;
}

export function RiskLevelBadge({ level, className = '', showIcon = true }: RiskLevelBadgeProps) {
  const riskConfig = {
    low: { 
      label: 'Low Risk', 
      icon: CheckCircle, 
      className: 'bg-green-50 text-green-700 border-green-200' 
    },
    medium: { 
      label: 'Medium Risk', 
      icon: AlertCircle, 
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200' 
    },
    high: { 
      label: 'High Risk', 
      icon: AlertTriangle, 
      className: 'bg-red-50 text-red-700 border-red-200' 
    },
  };

  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} ${className}`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
