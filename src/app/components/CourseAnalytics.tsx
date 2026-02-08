import { BaseChart } from "./charts/BaseChart";
import { CHART_COLORS } from "./charts/chartConfig";

const enrollmentData = [
  { month: 'Jan', enrollments: 45, completions: 32 },
  { month: 'Feb', enrollments: 52, completions: 38 },
  { month: 'Mar', enrollments: 48, completions: 41 },
  { month: 'Apr', enrollments: 61, completions: 45 },
  { month: 'May', enrollments: 55, completions: 48 },
  { month: 'Jun', enrollments: 67, completions: 52 }
];

export function CourseAnalytics() {
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['Enrollments', 'Completions'],
      bottom: 0,
      icon: 'circle',
      textStyle: { color: CHART_COLORS.textLight }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: enrollmentData.map(d => d.month),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: CHART_COLORS.textLight }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: true, lineStyle: { type: 'dashed', color: CHART_COLORS.grid } },
      axisLabel: { color: CHART_COLORS.textLight }
    },
    series: [
      {
        name: 'Enrollments',
        type: 'bar',
        data: enrollmentData.map(d => d.enrollments),
        itemStyle: { color: '#4ECDC4', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 30
      },
      {
        name: 'Completions',
        type: 'bar',
        data: enrollmentData.map(d => d.completions),
        itemStyle: { color: '#44A08D', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 30
      }
    ]
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="font-semibold text-[#1A1D1F] mb-6">Course Enrollment Analytics</h3>
      
      <BaseChart options={chartOption} height={300} />
    </div>
  );
}
