import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { CHART_COLORS } from './chartConfig';

interface BaseChartProps {
  options: echarts.EChartsOption;
  height?: string | number;
  loading?: boolean;
  className?: string;
  onEvents?: Record<string, (params: any) => void>;
}

export function BaseChart({
  options,
  height = '300px',
  loading = false,
  className,
  onEvents,
}: BaseChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 1. Initialize Chart
  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose existing instance if any (cleanup)
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // Initialize new instance
    const chart = echarts.init(chartRef.current, undefined, {
      renderer: 'canvas',
    });
    chartInstance.current = chart;

    // Attach events
    if (onEvents) {
      Object.entries(onEvents).forEach(([eventName, handler]) => {
        chart.on(eventName, handler);
      });
    }

    // Handle Resize
    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      chart.dispose();
      resizeObserver.disconnect();
    };
  }, []); // Run once on mount

  // 2. Update Options
  useEffect(() => {
    if (!chartInstance.current) return;

    // Apply default styles + user options
    const defaultOptions: echarts.EChartsOption = {
      textStyle: { fontFamily: 'Inter, sans-serif' },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: CHART_COLORS.grid,
        textStyle: { color: CHART_COLORS.text, fontSize: 12 },
        padding: [10, 15],
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;',
      },
      grid: { top: 40, right: 20, bottom: 40, left: 50 },
    };

    const finalOptions = echarts.util.merge(defaultOptions, options);
    
    chartInstance.current.setOption(finalOptions, {
      notMerge: true, // Complete refresh of data
      lazyUpdate: true,
    });
  }, [options]);

  // 3. Handle Loading
  useEffect(() => {
    if (!chartInstance.current) return;
    if (loading) {
      chartInstance.current.showLoading({
        text: '',
        color: CHART_COLORS.primary,
        textColor: CHART_COLORS.text,
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0,
      });
    } else {
      chartInstance.current.hideLoading();
    }
  }, [loading]);

  return (
    <div 
      ref={chartRef} 
      className={className} 
      style={{ 
        height: height, 
        width: '100%', 
        minHeight: '200px', // Safety fallback
        overflow: 'hidden'
      }} 
    />
  );
}
