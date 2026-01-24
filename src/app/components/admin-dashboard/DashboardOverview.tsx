import { Users, UserCheck, TrendingUp, BookOpen, Calendar, AlertCircle, DollarSign, Clock, CheckCircle2, XCircle, ArrowUpRight, Activity, Layout } from 'lucide-react';
import ReactECharts from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent
} from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import { CHART_COLORS } from '../charts/chartConfig';
import { TodaySchedule } from './TodaySchedule';
import { Skeleton } from '../ui/skeleton';
import { useState, useEffect } from 'react';

// Register Chart Components
echarts.use([
  LineChart,
  BarChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent,
  CanvasRenderer,
  SVGRenderer
]);

export function DashboardOverview() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Data is static/mock for now, so we can show it immediately
    // or use a very short delay if we want a micro-interaction, but immediate is better for UX
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Stats Section */}
      <HeroStats isLoading={isLoading} />

      {/* Row 1: Growth Trend (2/3) + Side Panel (Key Metrics) (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GrowthTrendChart isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <KeyMetrics isLoading={isLoading} />
        </div>
      </div>

      {/* Row 2: User Distribution (2/3) + Today Schedule (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserDistributionChart isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <TodayScheduleWrapper isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

// Hero Stats - Clean 5-column layout with primary metrics
function HeroStats({ isLoading }: { isLoading: boolean }) {
  const stats = [
    {
      label: 'Total Users',
      value: '874',
      subtext: '650 Students • 24 Trainers • 200 Staff',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Active Courses',
      value: '35',
      subtext: 'Currently Running',
      change: '+5',
      changeType: 'positive' as const,
      icon: BookOpen,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      label: 'Active Batches',
      value: '18',
      subtext: '12 Running • 6 Upcoming',
      change: '+3',
      changeType: 'positive' as const,
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Pending Payments',
      value: '23',
      subtext: 'Requires Attention',
      change: null,
      changeType: 'warning' as const,
      icon: AlertCircle,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm h-[140px]">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
            <Skeleton className="w-24 h-8 mb-2" />
            <Skeleton className="w-32 h-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isWarning = stat.changeType === 'warning';
        return (
          <div
            key={stat.label}
            className={`relative bg-white rounded-2xl border shadow-sm p-4 overflow-hidden group hover:shadow-lg transition-all ${
              isWarning ? 'border-orange-300' : 'border-gray-200'
            }`}
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`}></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                    isWarning 
                      ? 'bg-orange-50 border border-orange-200' 
                      : 'bg-emerald-50'
                  }`}>
                    {!isWarning && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className={`text-xs font-bold ${
                      isWarning ? 'text-orange-600' : 'text-emerald-600'
                    }`}>{stat.change}</span>
                  </div>
                )}
                {isWarning && (
                  <div className="flex items-center gap-1 bg-orange-100 px-2.5 py-1 rounded-full animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-xs font-bold text-orange-700">Alert</span>
                  </div>
                )}
              </div>

              <div className={`text-3xl font-bold mb-1.5 ${
                isWarning ? 'text-orange-600' : 'text-[#1A1D1F]'
              }`}>
                {stat.value}
              </div>

              <div className={`text-sm font-semibold mb-1.5 ${
                isWarning ? 'text-orange-900' : 'text-[#1A1D1F]'
              }`}>
                {stat.label}
              </div>

              <div className={`text-xs leading-relaxed ${
                isWarning ? 'text-orange-700' : 'text-[#6E7191]'
              }`}>
                {stat.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Key Metrics - Right sidebar component
function KeyMetrics({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
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

  const insights = [
    {
      icon: TrendingUp,
      label: 'New Registrations',
      value: '28',
      detail: '5 Today • 28 This Month',
      change: '+15%',
      color: 'purple'
    },
    {
      icon: AlertCircle,
      label: 'Pending Requests',
      value: '12',
      detail: '8 Students • 4 Trainers',
      change: '-3',
      color: 'orange'
    },
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: '35',
      detail: '18 Full • 10 Filling • 7 Available',
      change: '+2',
      color: 'cyan'
    },
    {
      icon: Calendar,
      label: 'Ongoing Batches',
      value: '18',
      detail: '12 Regular • 6 Intensive',
      change: '+3',
      color: 'indigo'
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: '2.5 hrs',
      detail: 'Avg Processing Time',
      change: '-30m',
      color: 'pink'
    }
  ];

  const colorClasses: Record<string, { bg: string; icon: string; text: string; border: string }> = {
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-900',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      text: 'text-orange-900',
      border: 'border-orange-200'
    },
    cyan: {
      bg: 'bg-cyan-50',
      icon: 'text-cyan-600',
      text: 'text-cyan-900',
      border: 'border-cyan-200'
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      text: 'text-indigo-900',
      border: 'border-indigo-200'
    },
    pink: {
      bg: 'bg-pink-50',
      icon: 'text-pink-600',
      text: 'text-pink-900',
      border: 'border-pink-200'
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Key Metrics</h3>
        <p className="text-xs text-[#6E7191]">Real-time overview</p>
      </div>

      <div className="space-y-2.5 overflow-y-auto flex-1 pr-2">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const colors = colorClasses[insight.color];
          return (
            <div
              key={insight.label}
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

// Growth Trend Chart - Improved design with ECharts (User Activity Style)
function GrowthTrendChart({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] lg:h-[664px] flex flex-col">
        <div className="mb-4">
          <Skeleton className="w-32 h-6 mb-1" />
          <Skeleton className="w-48 h-4" />
        </div>
        <div className="flex-1 w-full h-full flex items-end justify-between px-4 pb-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="w-full rounded-t-lg" style={{ height: `${Math.floor(Math.random() * 60 + 20)}%` }} />
          ))}
        </div>
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        color: '#1A1D1F',
        fontSize: 12
      },
      padding: 10
    },
    legend: {
      data: ['Students', 'Trainers'],
      bottom: 0,
      icon: 'circle',
      textStyle: {
        color: '#6E7191',
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: 500,
        margin: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: '#E5E7EB',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: 500
      }
    },
    series: [
      {
        name: 'Students',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: { color: CHART_COLORS.primary || '#2563EB' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(37, 99, 235, 0.3)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0)' }
          ])
        },
        lineStyle: { width: 3 }
      },
      {
        name: 'Trainers',
        type: 'line',
        smooth: true,
        data: [45, 52, 38, 65, 25, 89, 76],
        itemStyle: { color: CHART_COLORS.success || '#10B981' },
        lineStyle: { width: 3 }
      }
    ]
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Growth Trend</h3>
          <p className="text-xs text-[#6E7191]">Last 6 months performance</p>
        </div>
      </div>

      <div className="flex-1 w-full h-full">
        <ReactECharts 
          echarts={echarts}
          option={option} 
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}

// User Distribution Chart - Improved design with ECharts
function UserDistributionChart({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-20 h-8 rounded-lg" />
        </div>
        <div className="flex-1 flex items-end justify-around px-8 pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 w-1/4">
              <Skeleton className="w-full rounded-t-lg" style={{ height: '160px' }} />
              <Skeleton className="w-16 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        color: '#1A1D1F',
        fontSize: 12
      },
      padding: 10
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Students', 'Trainers', 'Staff'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: 500
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: '#E5E7EB',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: 500
      }
    },
    series: [
      {
        name: 'Active',
        type: 'bar',
        data: [540, 20, 185],
        itemStyle: {
          color: '#10B981',
          borderRadius: [4, 4, 0, 0]
        },
        barGap: '20%'
      },
      {
        name: 'Inactive',
        type: 'bar',
        data: [110, 4, 15],
        itemStyle: {
          color: '#EF4444',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">User Distribution</h3>
          <p className="text-xs text-[#6E7191]">Active vs Inactive by role</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Inactive</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full">
        <ReactECharts 
          echarts={echarts}
          option={option} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
}

function TodayScheduleWrapper({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-20 h-8 rounded-lg" />
        </div>
        <div className="space-y-4 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-start p-3 border border-gray-50 rounded-xl">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <TodaySchedule />;
}
