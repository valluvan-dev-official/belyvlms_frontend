import { BaseChart } from "./charts/BaseChart";
import { CHART_COLORS } from "./charts/chartConfig";

const data = [
  { month: 'Jan', study: 40, exams: 0 },
  { month: 'Feb', study: 30, exams: 10 },
  { month: 'Mar', study: 60, exams: 20 },
  { month: 'Apr', study: 40, exams: 0 },
  { month: 'May', study: 30, exams: 10 },
];

export function HoursSpentChart() {
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
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
      data: data.map(d => d.month),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: CHART_COLORS.textLight }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: true, lineStyle: { type: 'dashed', color: CHART_COLORS.grid } },
      axisLabel: { formatter: '{value} hr', color: CHART_COLORS.textLight }
    },
    series: [
      {
        name: 'Study',
        type: 'bar',
        data: data.map(d => d.study),
        itemStyle: { color: '#FF9066', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 30,
        stack: 'total'
      },
      {
        name: 'Exams',
        type: 'bar',
        data: data.map(d => d.exams),
        itemStyle: { color: '#2E2F45', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 30,
        stack: 'total'
      }
    ]
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#1A1D1F]">Hours Spent</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#FF9066]"></div>
            <span className="text-sm text-[#6E7191]">Study</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#2E2F45]"></div>
            <span className="text-sm text-[#6E7191]">Exams</span>
          </div>
        </div>
      </div>

      <BaseChart options={chartOption} height={280} />
    </div>
  );
}
