import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import { Skeleton } from '../../../ui/skeleton';
import { DashboardService, DistributionData } from '../../../../services/DashboardService/DashboardService';

// Register
echarts.use([
  BarChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent,
  SVGRenderer
]);

interface UserDistributionWidgetProps {
  isLoading?: boolean;
}

export default function UserDistributionWidget({ isLoading: initialLoading = false }: UserDistributionWidgetProps) {
  const [data, setData] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const result = await DashboardService.getUserDistribution();
        setData(result);
      } catch (error) {
        console.error("Failed to load user distribution", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, []);

  if (initialLoading || loading || !data || !data.categories) {
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
      left: '10%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      // containLabel: true // Removed to avoid warning: Specified grid.containLabel but no use(LegacyGridContainLabel)
    },
    xAxis: {
      type: 'category',
      data: data.categories || [],
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
        name: 'Active',
        type: 'bar',
        stack: 'total',
        barWidth: 20,
        itemStyle: {
          color: '#2563EB',
          borderRadius: [0, 0, 4, 4]
        },
        data: data.active_data || []
      },
      {
        name: 'Inactive',
        type: 'bar',
        stack: 'total',
        barWidth: 20,
        itemStyle: {
          color: '#E5E7EB',
          borderRadius: [4, 4, 0, 0]
        },
        data: data.inactive_data || []
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
