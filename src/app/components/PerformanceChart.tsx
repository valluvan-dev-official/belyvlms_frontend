import { ChevronDown } from 'lucide-react';
import { BaseChart } from "./charts/BaseChart";

export function PerformanceChart() {
  const progress = 72; // 72%

  const chartOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: { show: false },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [{ offset: 0, color: '#4ECDC4' }, { offset: 1, color: '#44A08D' }]
            }
          },
          width: 12
        },
        axisLine: {
          lineStyle: {
            width: 12,
            color: [[1, '#F5F5F7']]
          }
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: [{ value: progress }],
        detail: { show: false }
      }
    ]
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#1A1D1F]">Performance</h3>
        <button className="flex items-center gap-1 text-sm text-[#6E7191] bg-[#F7F7F8] rounded-lg px-3 py-2">
          Monthly
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-48 h-48 relative">
           <BaseChart options={chartOption} height="100%" />
           
           {/* Center Content Overlay */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <div className="w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9066] to-[#FF6B9D] flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
           </div>
        </div>

        <div className="text-center mb-2 mt-[-20px] relative z-10">
          <div className="text-[#6E7191] text-sm mb-1">Your Point</div>
          <div className="text-[#1A1D1F] font-bold text-2xl">8,966</div>
        </div>

        <div className="flex items-center gap-1 text-sm text-[#4ECDC4]">
          <span>5th in Leaderboard</span>
          <span>🎯</span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-[#4ECDC4] to-[#44A08D]"></div>
            <span className="text-sm text-[#6E7191]">Point Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}
