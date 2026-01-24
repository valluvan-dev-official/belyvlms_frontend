import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent
} from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import { CHART_COLORS } from '../charts/chartConfig';
import { Skeleton } from '../ui/skeleton';

// Ensure all required components are registered for this specific chart
// This prevents "Component not registered" errors if the parent fails to do so
echarts.use([
  LineChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent,
  CanvasRenderer,
  SVGRenderer
]);

export function UserActivityChart({ isLoading }: { isLoading?: boolean }) {
  // Dummy Data
  const data = useMemo(() => [
    { day: 'Mon', active: 120, new: 45 },
    { day: 'Tue', active: 132, new: 52 },
    { day: 'Wed', active: 101, new: 38 },
    { day: 'Thu', active: 134, new: 65 },
    { day: 'Fri', active: 90,  new: 25 },
    { day: 'Sat', active: 230, new: 89 },
    { day: 'Sun', active: 210, new: 76 },
  ], []);

  const chartOption = useMemo(() => ({
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
      data: ['Active Users', 'New Signups'],
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
      data: data.map(d => d.day),
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
        name: 'Active Users',
        type: 'line',
        smooth: true,
        data: data.map(d => d.active),
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
        name: 'New Signups',
        type: 'line',
        smooth: true,
        data: data.map(d => d.new),
        itemStyle: { color: CHART_COLORS.success || '#10B981' },
        lineStyle: { width: 3 }
      }
    ]
  }), [data]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
        <Skeleton className="w-full flex-1 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1A1D1F]">User Activity</h3>
          <p className="text-sm text-[#6E7191]">Weekly active users and new signups</p>
        </div>
      </div>
      <div className="w-full h-[350px]">
        <ReactECharts 
          echarts={echarts}
          option={chartOption} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
}
