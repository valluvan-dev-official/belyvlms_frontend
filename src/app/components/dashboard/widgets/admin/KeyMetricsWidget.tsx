import { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle, BookOpen, Calendar, Clock } from 'lucide-react';
import { Skeleton } from '../../../ui/skeleton';
import { DashboardService, MetricItem } from '../../../../services/DashboardService/DashboardService';

interface KeyMetricsWidgetProps {
  isLoading?: boolean;
}

export default function KeyMetricsWidget({ isLoading: initialLoading = false }: KeyMetricsWidgetProps) {
  const [insights, setInsights] = useState<MetricItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await DashboardService.getKeyMetrics();
        setInsights(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load metrics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const getIcon = (label: string) => {
    switch (label) {
      case 'New Registrations': return TrendingUp;
      case 'Pending Requests': return AlertCircle;
      case 'Active Courses': return BookOpen;
      case 'Ongoing Batches': return Calendar;
      case 'Response Time': return Clock;
      default: return TrendingUp;
    }
  };

  const colorClasses: Record<string, { bg: string; icon: string; text: string; border: string }> = {
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-900', border: 'border-purple-200' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', text: 'text-orange-900', border: 'border-orange-200' },
    cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', text: 'text-cyan-900', border: 'border-cyan-200' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', text: 'text-indigo-900', border: 'border-indigo-200' },
    pink: { bg: 'bg-pink-50', icon: 'text-pink-600', text: 'text-pink-900', border: 'border-pink-200' }
  };

  if (initialLoading || loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
        <div className="mb-4">
          <Skeleton className="w-24 h-5 mb-1" />
          <Skeleton className="w-32 h-3" />
        </div>
        <div className="space-y-3 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-3">
              <div className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-12 h-4" />
                  </div>
                  <Skeleton className="w-16 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Key Metrics</h3>
        <p className="text-xs text-[#6E7191]">Real-time overview</p>
      </div>

      <div className="space-y-2.5 overflow-y-auto flex-1 pr-2">
        {insights.map((insight) => {
          const Icon = getIcon(insight.label);
          const colors = colorClasses[insight.color_theme] || colorClasses.purple;
          return (
            <div
              key={insight.id}
              className={`${colors.bg} ${colors.border} border rounded-xl p-3`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${colors.icon}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs font-semibold ${colors.text}`}>{insight.label}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {insight.change}
                    </span>
                  </div>
                  <div className={`text-xl font-bold ${colors.text} mb-0.5`}>{insight.value}</div>
                  <div className={`text-xs ${colors.text} opacity-75`}>{insight.detail}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
