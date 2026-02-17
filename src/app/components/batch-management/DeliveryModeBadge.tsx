import { Badge } from '../ui/badge';

interface DeliveryModeBadgeProps {
  mode: 'online' | 'offline' | 'hybrid';
  className?: string;
}

export function DeliveryModeBadge({ mode, className = '' }: DeliveryModeBadgeProps) {
  const modeConfig = {
    online: { label: 'Online', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    offline: { label: 'Offline', className: 'bg-orange-50 text-orange-700 border-orange-200' },
    hybrid: { label: 'Hybrid', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  const config = modeConfig[mode];

  return (
    <Badge variant="outline" className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
}
