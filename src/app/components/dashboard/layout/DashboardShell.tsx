import { Suspense } from 'react';
import { getWidgetComponent } from '../registry/WidgetRegistry';
import { Skeleton } from '../../ui/skeleton';
import { WidgetConfig } from '../registry/dashboardConfig';
import { useAuth } from '../../../context/AuthContext';

interface DashboardShellProps {
  widgets?: WidgetConfig[];
  isLoading?: boolean;
}

const colSpanClasses: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
};

export default function DashboardShell({ widgets = [], isLoading = false }: DashboardShellProps) {
  const { hasPermission } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {widgets.map((widget) => {
          // Check if widget has specific permissions requirements
          if (widget.permissions && widget.permissions.length > 0) {
            const hasAccess = widget.permissions.every(p => hasPermission(p));
            if (!hasAccess) return null;
          }

          const WidgetComponent = getWidgetComponent(widget.componentId);
          if (!WidgetComponent) return null;

          const colSpanClass = colSpanClasses[widget.gridConfig.w] || 'lg:col-span-12';

          return (
            <div 
              key={widget.id} 
              className={`col-span-1 ${colSpanClass}`}
            >
              <Suspense fallback={<WidgetSkeleton />}>
                <WidgetComponent isLoading={isLoading} />
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WidgetSkeleton() {
  return <Skeleton className="w-full h-[320px] rounded-2xl" />;
}
