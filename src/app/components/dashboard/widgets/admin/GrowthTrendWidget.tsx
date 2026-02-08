import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { CHART_COLORS } from '../../../charts/chartConfig';
import { Skeleton } from '../../../ui/skeleton';
import { DashboardService, GrowthData } from '../../../../services/DashboardService/DashboardService';

// Register Chart Components locally for this widget
echarts.use([
  LineChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent,
  CanvasRenderer
]);

interface GrowthTrendWidgetProps {
  isLoading?: boolean;
}

export default function GrowthTrendWidget({ isLoading: initialLoading = false }: GrowthTrendWidgetProps) {
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'6m' | '1y' | '30d' | 'all'>('6m');

  useEffect(() => {
    const fetchGrowth = async () => {
      setLoading(true);
      try {
        const result = await DashboardService.getGrowthTrend(period);
        setData(result);
      } catch (error) {
        console.error("Failed to load growth trend", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrowth();
  }, [period]);

  const getSubtitle = () => {
    switch (period) {
      case '6m': return 'Last 6 months performance';
      case '1y': return 'Last 1 year performance';
      case '30d': return 'Last 30 days performance';
      case 'all': return 'Since inception performance';
      default: return 'Performance trend';
    }
  };

  if (initialLoading || loading || !data || !data.series) {
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
      data: data.series?.map(s => s.name) || [],
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
      bottom: 25,
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.xAxis || [],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: 500,
        margin: 6
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
    series: data.series?.map((s, index) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      data: s.data,
      itemStyle: { 
        color: index === 0 ? (CHART_COLORS.primary || '#2563EB') : (CHART_COLORS.success || '#10B981') 
      },
      areaStyle: index === 0 ? {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(37, 99, 235, 0.3)' },
          { offset: 1, color: 'rgba(37, 99, 235, 0)' }
        ])
      } : undefined,
      lineStyle: { width: 3 }
    })) || []
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Growth Trend</h3>
          <p className="text-xs text-[#6E7191]">{getSubtitle()}</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none cursor-pointer"
        >
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
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
